#!/usr/bin/env ruby
# Scan posts for inconsistent image path usage (missing leading slash) and report counts.
require 'yaml'
require 'json'

root = File.expand_path('..', __dir__)
posts_dir = File.join(root, '_posts')
issues = []
count_rel = 0
count_abs = 0

Dir.glob(File.join(posts_dir, '**/*.md')).each do |f|
  front = []
  lines = File.readlines(f)
  if lines[0]&.strip == '---'
    fm = []
    lines[1..-1].each_with_index do |l, idx|
      break if l.strip == '---'
      fm << l
    end
    begin
      data = YAML.safe_load(fm.join, permitted_classes: [Date, Time]) || {}
    rescue => e
      issues << "Failed to parse front matter in #{f}: #{e.message}"
      next
    end
    img = data['image']
    next unless img.is_a?(String) && !img.empty?
    if img.start_with?('http://', 'https://')
      # ignore absolute web urls
    elsif img.start_with?('/')
      count_abs += 1
    else
      count_rel += 1
      issues << "Relative image path (no leading slash) in #{f}: #{img}"
    end
  end
end

puts "Absolute internal images: #{count_abs}"
puts "Relative internal images: #{count_rel}"
if issues.empty?
  puts 'Image path consistency: PASS'
else
  puts 'Image path consistency: WARN'
  issues.each { |i| puts " - #{i}" }
end
