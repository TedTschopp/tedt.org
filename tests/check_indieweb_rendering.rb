#!/usr/bin/env ruby
# frozen_string_literal: true
require_relative '../_code/indieweb'

site = File.expand_path(ARGV[0] || '_site')
manifest = IndieWeb.read_json(File.join(site, 'indieweb-manifest.json'))
errors = []
count = 0
manifest.fetch('entries').each do |record|
  url = record.fetch('url')
  file = IndieWeb.site_file(site, url)
  unless File.file?(file)
    errors << "Missing article: #{url}"
    next
  end
  doc = Nokogiri::HTML(File.read(file))
  entry = doc.at_css('.h-entry')
  unless entry
    errors << "Missing h-entry: #{url}"
    next
  end
  count += 1
  errors << "Missing article name: #{url}" unless entry.at_css('.p-name')
  errors << "Missing article content: #{url}" unless entry.at_css('.e-content')
  authors = entry.css('.p-author.h-card')
  errors << "Missing explicit author card: #{url}" if authors.empty? || authors.any? { |a| a.css('.p-name').all? { |n| n.text.strip.empty? } }
  own_urls = entry.css('.u-url').reject { |node| node.ancestors.any? { |parent| parent != entry && parent['class'].to_s.split.include?('h-card') } }
  values = own_urls.map { |node| node['href'] || node.text.strip }.uniq
  errors << "Incorrect h-entry URL: #{url} (#{values.inspect})" unless values == [url]
  dates = entry.css('time.dt-published').map { |t| t['datetime'] }
  errors << "Missing publication date: #{url}" if record['published'] && dates.empty?
  dates.each { |d| Time.iso8601(d.to_s) rescue errors << "Invalid publication date: #{url}" }
  endpoint = doc.at_css('link[rel="webmention"]')
  errors << "Missing receiver discovery: #{url}" unless endpoint && endpoint['href'] == 'https://webmention.io/tedt.org/webmention'
  target = doc.at_css('form.webmention-form input[name="target"]')
  errors << "Incorrect form target: #{url}" unless target && target['value'] == url
  source = doc.at_css('form.webmention-form input[name="source"]')
  errors << "Unlabeled response field: #{url}" unless source && doc.at_css("label[for='#{source['id']}']")
  errors << "Missing announcement region: #{url}" unless doc.at_css('.webmention-form [role="status"]')
  errors << "Legacy renderer loaded: #{url}" if doc.css('script[src]').any? { |n| n['src'].include?('/webmention.js/static/') }
end

home = Nokogiri::HTML(File.read(File.join(site, 'index.html')))
card = home.at_css('footer .h-card')
errors << 'Homepage identity has no explicit name' unless card&.at_css('.p-name')&.text&.gsub(/\s+/, ' ')&.strip == 'Ted Tschopp'
errors << 'Homepage identity has no canonical UID' unless card&.at_css('a.u-uid')&.[]('href') == 'https://tedt.org/'
feed = Nokogiri::HTML(File.read(File.join(site, 'updates/index.html')))
errors << 'Missing chronological h-feed' unless feed.at_css('.h-feed .h-entry')
feed_dates = feed.css('.h-feed .h-entry time.dt-published').map { |t| Time.iso8601(t['datetime']) }
errors << 'h-feed is not in web publication order' unless feed_dates.each_cons(2).all? { |a, b| a >= b }
errors << 'Delivery state leaked into published output' if File.exist?(File.join(site, 'cache/webmention-outbox.json'))

cache = IndieWeb.read_json(File.expand_path('../_data/webmentions.json', __dir__))
cache.fetch('by_target').each do |canonical, groups|
  archive_url = canonical == 'https://tedt.org/' ? 'https://tedt.org/webmentions/' : canonical
  file = IndieWeb.site_file(site, archive_url)
  next unless File.file?(file)
  doc = Nokogiri::HTML(File.read(file))
  groups.values.flatten.each do |record|
    errors << "Approved response not rendered: #{record['id']}" unless doc.at_css("#webmention-#{record['id']}")
  end
end

unless errors.empty?
  STDERR.puts errors.first(50)
  abort "IndieWeb rendering: #{errors.length} failures"
end
puts "OK: #{count} article pages have canonical forms, explicit metadata, static responses, and accessible submission controls."
