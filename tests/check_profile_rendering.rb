#!/usr/bin/env ruby
# frozen_string_literal: true

require 'pathname'

REPO_ROOT = Pathname.new(__dir__).parent
PROFILE_HTML = REPO_ROOT.join('_site/profile/index.html')

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

fail_with("Missing generated profile page: #{PROFILE_HTML}. Run `bundle exec jekyll build` first.") unless PROFILE_HTML.file?

html = PROFILE_HTML.read
bio_match = html.match(%r{<ul class="[^"]*footer-bio-list[^"]*"[^>]*>(.*?)</ul>}m)
fail_with('Generated profile page is missing the footer biography list.') unless bio_match

bio_html = bio_match[1]

if bio_html.include?('**Ted Tschopp**') || bio_html.include?('**Southern California Edison**')
  fail_with('Profile biography rendered raw Markdown emphasis in the generated footer.')
end

if bio_html.include?('=&gt;') || bio_html.include?('=>')
  fail_with('Profile biography rendered a YAML mapping/hash artifact in the generated footer.')
end

unless bio_html.include?('<strong>Ted Tschopp</strong>') && bio_html.include?('<strong>Southern California Edison</strong>')
  fail_with('Profile biography Markdown emphasis was not rendered to HTML.')
end

puts 'OK: profile footer biography renders Markdown as HTML.'