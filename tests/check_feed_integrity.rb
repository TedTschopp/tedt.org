#!/usr/bin/env ruby
require 'json'
require 'uri'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
site_config = YAML.load_file(File.join(ROOT, '_config.yml'))
site_url = site_config['url']&.sub(/\/$/, '')

main_feed = File.join(ROOT, '_site', 'feed.json')
mastodon_feed = File.join(ROOT, '_site', 'feed-mastodon.json')

abort 'Missing _site/feed.json (run build first)' unless File.exist?(main_feed)
abort 'Missing _site/feed-mastodon.json (run build first)' unless File.exist?(mastodon_feed)

errors = []

def absolute?(u)
  begin
    uri = URI(u)
    !!(uri.scheme && uri.host)
  rescue URI::InvalidURIError
    false
  end
end

def load_json(path)
  JSON.parse(File.read(path))
rescue JSON::ParserError => e
  abort "Invalid JSON in #{path}: #{e.message}"
end

main = load_json(main_feed)
items = main['items'] || []
errors << 'Main feed has no items' if items.empty?

items.each_with_index do |item, i|
  url = item['url'] || item['id']
  if url.nil? || url.strip.empty?
    errors << "Main feed item #{i} missing url/id"
    next
  end
  unless absolute?(url)
    errors << "Main feed item #{i} url not absolute: #{url}"
  end
  if site_url && !url.start_with?(site_url)
    errors << "Main feed item #{i} url does not start with site.url: #{url}"
  end
end

if errors.empty?
  puts 'Feed integrity: PASS'
else
  puts 'Feed integrity: FAIL'
  errors.each { |e| puts " - #{e}" }
  exit 1
end
