#!/usr/bin/env ruby
require 'json'
require 'uri'

MAX_TOOT = 480

feed_path = File.expand_path('../_site/feed-mastodon.json', __dir__)
abort "Build the site first (missing #{feed_path})" unless File.exist?(feed_path)

data = JSON.parse(File.read(feed_path))
errors = []

errors << 'version missing' unless data['version']
errors << 'items missing' unless data['items'].is_a?(Array)

data.fetch('items', []).each_with_index do |item, i|
  %w[id title url content_text].each do |k|
    errors << "item #{i} missing #{k}" if item[k].nil? || item[k].to_s.strip.empty?
  end
  if item['content_text'] && item['content_text'].size > MAX_TOOT
    errors << "item #{i} content_text exceeds #{MAX_TOOT} chars"
  end
  if item['image']
    begin
      u = URI(item['image'])
      errors << "item #{i} image not absolute" unless u.scheme && u.host
    rescue URI::InvalidURIError
      errors << "item #{i} image invalid URI"
    end
  end
  begin
    u = URI(item['url'])
    errors << "item #{i} url not absolute" unless u.scheme && u.host
  rescue URI::InvalidURIError
    errors << "item #{i} url invalid URI"
  end
end

if errors.empty?
  puts 'Mastodon feed validation: PASS'
else
  puts 'Mastodon feed validation: FAIL'
  errors.each { |e| puts " - #{e}" }
  exit 1
end
