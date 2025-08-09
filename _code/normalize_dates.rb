#!/usr/bin/env ruby
require 'time'
require 'pathname'

ROOT = Pathname.new(File.expand_path('..', __dir__)).freeze
POSTS_DIR = ROOT.join('_posts')

MICROSECOND_DATE_REGEX = /^(date:\s*)(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.\d+\s*$/

changed = []

POSTS_DIR.glob('**/*.md') do |file|
  text = file.read
  next unless text.include?('date:')
  new_text = text.lines.map do |line|
    if (m = line.match(MICROSECOND_DATE_REGEX))
      "#{m[1]}#{m[2]} #{m[3]}\n"
    else
      line
    end
  end.join
  if new_text != text
    file.write(new_text)
    changed << file.relative_path_from(ROOT).to_s
  end
end

if changed.empty?
  puts 'No microsecond timestamps found.'
else
  puts "Normalized microsecond timestamps in:"
  changed.each { |f| puts "  - #{f}" }
end
