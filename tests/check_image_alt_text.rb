#!/usr/bin/env ruby
# Validate front matter image alt / description fields for quote safety and length.
# Fails (exit 1) if unescaped / unmatched quotes likely to break HTML attributes are detected.

require 'yaml'

root = File.expand_path('..', __dir__)
posts_dir = File.join(root, '_posts')
problematic = []
warnings = []

FIELDS = %w[image-alt image_description image-description image_alt image-title image-credits-title]

Dir.glob(File.join(posts_dir, '**/*.md')).each do |file|
  lines = File.readlines(file)
  next unless lines[0]&.strip == '---'
  fm_lines = []
  lines[1..-1].each do |l|
    break if l.strip == '---'
    fm_lines << l
  end
  begin
    data = YAML.safe_load(fm_lines.join, permitted_classes: [Date, Time]) || {}
  rescue => e
    warnings << "YAML parse issue in #{file}: #{e.message}"
    next
  end
  FIELDS.each do |field|
    val = data[field]
    next unless val.is_a?(String) && !val.strip.empty?
    text = val.strip
    dq_count = text.count('"')
    if dq_count == 1
      problematic << "Unmatched double quote in #{file} field '#{field}': #{text.inspect}"
    end
    if text.length > 300
      warnings << "Long alt text (#{text.length} chars) in #{file} field '#{field}'"
    end
  end
end

if problematic.empty?
  puts 'Image alt text safety: PASS'
else
  puts 'Image alt text safety: FAIL'
  problematic.each { |p| puts " - #{p}" }
  unless warnings.empty?
    puts 'Warnings:'
    warnings.each { |w| puts " - #{w}" }
  end
  exit 1
end

unless warnings.empty?
  puts 'Warnings:'
  warnings.each { |w| puts " - #{w}" }
end
