#!/usr/bin/env ruby
require 'open3'
require 'pathname'
require 'set'
require 'yaml'

ROOT = Pathname.new(File.expand_path('..', __dir__))
CONFIG_PATH = ROOT.join('.ci/config/repo_guard.yml')

abort "Missing config: #{CONFIG_PATH}" unless CONFIG_PATH.exist?

config = YAML.load_file(CONFIG_PATH)
max_warn_bytes = Integer(config.fetch('max_warn_kb')) * 1024
max_fail_bytes = Integer(config.fetch('max_fail_kb')) * 1024
blocked_paths = Array(config['blocked_paths']).map(&:to_s)
blocked_extensions = Array(config['blocked_extensions']).map { |value| value.to_s.downcase }
largest_files_report_count = Integer(config.fetch('largest_files_report_count', 10))
warning_report_count = Integer(config.fetch('warning_report_count', 25))
allowlist_path = ROOT.join(config.fetch('allowlist_file'))

allowlist = if allowlist_path.exist?
  allowlist_path.each_line.map(&:strip).reject { |line| line.empty? || line.start_with?('#') }.to_set
else
  Set.new
end

def git_files(mode)
  command = case mode
  when 'diff'
    base_ref = ENV['REPO_GUARD_BASE_REF'] || ENV['GITHUB_BASE_REF']
    if base_ref && !base_ref.strip.empty?
      ['git', 'diff', '--name-only', '--diff-filter=ACMR', '--merge-base', "origin/#{base_ref}", 'HEAD']
    else
      ['git', 'ls-files']
    end
  else
    ['git', 'ls-files']
  end

  stdout, stderr, status = Open3.capture3(*command)
  abort "repo_guard git query failed: #{stderr}" unless status.success?

  stdout.lines.map(&:strip).reject(&:empty?)
end

scope = ENV.fetch('REPO_GUARD_SCOPE', 'tree')
files = git_files(scope)

warnings = []
failures = []
largest_files = []

files.each do |relative_path|
  path = ROOT.join(relative_path)
  next unless path.file?

  size = path.size
  ext = path.extname.downcase
  allowlisted = allowlist.include?(relative_path)

  largest_files << [size, relative_path]

  blocked_path = blocked_paths.find do |blocked|
    relative_path == blocked || relative_path.start_with?("#{blocked}/")
  end

  if blocked_path && !allowlisted
    failures << "blocked path: #{relative_path} matches #{blocked_path}"
  end

  if blocked_extensions.include?(ext) && !allowlisted
    failures << "blocked extension: #{relative_path} uses #{ext}"
  end

  if size > max_fail_bytes && !allowlisted
    failures << "oversized file: #{relative_path} is #{size} bytes (> #{max_fail_bytes})"
  elsif size > max_warn_bytes && !allowlisted
    warnings << "large file: #{relative_path} is #{size} bytes (> #{max_warn_bytes})"
  end
end

largest_files.sort_by! { |size, _path| -size }

puts "Repo guard scope: #{scope}"
puts "Tracked files scanned: #{files.length}"
puts "Allowlist entries: #{allowlist.length}"

puts "\nLargest tracked files:"
largest_files.first(largest_files_report_count).each do |size, relative_path|
  puts format(' - %8.2f MB  %s', size.to_f / (1024 * 1024), relative_path)
end

unless warnings.empty?
  puts "\nWarnings:"
  warnings.first(warning_report_count).each { |warning| puts " - #{warning}" }
  remaining_warning_count = warnings.length - warning_report_count
  puts " - ... #{remaining_warning_count} more warnings omitted" if remaining_warning_count.positive?
end

if failures.empty?
  puts "\nRepo guard: PASS"
  exit 0
end

puts "\nFailures:"
failures.each { |failure| puts " - #{failure}" }
puts "\nRepo guard: FAIL"
exit 1