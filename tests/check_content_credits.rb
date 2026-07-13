#!/usr/bin/env ruby
# frozen_string_literal: true

require 'pathname'

REPO_ROOT = Pathname.new(__dir__).parent
SITE_ROOT = Pathname.new(ARGV[0] || ENV['JEKYLL_DESTINATION'] || REPO_ROOT.join('_site').to_s)

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

fail_with("Missing generated site: #{SITE_ROOT}. Run `bundle exec jekyll build` first.") unless SITE_ROOT.directory?

profile_path = SITE_ROOT.join('profile/index.html')
fail_with('Missing rendered /profile/ page.') unless profile_path.file?

profile_html = profile_path.read
required_profile_sections = [
  'Expertise',
  'Selected work',
  'Speaking and publication history',
  'Editorial standards',
  'AI-assistance disclosure',
  'Translation and folklore disclosure',
  'Contact and corrections'
]

required_profile_sections.each do |heading|
  fail_with("Profile is missing the #{heading.inspect} section.") unless profile_html.include?(heading)
end

if profile_html.include?('## Editorial standards') || profile_html.include?('**Enterprise architecture:**')
  fail_with('Profile renders raw Markdown instead of semantic HTML.')
end

unless profile_html.match?(/<h2[^>]*>Editorial standards<\/h2>/) &&
       profile_html.include?('<strong>Enterprise architecture:</strong>')
  fail_with('Profile headings or emphasis are missing from the rendered HTML.')
end

unless profile_html.include?('source author') &&
       profile_html.include?('translator, translation editor, and curator') &&
       profile_html.include?('AI-assisted translation')
  fail_with('Profile does not clearly distinguish source, editorial, and translation roles.')
end

rendered_pages = SITE_ROOT.glob('**/*.html').select(&:file?)
authored_pages = []
reprint_pages = []
quote_pages = []
folklore_pages = []

rendered_pages.each do |path|
  html = path.read
  authored_pages << [path, html] if html.include?('content-credit-author')
  reprint_pages << [path, html] if html.include?('content-credit-source-author')
  quote_pages << [path, html] if html.include?('quote-source-author')
  folklore_pages << [path, html] if html.include?('content-credit-translation-editor')
end

fail_with('No rendered authored page contains role-aware author credit.') if authored_pages.empty?
fail_with('No rendered reprint contains source-author/editor credit.') if reprint_pages.empty?
fail_with('No rendered quote contains source-author/curator credit.') if quote_pages.empty?
fail_with('No rendered folklore story contains translation-editor credit.') if folklore_pages.empty?

authored_pages.each do |path, html|
  next unless html.match?(/content-credit-author.*?Ted Tschopp/m)
  unless html.match?(%r{content-credit-author.*?href="(?:https://tedt\.org)?/profile/".*?Ted Tschopp}m)
    fail_with("Ted Tschopp's author byline does not link to /profile/: #{path}")
  end
end

reprint_pages.each do |path, html|
  unless html.match?(/content-credit-source-author.*?Source author:/m) &&
         html.match?(%r{content-credit-editor.*?href="(?:https://tedt\.org)?/profile/".*?Ted Tschopp}m)
    fail_with("Reprint does not distinguish source author from Ted's editorial role: #{path}")
  end

  fail_with("Reprint renders the redundant label 'Source author: by': #{path}") if html.include?('Source author: by')
end

quote_pages.each do |path, html|
  unless html.match?(/quote-source-author.*?Quote by/m) &&
         html.match?(%r{content-credit-curator.*?href="(?:https://tedt\.org)?/profile/".*?Ted Tschopp}m)
    fail_with("Quote does not distinguish the quoted person from the curator: #{path}")
  end

  if html.match?(/quote-source-author.*?(?:\{&quot;|\{&amp;quot;|\{"name")/m)
    fail_with("Quote author renders as a serialized hash instead of a name: #{path}")
  end
end

folklore_pages.each do |path, html|
  unless html.include?('Source author:') && html.include?('Translator and curator:') &&
         html.match?(%r{content-credit-translation-editor.*?href="(?:https://tedt\.org)?/profile/".*?Ted Tschopp}m) &&
         html.include?('Translation disclosure')
    fail_with("Folklore story does not identify source author and translation editor separately: #{path}")
  end
end

puts "OK: profile trust sections and role-aware credits render correctly (#{authored_pages.length} authored, #{reprint_pages.length} reprint, #{quote_pages.length} quote, #{folklore_pages.length} folklore pages)."
