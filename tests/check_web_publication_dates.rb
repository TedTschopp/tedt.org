#!/usr/bin/env ruby
# Guard the distinction between a document's historical/source chronology and
# the date it was published on tedt.org.

require 'date'
require 'json'
require 'time'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
SITE_DIR = File.expand_path(ENV.fetch('JEKYLL_DESTINATION', File.join(ROOT, '_site')))
CUTOFF = Date.new(2003, 1, 1)
errors = []
historical_documents = []
historical_quotes = []

Dir.glob(File.join(ROOT, '_posts', '**', '*.{md,html}')).sort.each do |path|
  source = File.read(path)
  match = source.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  next unless match

  begin
    data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  rescue Psych::SyntaxError => e
    errors << "#{path.sub("#{ROOT}/", '')}: invalid front matter (#{e.message})"
    next
  end

  next if data['published'] == false

  raw_source_date = data['date'] || File.basename(path)[/\A(\d{4}-\d{2}-\d{2})-/, 1]
  next unless raw_source_date

  begin
    source_date = Date.parse(raw_source_date.to_s)
  rescue Date::Error
    next
  end
  next unless source_date < CUTOFF

  relative_path = path.sub("#{ROOT}/", '')
  historical_documents << relative_path
  historical_quotes << relative_path if data['layout'] == 'quote'

  published_value = data['web_published_at']
  modified_value = data['web_modified_at']
  if published_value.nil? || modified_value.nil?
    errors << "#{relative_path}: pre-2003 source date requires web_published_at and web_modified_at"
    next
  end

  begin
    web_published_at = Time.iso8601(published_value.to_s)
    web_modified_at = Time.iso8601(modified_value.to_s)
    errors << "#{relative_path}: web_published_at predates tedt.org cutoff" if web_published_at.to_date < CUTOFF
    errors << "#{relative_path}: web_modified_at predates web_published_at" if web_modified_at < web_published_at
  rescue ArgumentError => e
    errors << "#{relative_path}: invalid web publication timestamp (#{e.message})"
  end
end

site_dir = SITE_DIR
unless Dir.exist?(site_dir)
  errors << 'Missing _site (run bundle exec jekyll build first)'
else
  rendered_source_dates = 0
  Dir.glob(File.join(site_dir, '**', '*.html')).each do |path|
    html = File.read(path)
    next unless html.include?('Source date:') && html.include?('class="dt-published"')

    rendered_source_dates += 1
    match = html.match(/class="dt-published"\s+datetime="([^"]+)"/)
    if match.nil?
      errors << "#{path.sub("#{ROOT}/", '')}: source-dated quote is missing dt-published datetime"
      next
    end

    begin
      published_at = Time.iso8601(match[1])
      errors << "#{path.sub("#{ROOT}/", '')}: rendered dt-published predates tedt.org cutoff" if published_at.to_date < CUTOFF
    rescue ArgumentError => e
      errors << "#{path.sub("#{ROOT}/", '')}: invalid rendered dt-published (#{e.message})"
    end
  end

  if rendered_source_dates != historical_quotes.length
    errors << "Rendered #{rendered_source_dates} source-dated quotes; expected #{historical_quotes.length}"
  end

  atom_path = File.join(site_dir, 'atom.xml')
  rss_path = File.join(site_dir, 'rss.xml')
  [atom_path, rss_path].each do |path|
    unless File.exist?(path)
      errors << "Missing #{path.sub("#{ROOT}/", '')}"
      next
    end

    xml = File.read(path)
    patterns = path.end_with?('atom.xml') ? [/<published>([^<]+)<\/published>/, /<updated>([^<]+)<\/updated>/] : [/<pubDate>([^<]+)<\/pubDate>/]
    patterns.each do |pattern|
      xml.scan(pattern).flatten.each do |value|
        begin
          errors << "#{path.sub("#{ROOT}/", '')}: feed date predates tedt.org cutoff (#{value})" if Time.parse(value).to_date < CUTOFF
        rescue ArgumentError => e
          errors << "#{path.sub("#{ROOT}/", '')}: invalid feed date #{value.inspect} (#{e.message})"
        end
      end
    end
  end

  %w[feed.json feed-mastodon.json].each do |filename|
    path = File.join(site_dir, filename)
    unless File.exist?(path)
      errors << "Missing #{path.sub("#{ROOT}/", '')}"
      next
    end

    begin
      feed = JSON.parse(File.read(path))
      (feed['items'] || []).each do |item|
        %w[date_published date_modified].each do |field|
          next unless item[field]
          value = Time.iso8601(item[field])
          errors << "#{filename}: #{field} predates tedt.org cutoff for #{item['url']}" if value.to_date < CUTOFF
        end
      end
    rescue JSON::ParserError, ArgumentError => e
      errors << "#{filename}: invalid JSON or timestamp (#{e.message})"
    end
  end
end

if errors.empty?
  puts "Web publication dates: PASS (#{historical_documents.length} historical documents, #{historical_quotes.length} quotes)"
else
  puts 'Web publication dates: FAIL'
  errors.each { |error| puts " - #{error}" }
  exit 1
end
