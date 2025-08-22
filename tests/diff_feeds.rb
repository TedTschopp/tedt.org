#!/usr/bin/env ruby
require 'json'
require 'yaml'
require 'digest'
require 'fileutils'

ROOT = File.expand_path('..', __dir__)
SNAPSHOT_DIR = File.join(ROOT, 'tests', 'feed_snapshots')
CONFIG_FILE = File.join(ROOT, 'tests', 'config', 'feed_diff.yml')

# Load configuration
def load_config
  return {} unless File.exist?(CONFIG_FILE)
  YAML.load_file(CONFIG_FILE)
rescue => e
  puts "Warning: Could not load config #{CONFIG_FILE}: #{e.message}"
  {}
end

# Check for bypass flags
def bypass_enabled?
  # Environment variable bypass
  return true if ENV['ALLOW_FEED_DIFF'] == '1'
  
  # Commit message bypass
  if ENV['GITHUB_SHA'] || system('git rev-parse --git-dir >/dev/null 2>&1')
    begin
      commit_msg = `git log -1 --pretty=%B 2>/dev/null`.strip
      return true if commit_msg.include?('[feed-diff-accept]')
    rescue
      # Ignore git errors
    end
  end
  
  false
end

# Normalize feed data by removing non-deterministic fields
def normalize_feed(data, ignore_fields = [])
  normalized = JSON.parse(data.to_json)  # Deep copy
  
  # Default fields to ignore
  default_ignore = ['date_published', 'date_modified', 'build_timestamp']
  ignore_fields = (default_ignore + ignore_fields).uniq
  
  # Remove ignored fields recursively
  remove_ignored_fields(normalized, ignore_fields)
  
  # Sort keys for consistent comparison
  sort_keys_recursively(normalized)
end

def remove_ignored_fields(obj, ignore_fields)
  case obj
  when Hash
    ignore_fields.each { |field| obj.delete(field) }
    obj.each_value { |v| remove_ignored_fields(v, ignore_fields) }
  when Array
    obj.each { |item| remove_ignored_fields(item, ignore_fields) }
  end
  obj
end

def sort_keys_recursively(obj)
  case obj
  when Hash
    sorted = {}
    obj.keys.sort.each { |k| sorted[k] = sort_keys_recursively(obj[k]) }
    sorted
  when Array
    obj.map { |item| sort_keys_recursively(item) }
  else
    obj
  end
end

# Load and normalize a feed file
def load_and_normalize_feed(path, ignore_fields = [])
  return nil unless File.exist?(path)
  
  begin
    data = JSON.parse(File.read(path))
    normalize_feed(data, ignore_fields)
  rescue JSON::ParserError => e
    puts "ERROR: Invalid JSON in #{path}: #{e.message}"
    exit 1
  rescue => e
    puts "ERROR: Could not read #{path}: #{e.message}"
    exit 1
  end
end

# Generate item fingerprint for comparison
def item_fingerprint(item)
  key_fields = [
    item['title']&.strip,
    item['url']&.strip,
    item['id']&.strip,
    (item['summary'] || item['content_text'])&.to_s&.strip[0..200] # First 200 chars
  ].compact.join('|')
  
  Digest::SHA256.hexdigest(key_fields)[0..12]  # Short hash for readability
end

# Compare two normalized feeds and generate diff report
def compare_feeds(baseline, current, feed_name, config)
  return { status: 'missing_baseline', changes: [] } unless baseline
  return { status: 'missing_current', changes: [] } unless current
  
  changes = []
  
  baseline_items = baseline['items'] || []
  current_items = current['items'] || []
  
  # Generate fingerprints
  baseline_fps = baseline_items.map { |item| item_fingerprint(item) }
  current_fps = current_items.map { |item| item_fingerprint(item) }
  
  # Check for removed items
  removed_count = 0
  baseline_fps.each_with_index do |fp, idx|
    unless current_fps.include?(fp)
      removed_count += 1
      item = baseline_items[idx]
      changes << {
        type: 'removed',
        title: item['title'],
        url: item['url'] || item['id'],
        fingerprint: fp
      }
    end
  end
  
  # Check for added items
  added_count = 0
  current_fps.each_with_index do |fp, idx|
    unless baseline_fps.include?(fp)
      added_count += 1
      item = current_items[idx]
      changes << {
        type: 'added',
        title: item['title'],
        url: item['url'] || item['id'],
        fingerprint: fp
      }
    end
  end
  
  # Check for content changes in existing items
  content_changes = 0
  baseline_items.each_with_index do |baseline_item, b_idx|
    baseline_fp = baseline_fps[b_idx]
    current_idx = current_fps.index(baseline_fp)
    
    if current_idx
      current_item = current_items[current_idx]
      
      # Check title changes
      if baseline_item['title'] != current_item['title']
        changes << {
          type: 'title_changed',
          url: baseline_item['url'] || baseline_item['id'],
          old_title: baseline_item['title'],
          new_title: current_item['title'],
          fingerprint: baseline_fp
        }
      end
      
      # Check content length changes
      baseline_content = (baseline_item['content_text'] || baseline_item['summary'] || '').to_s
      current_content = (current_item['content_text'] || current_item['summary'] || '').to_s
      
      if baseline_content.length > 0 && current_content.length > 0
        length_change_pct = ((current_content.length - baseline_content.length).abs.to_f / baseline_content.length * 100).round(1)
        max_content_change = config['max_content_length_change_pct'] || 10
        
        if length_change_pct > max_content_change
          content_changes += 1
          changes << {
            type: 'content_length_changed',
            url: baseline_item['url'] || baseline_item['id'],
            title: baseline_item['title'],
            old_length: baseline_content.length,
            new_length: current_content.length,
            change_pct: length_change_pct,
            fingerprint: baseline_fp
          }
        end
      end
    end
  end
  
  # Determine if changes exceed thresholds
  max_removed = config['max_removed_items'] || 0
  max_added = config['max_added_items'] || 5
  max_title_delta = config['max_title_delta'] || 0
  
  exceeds_threshold = false
  exceeds_threshold = true if removed_count > max_removed
  exceeds_threshold = true if added_count > max_added
  exceeds_threshold = true if changes.count { |c| c[:type] == 'title_changed' } > max_title_delta
  
  {
    status: exceeds_threshold ? 'threshold_exceeded' : 'within_threshold',
    added_count: added_count,
    removed_count: removed_count,
    content_changes: content_changes,
    title_changes: changes.count { |c| c[:type] == 'title_changed' },
    total_changes: changes.length,
    changes: changes.sort_by { |c| [c[:type], c[:title] || ''] }
  }
end

# Save normalized feed as snapshot
def save_snapshot(feed_data, snapshot_path)
  FileUtils.mkdir_p(File.dirname(snapshot_path))
  File.write(snapshot_path, JSON.pretty_generate(feed_data))
  puts "Saved snapshot: #{snapshot_path}"
end

# Print diff report
def print_diff_report(feed_name, diff_result)
  puts "\n=== #{feed_name} Feed Diff Report ==="
  
  case diff_result[:status]
  when 'missing_baseline'
    puts "Status: No baseline found (first run)"
    return
  when 'missing_current'
    puts "Status: Current feed missing"
    return
  when 'within_threshold'
    puts "Status: PASS (changes within threshold)"
  when 'threshold_exceeded'
    puts "Status: FAIL (changes exceed threshold)"
  end
  
  puts "Summary:"
  puts "  Items added: #{diff_result[:added_count]}"
  puts "  Items removed: #{diff_result[:removed_count]}"
  puts "  Title changes: #{diff_result[:title_changes]}"
  puts "  Content changes: #{diff_result[:content_changes]}"
  puts "  Total changes: #{diff_result[:total_changes]}"
  
  if diff_result[:changes].any?
    puts "\nTop 5 Changes:"
    diff_result[:changes].first(5).each do |change|
      case change[:type]
      when 'added'
        puts "  + Added: \"#{change[:title]}\" (#{change[:url]})"
      when 'removed'
        puts "  - Removed: \"#{change[:title]}\" (#{change[:url]})"
      when 'title_changed'
        puts "  ~ Title: \"#{change[:old_title]}\" -> \"#{change[:new_title]}\" (#{change[:url]})"
      when 'content_length_changed'
        puts "  ~ Content: \"#{change[:title]}\" length #{change[:old_length]} -> #{change[:new_length]} (#{change[:change_pct]}% change)"
      end
    end
  end
end

# Main execution
def main
  config = load_config
  
  # Check for bypass
  if bypass_enabled?
    puts "Feed diff check bypassed (ALLOW_FEED_DIFF=1 or [feed-diff-accept] in commit message)"
    exit 0
  end
  
  # Paths for feeds and snapshots
  main_feed_path = File.join(ROOT, '_site', 'feed.json')
  mastodon_feed_path = File.join(ROOT, '_site', 'feed-mastodon.json')
  
  main_snapshot_path = File.join(SNAPSHOT_DIR, 'feed.json')
  mastodon_snapshot_path = File.join(SNAPSHOT_DIR, 'feed-mastodon.json')
  
  # Check if feed files exist
  unless File.exist?(main_feed_path) && File.exist?(mastodon_feed_path)
    puts "ERROR: Feed files not found. Run 'make build' first."
    puts "  Expected: #{main_feed_path}"
    puts "  Expected: #{mastodon_feed_path}"
    exit 1
  end
  
  ignore_fields = config['ignore_fields'] || []
  
  # Load current feeds
  current_main = load_and_normalize_feed(main_feed_path, ignore_fields)
  current_mastodon = load_and_normalize_feed(mastodon_feed_path, ignore_fields)
  
  # Load baseline snapshots
  baseline_main = load_and_normalize_feed(main_snapshot_path, ignore_fields)
  baseline_mastodon = load_and_normalize_feed(mastodon_snapshot_path, ignore_fields)
  
  # Compare feeds
  main_diff = compare_feeds(baseline_main, current_main, 'Main', config)
  mastodon_diff = compare_feeds(baseline_mastodon, current_mastodon, 'Mastodon', config)
  
  # Print reports
  print_diff_report('Main', main_diff)
  print_diff_report('Mastodon', mastodon_diff)
  
  # Check if we need to create initial snapshots
  if main_diff[:status] == 'missing_baseline' || mastodon_diff[:status] == 'missing_baseline'
    puts "\n=== Creating Initial Snapshots ==="
    save_snapshot(current_main, main_snapshot_path) if current_main
    save_snapshot(current_mastodon, mastodon_snapshot_path) if current_mastodon
    puts "\nInitial snapshots created. Re-run to perform actual diff checking."
    exit 0
  end
  
  # Determine overall result
  failed = false
  failed = true if main_diff[:status] == 'threshold_exceeded'
  failed = true if mastodon_diff[:status] == 'threshold_exceeded'
  
  if failed
    puts "\n❌ Feed diff check FAILED - changes exceed configured thresholds"
    puts "To accept these changes:"
    puts "  - Set environment variable: ALLOW_FEED_DIFF=1"
    puts "  - Or include [feed-diff-accept] in commit message"
    puts "  - Then update snapshots by re-running this script"
    exit 1
  else
    puts "\n✅ Feed diff check PASSED - all changes within acceptable limits"
    
    # Update snapshots for successful runs
    save_snapshot(current_main, main_snapshot_path) if current_main
    save_snapshot(current_mastodon, mastodon_snapshot_path) if current_mastodon
  end
end

# Allow script to update snapshots when run with --update-snapshots
# Allow script to update snapshots when run with --update-snapshots
if ARGV.include?('--help') || ARGV.include?('-h')
  puts "Feed Diff Regression Guard"
  puts ""
  puts "Usage:"
  puts "  ruby tests/diff_feeds.rb                    # Run diff check"
  puts "  ruby tests/diff_feeds.rb --update-snapshots # Update baseline snapshots"
  puts "  ruby tests/diff_feeds.rb --help             # Show this help"
  puts ""
  puts "Environment Variables:"
  puts "  ALLOW_FEED_DIFF=1                          # Bypass diff checks"
  puts ""
  puts "Commit Message Tokens:"
  puts "  [feed-diff-accept]                         # Bypass diff checks"
  puts ""
  puts "Configuration: tests/config/feed_diff.yml"
  puts "Snapshots: tests/feed_snapshots/"
  exit 0
end

if ARGV.include?('--update-snapshots')
  config = load_config
  ignore_fields = config['ignore_fields'] || []
  
  main_feed_path = File.join(ROOT, '_site', 'feed.json')
  mastodon_feed_path = File.join(ROOT, '_site', 'feed-mastodon.json')
  main_snapshot_path = File.join(SNAPSHOT_DIR, 'feed.json')
  mastodon_snapshot_path = File.join(SNAPSHOT_DIR, 'feed-mastodon.json')
  
  current_main = load_and_normalize_feed(main_feed_path, ignore_fields)
  current_mastodon = load_and_normalize_feed(mastodon_feed_path, ignore_fields)
  
  puts "=== Updating Feed Snapshots ==="
  save_snapshot(current_main, main_snapshot_path) if current_main
  save_snapshot(current_mastodon, mastodon_snapshot_path) if current_mastodon
  puts "Snapshots updated successfully."
  exit 0
end

main if __FILE__ == $0