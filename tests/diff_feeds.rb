#!/usr/bin/env ruby
require 'digest'
require 'fileutils'
require 'json'
require 'optparse'
require 'uri'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
SITE_DIR = File.join(ROOT, '_site')
SNAPSHOT_DIR = File.join(ROOT, 'tests', 'feed_snapshots')
CONFIG_PATH = File.join(ROOT, 'tests', 'config', 'feed_diff.yml')
FEEDS = [
  { label: 'main', site_file: 'feed.json', snapshot_file: 'feed.json' },
  { label: 'mastodon', site_file: 'feed-mastodon.json', snapshot_file: 'feed-mastodon.json' }
].freeze

def load_yaml(path)
  YAML.load_file(path) || {}
rescue Errno::ENOENT
  abort "Missing config: #{path}"
end

def normalize_scalar(value)
  return value unless value.is_a?(String)

  value.gsub(/(\d{2}:\d{2}:\d{2})\.\d+(?=(?:Z|[+-]\d{2}:\d{2})\z)/, '\\1')
end

def normalize_value(value, ignore_fields)
  case value
  when Hash
    value.keys.map(&:to_s).sort.each_with_object({}) do |key, memo|
      next if ignore_fields.include?(key)

      memo[key] = normalize_value(value[key], ignore_fields)
    end
  when Array
    value.map { |item| normalize_value(item, ignore_fields) }
  else
    normalize_scalar(value)
  end
end

def load_json(path)
  JSON.parse(File.read(path))
rescue Errno::ENOENT
  abort "Build the site first (missing #{path})"
rescue JSON::ParserError => error
  abort "Invalid JSON in #{path}: #{error.message}"
end

def item_key(item)
  raw = item['url'] || item['id']
  return '(missing-item-key)' if raw.to_s.strip.empty?

  begin
    uri = URI.parse(raw)
    raw = uri.path if uri.path && !uri.path.empty?
  rescue URI::InvalidURIError
    raw = raw.to_s
  end

  normalized = raw.to_s.strip
  normalized = "/#{normalized}" unless normalized.start_with?('/')
  normalized.sub(%r{/+\z}, '/')
end

def content_excerpt(item)
  text = item['content_text'] || item['summary'] || ''
  text.to_s.gsub(/\s+/, ' ').strip[0, 240]
end

def content_length(item)
  (item['content_text'] || item['summary'] || '').to_s.length
end

def item_signature(item)
  Digest::SHA256.hexdigest([
    item['title'],
    item['url'],
    item['summary'],
    item['content_excerpt']
  ].map(&:to_s).join("\n"))
end

def build_snapshot(path, ignore_fields)
  feed = normalize_value(load_json(path), ignore_fields)
  ordered_items = Array(feed['items'])
  items = ordered_items.map do |item|
    snapshot_item = {
      'key' => item_key(item),
      'id' => item['id'],
      'url' => item['url'],
      'title' => item['title'],
      'summary' => item['summary'],
      'content_excerpt' => content_excerpt(item),
      'content_length' => content_length(item),
      'image' => item['image']
    }
    snapshot_item['diff_hash'] = item_signature(snapshot_item)
    snapshot_item
  end

  {
    'source' => File.basename(path),
    'metadata' => feed.reject { |key, _value| key == 'items' },
    'item_count' => items.length,
    'item_order' => items.map { |item| item['key'] },
    'items' => items.sort_by { |item| item['key'] }
  }
end

def write_snapshot(path, snapshot)
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, JSON.pretty_generate(snapshot) + "\n")
end

def load_snapshot(path)
  JSON.parse(File.read(path))
rescue Errno::ENOENT
  abort "Missing baseline snapshot #{path}. Run `ruby tests/diff_feeds.rb --refresh`."
rescue JSON::ParserError => error
  abort "Invalid snapshot JSON in #{path}: #{error.message}"
end

def item_map(snapshot)
  snapshot.fetch('items', []).each_with_object({}) do |item, memo|
    memo[item['key']] = item
  end
end

def content_length_delta_pct(before_length, after_length)
  return 0.0 if before_length.to_i.zero? && after_length.to_i.zero?
  return 100.0 if before_length.to_i.zero?

  (((after_length.to_i - before_length.to_i).abs.to_f / before_length.to_i) * 100).round(1)
end

def clip(text, limit = 90)
  normalized = text.to_s.gsub(/\s+/, ' ').strip
  return normalized if normalized.length <= limit

  normalized[0, limit - 3] + '...'
end

def compare_snapshots(baseline, current, config)
  baseline_map = item_map(baseline)
  current_map = item_map(current)
  baseline_keys = baseline_map.keys
  current_keys = current_map.keys
  common_keys = baseline_keys & current_keys

  title_changes = []
  url_changes = []
  image_changes = []
  signature_changes = []
  content_length_changes = []

  common_keys.each do |key|
    before_item = baseline_map[key]
    after_item = current_map[key]

    if before_item['title'] != after_item['title']
      title_changes << { key: key, before: before_item['title'], after: after_item['title'] }
    end

    if before_item['url'] != after_item['url']
      url_changes << { key: key, before: before_item['url'], after: after_item['url'] }
    end

    if before_item['image'] != after_item['image']
      image_changes << { key: key, before: before_item['image'], after: after_item['image'] }
    end

    if before_item['diff_hash'] != after_item['diff_hash']
      signature_changes << {
        key: key,
        before_summary: before_item['summary'],
        after_summary: after_item['summary'],
        before_excerpt: before_item['content_excerpt'],
        after_excerpt: after_item['content_excerpt']
      }
    end

    pct = content_length_delta_pct(before_item['content_length'], after_item['content_length'])
    if pct > config.fetch('max_content_length_change_pct', 10).to_f
      content_length_changes << {
        key: key,
        before: before_item['content_length'],
        after: after_item['content_length'],
        pct: pct
      }
    end
  end

  metadata_changes = (baseline.fetch('metadata', {}).keys | current.fetch('metadata', {}).keys).sort.filter_map do |key|
    before_value = baseline.fetch('metadata', {})[key]
    after_value = current.fetch('metadata', {})[key]
    next if before_value == after_value

    { key: key, before: before_value, after: after_value }
  end

  baseline_common_order = baseline.fetch('item_order', []).select { |key| common_keys.include?(key) }
  current_common_order = current.fetch('item_order', []).select { |key| common_keys.include?(key) }
  order_changed = baseline_common_order != current_common_order
  first_order_change = nil

  if order_changed
    baseline_common_order.each_with_index do |key, index|
      next if current_common_order[index] == key

      first_order_change = {
        key: key,
        baseline_index: index,
        current_index: current_common_order.index(key)
      }
      break
    end
  end

  {
    added_items: current_keys - baseline_keys,
    removed_items: baseline_keys - current_keys,
    title_changes: title_changes,
    url_changes: url_changes,
    image_changes: image_changes,
    signature_changes: signature_changes,
    content_length_changes: content_length_changes,
    metadata_changes: metadata_changes,
    order_delta: order_changed ? 1 : 0,
    first_order_change: first_order_change
  }
end

def metric_summary(diff)
  {
    'added_items' => diff[:added_items].length,
    'removed_items' => diff[:removed_items].length,
    'title_changes' => diff[:title_changes].length,
    'url_changes' => diff[:url_changes].length,
    'image_changes' => diff[:image_changes].length,
    'signature_changes' => diff[:signature_changes].length,
    'metadata_changes' => diff[:metadata_changes].length,
    'order_delta' => diff[:order_delta],
    'items_over_content_length_change_pct' => diff[:content_length_changes].length
  }
end

def violation_list(metrics, config)
  thresholds = {
    'added_items' => config.fetch('max_added_items', 0).to_i,
    'removed_items' => config.fetch('max_removed_items', 0).to_i,
    'title_changes' => config.fetch('max_title_delta', 0).to_i,
    'url_changes' => config.fetch('max_url_delta', 0).to_i,
    'image_changes' => config.fetch('max_image_delta', 0).to_i,
    'signature_changes' => config.fetch('max_signature_delta', 0).to_i,
    'metadata_changes' => config.fetch('max_metadata_delta', 0).to_i,
    'order_delta' => config.fetch('max_order_delta', 0).to_i,
    'items_over_content_length_change_pct' => config.fetch('max_items_over_content_length_change_pct', 0).to_i
  }

  metrics.filter_map do |name, count|
    max = thresholds[name]
    next unless count > max

    "#{name}=#{count} exceeds #{max}"
  end
end

def diff_examples(diff, limit)
  examples = []

  diff[:removed_items].first(limit).each do |key|
    examples << "Removed item #{key}"
  end

  diff[:added_items].first(limit).each do |key|
    examples << "Added item #{key}"
  end

  diff[:title_changes].first(limit).each do |change|
    examples << "Title changed #{change[:key]}: '#{clip(change[:before], 50)}' -> '#{clip(change[:after], 50)}'"
  end

  diff[:url_changes].first(limit).each do |change|
    examples << "URL changed #{change[:key]}: #{change[:before]} -> #{change[:after]}"
  end

  diff[:signature_changes].first(limit).each do |change|
    before_text = change[:before_summary].to_s.empty? ? change[:before_excerpt] : change[:before_summary]
    after_text = change[:after_summary].to_s.empty? ? change[:after_excerpt] : change[:after_summary]
    examples << "Content signature changed #{change[:key]}: '#{clip(before_text)}' -> '#{clip(after_text)}'"
  end

  diff[:content_length_changes].first(limit).each do |change|
    examples << "Content length changed #{change[:key]}: #{change[:before]} -> #{change[:after]} chars (#{change[:pct]}%)"
  end

  diff[:image_changes].first(limit).each do |change|
    examples << "Image changed #{change[:key]}: #{change[:before]} -> #{change[:after]}"
  end

  diff[:metadata_changes].first(limit).each do |change|
    examples << "Metadata changed #{change[:key]}: #{clip(change[:before].to_s)} -> #{clip(change[:after].to_s)}"
  end

  if diff[:first_order_change]
    change = diff[:first_order_change]
    examples << "Relative ordering changed at #{change[:key]} (baseline index #{change[:baseline_index]}, current index #{change[:current_index]})"
  end

  examples.first(limit)
end

def approval_granted?
  return true if ENV['ALLOW_FEED_DIFF'] == '1'

  commit_message = `git log -1 --pretty=%B 2>/dev/null`
  $?.success? && commit_message.include?('[feed-diff-accept]')
end

options = { refresh: false }
OptionParser.new do |parser|
  parser.banner = 'Usage: ruby tests/diff_feeds.rb [--refresh]'
  parser.on('--refresh', 'Refresh committed feed snapshots from the current _site build') do
    options[:refresh] = true
  end
end.parse!

options[:refresh] ||= ENV['REFRESH_FEED_SNAPSHOTS'] == '1'
config = load_yaml(CONFIG_PATH)
ignore_fields = Array(config['ignore_fields']).map(&:to_s)

if options[:refresh]
  FEEDS.each do |feed|
    current_snapshot = build_snapshot(File.join(SITE_DIR, feed[:site_file]), ignore_fields)
    write_snapshot(File.join(SNAPSHOT_DIR, feed[:snapshot_file]), current_snapshot)
  end

  puts 'Feed diff snapshots refreshed.'
  exit 0
end

approved = approval_granted?
overall_fail = false

FEEDS.each do |feed|
  current_snapshot = build_snapshot(File.join(SITE_DIR, feed[:site_file]), ignore_fields)
  baseline_snapshot = load_snapshot(File.join(SNAPSHOT_DIR, feed[:snapshot_file]))
  diff = compare_snapshots(baseline_snapshot, current_snapshot, config)
  metrics = metric_summary(diff)
  violations = violation_list(metrics, config)
  examples = diff_examples(diff, config.fetch('top_diff_count', 5).to_i)

  puts "Feed diff report: #{feed[:label]}"
  puts " - added items: #{metrics['added_items']}"
  puts " - removed items: #{metrics['removed_items']}"
  puts " - title changes: #{metrics['title_changes']}"
  puts " - url changes: #{metrics['url_changes']}"
  puts " - image changes: #{metrics['image_changes']}"
  puts " - content signature changes: #{metrics['signature_changes']}"
  puts " - metadata changes: #{metrics['metadata_changes']}"
  puts " - relative order changes: #{metrics['order_delta']}"
  puts " - items over #{config.fetch('max_content_length_change_pct', 10)}% content-length delta: #{metrics['items_over_content_length_change_pct']}"

  if examples.empty?
    puts ' - top diffs: none'
  else
    puts ' - top diffs:'
    examples.each { |example| puts "   - #{example}" }
  end

  next if violations.empty?

  if approved
    puts " - approval override active; allowing violations: #{violations.join(', ')}"
  else
    overall_fail = true
    puts " - violations: #{violations.join(', ')}"
  end
end

if overall_fail
  puts 'Feed diff regression guard: FAIL'
  exit 1
end

puts approved ? 'Feed diff regression guard: PASS (override active)' : 'Feed diff regression guard: PASS'