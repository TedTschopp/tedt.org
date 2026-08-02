#!/usr/bin/env ruby
# Verifies that sitemap.xml is present, well formed, and limited to canonical,
# indexable discovery URLs.

require 'rexml/document'
require 'nokogiri'
require 'uri'

sitemap_path = ARGV.fetch(0, File.join('_site', 'sitemap.xml'))
unless File.exist?(sitemap_path)
  abort 'ERROR: sitemap.xml missing in _site (build issue)'
end

content = File.read(sitemap_path)
if content.scan(/<url>/).empty?
  abort 'ERROR: sitemap.xml contains zero <url> entries'
end

begin
  document = REXML::Document.new(content)
rescue REXML::ParseException => e
  abort "ERROR: sitemap.xml is not well formed: #{e.message}"
end

locations = REXML::XPath.match(document, '//*[local-name()="loc"]').map(&:text)
abort 'ERROR: sitemap.xml contains zero <loc> entries' if locations.empty?

duplicates = locations.tally.select { |_location, count| count > 1 }.keys
unless duplicates.empty?
  abort "ERROR: sitemap.xml contains duplicate URLs: #{duplicates.join(', ')}"
end

excluded_fragments = [
  '/category/Draft/',
  '/category/Home/',
  '/category/Prompts/',
  '/category/prompts/',
  '/mastodon-backfill',
  '/work-in-progress/',
  '/docs/adr/0012-posts-based-slides/',
  '/skills/frontend-design.skill/',
  '/RPG/MCC-GW/Monster-Manual/'
].freeze

unexpected = locations.select do |location|
  path = URI.parse(location).path
  excluded_fragments.any? { |fragment| path.include?(fragment) }
end

unless unexpected.empty?
  abort "ERROR: sitemap.xml contains redirect, noindex, or internal URLs: #{unexpected.join(', ')}"
end

site_directory = File.dirname(sitemap_path)
missing = []
redirects = []
noindex = []

locations.each do |location|
  path = URI::DEFAULT_PARSER.unescape(URI.parse(location).path)
  relative_path = path.sub(%r{\A/}, '')
  candidates = if path.end_with?('/')
                 [File.join(site_directory, relative_path, 'index.html')]
               else
                 [
                   File.join(site_directory, relative_path),
                   File.join(site_directory, "#{relative_path}.html"),
                   File.join(site_directory, relative_path, 'index.html')
                 ]
               end
  rendered_path = candidates.find { |candidate| File.file?(candidate) }

  unless rendered_path
    missing << location
    next
  end

  html = Nokogiri::HTML(File.read(rendered_path))
  redirects << location if html.css('meta').any? { |meta| meta['http-equiv'].to_s.casecmp('refresh').zero? }
  noindex << location if html.css('meta').any? do |meta|
    meta['name'].to_s.casecmp('robots').zero? && meta['content'].to_s.downcase.include?('noindex')
  end
end

abort "ERROR: sitemap URLs have no rendered HTML: #{missing.join(', ')}" unless missing.empty?
abort "ERROR: sitemap URLs render as redirects: #{redirects.join(', ')}" unless redirects.empty?
abort "ERROR: sitemap URLs render as noindex pages: #{noindex.join(', ')}" unless noindex.empty?

puts "Sitemap freshness, uniqueness, rendered HTML, and indexability OK (#{locations.length} URLs)"
