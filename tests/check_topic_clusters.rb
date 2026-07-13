#!/usr/bin/env ruby
# Validates curated topic hubs and reciprocal article links.

require 'date'
require 'nokogiri'
require 'rexml/document'
require 'uri'
require 'yaml'

site_directory = ARGV.fetch(0, '_site')
data_path = File.join('_data', 'topic_clusters.yml')
abort "ERROR: topic cluster data missing: #{data_path}" unless File.file?(data_path)

clusters = YAML.safe_load(File.read(data_path), permitted_classes: [Date, Time], aliases: true) || {}
issues = []
memberships = []
topic_source_records = {}
expected_publication_date = '2026-07-12'

issues << "expected at least 6 topic clusters; found #{clusters.length}" if clusters.length < 6

clusters.each do |key, cluster|
  %w[title short_title permalink description intro sections].each do |field|
    issues << "#{key}: missing #{field}" if cluster[field].nil? || cluster[field].respond_to?(:empty?) && cluster[field].empty?
  end

  cluster_paths = []
  Array(cluster['sections']).each_with_index do |section, section_index|
    issues << "#{key}: section #{section_index + 1} has no title" if section['title'].to_s.strip.empty?
    issues << "#{key}: section #{section_index + 1} has no description" if section['description'].to_s.strip.empty?
    Array(section['posts']).each do |item|
      path = item['path'].to_s.strip
      cluster_paths << path
      memberships << [key, path]
      issues << "#{key}: missing source post #{path}" unless File.file?(path)
    end
  end
  issues << "#{key}: expected at least 8 curated posts; found #{cluster_paths.length}" if cluster_paths.length < 8
  duplicate_paths = cluster_paths.tally.select { |_path, count| count > 1 }.keys
  duplicate_paths.each { |path| issues << "#{key}: duplicate membership #{path}" }

  hub_sources = Dir.glob('topics/*.{html,md}').select do |path|
    source = File.read(path)
    source.match?(/^topic_cluster:\s*#{Regexp.escape(key)}\s*$/)
  end
  issues << "#{key}: expected one hub source; found #{hub_sources.length}" unless hub_sources.length == 1
  next unless hub_sources.length == 1

  hub_parts = File.read(hub_sources.first).split(/^---\s*$\n/, 3)
  hub_data = YAML.safe_load(hub_parts[1], permitted_classes: [Date, Time], aliases: true) || {}
  topic_source_records[hub_sources.first] = hub_data
end

index_source = File.join('topics', 'index.html')
if File.file?(index_source)
  index_parts = File.read(index_source).split(/^---\s*$\n/, 3)
  topic_source_records[index_source] = YAML.safe_load(index_parts[1], permitted_classes: [Date, Time], aliases: true) || {}
else
  issues << "topic index source missing: #{index_source}"
end

topic_source_records.each do |path, data|
  %w[web_published_at web_modified_at].each do |field|
    value = data[field]
    date = value.respond_to?(:strftime) ? value.strftime('%Y-%m-%d') : value.to_s[0, 10]
    issues << "#{path}: #{field} must use #{expected_publication_date}; found #{value.inspect}" unless date == expected_publication_date
  end
end

unless issues.empty?
  warn "ERROR: topic cluster source validation failed"
  issues.each { |issue| warn "  - #{issue}" }
  exit 1
end

sitemap_path = File.join(site_directory, 'sitemap.xml')
abort "ERROR: rendered sitemap missing: #{sitemap_path}" unless File.file?(sitemap_path)
sitemap = REXML::Document.new(File.read(sitemap_path))
locations = REXML::XPath.match(sitemap, '//*[local-name()="loc"]').map(&:text).compact
location_lastmods = {}
REXML::XPath.match(sitemap, '//*[local-name()="url"]').each do |url_node|
  location = REXML::XPath.first(url_node, './*[local-name()="loc"]')&.text
  lastmod = REXML::XPath.first(url_node, './*[local-name()="lastmod"]')&.text
  location_lastmods[location] = lastmod if location
end

def rendered_file_for(site_directory, location)
  uri_path = URI::DEFAULT_PARSER.unescape(URI.parse(location).path)
  relative_path = uri_path.sub(%r{\A/}, '')
  candidates = if uri_path.end_with?('/')
                 [File.join(site_directory, relative_path, 'index.html')]
               else
                 [
                   File.join(site_directory, relative_path),
                   File.join(site_directory, "#{relative_path}.html"),
                   File.join(site_directory, relative_path, 'index.html')
                 ]
               end
  candidates.find { |candidate| File.file?(candidate) }
rescue URI::InvalidURIError
  nil
end

rendered_pages = {}
title_to_pages = Hash.new { |hash, title| hash[title] = [] }
locations.each do |location|
  path = rendered_file_for(site_directory, location)
  next unless path
  document = Nokogiri::HTML(File.read(path))
  rendered_pages[location] = document
  title = document.at_css('h1')&.text.to_s.gsub(/\s+/, ' ').strip
  title_to_pages[title] << [location, document] unless title.empty?
end

rendered_issues = []
index_url = 'https://tedt.org/topics/'
index_document = rendered_pages[index_url]
if index_document.nil?
  rendered_issues << "topic index missing from sitemap: #{index_url}"
else
  rendered_issues << "topic index lastmod must use #{expected_publication_date}" unless location_lastmods[index_url].to_s.start_with?(expected_publication_date)
  hub_links = index_document.css('main a[href]').map { |link| link['href'] }
  clusters.each_value do |cluster|
    rendered_issues << "topic index does not link #{cluster['permalink']}" unless hub_links.include?(cluster['permalink'])
  end
end

source_records = {}
memberships.map(&:last).uniq.each do |path|
  parts = File.read(path).split(/^---\s*$\n/, 3)
  data = YAML.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
  source_records[path] = data
end

clusters.each do |key, cluster|
  hub_url = URI.join('https://tedt.org/', cluster['permalink']).to_s
  hub_document = rendered_pages[hub_url]
  if hub_document.nil?
    rendered_issues << "#{key}: hub missing from sitemap: #{hub_url}"
    next
  end

  rendered_issues << "#{key}: sitemap lastmod must use #{expected_publication_date}" unless location_lastmods[hub_url].to_s.start_with?(expected_publication_date)
  rendered_issues << "#{key}: expected one H1" unless hub_document.css('h1').length == 1
  hub_links = hub_document.css('main a[href]').map { |link| link['href'] }
  member_paths = memberships.select { |cluster_key, _path| cluster_key == key }.map(&:last)
  member_paths.each do |source_path|
    title = source_records[source_path]['title'].to_s.gsub(/\s+/, ' ').strip
    matches = title_to_pages[title]
    if matches.length != 1
      rendered_issues << "#{key}: expected one rendered page titled #{title.inspect}; found #{matches.length}"
      next
    end

    member_url, member_document = matches.first
    member_path = URI.parse(member_url).path
    rendered_issues << "#{key}: hub does not link member #{member_path}" unless hub_links.include?(member_path)

    related = member_document.at_css('.topic-cluster-related')
    if related.nil?
      rendered_issues << "#{key}: member lacks related-reading block: #{member_url}"
      next
    end
    related_links = related.css('a[href]')
    rendered_issues << "#{key}: member lacks backlink to #{cluster['permalink']}: #{member_url}" unless related_links.any? { |link| link['href'] == cluster['permalink'] }
    rendered_issues << "#{key}: member has no sibling links: #{member_url}" if related_links.length < 2
    rendered_issues << "#{key}: related links must remain crawlable: #{member_url}" if related_links.any? { |link| link['rel'].to_s.split.include?('nofollow') }
  end
end

unless rendered_issues.empty?
  warn "ERROR: rendered topic cluster validation failed"
  rendered_issues.first(100).each { |issue| warn "  - #{issue}" }
  warn "  - ... and #{rendered_issues.length - 100} more" if rendered_issues.length > 100
  exit 1
end

puts "Topic clusters OK (#{clusters.length} hubs; #{memberships.length} memberships; #{memberships.map(&:last).uniq.length} unique posts)"
