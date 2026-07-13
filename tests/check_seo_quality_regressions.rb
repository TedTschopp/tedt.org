#!/usr/bin/env ruby
# frozen_string_literal: true

# Rendered-site SEO gates that are intentionally independent of Liquid
# implementation details. Every canonical sitemap page is checked.

require 'date'
require 'json'
require 'nokogiri'
require 'pathname'
require 'rexml/document'
require 'uri'
require 'yaml'

ROOT = Pathname.new(__dir__).parent
SITE_ROOT = Pathname.new(ARGV[0] || ENV['JEKYLL_DESTINATION'] || ROOT.join('_site').to_s)
CONFIG_PATH = ROOT.join('tests/config/seo_quality.yml')
PROPERTY_ORIGIN = 'https://tedt.org'

def fail_with(message)
  warn("ERROR: #{message}")
  exit 1
end

def rendered_file(site_root, location)
  path = URI::DEFAULT_PARSER.unescape(URI.parse(location).path)
  relative = path.sub(%r{\A/}, '')
  candidates = if path.end_with?('/')
                 [site_root.join(relative, 'index.html')]
               else
                 [site_root.join(relative), site_root.join("#{relative}.html"), site_root.join(relative, 'index.html')]
               end
  candidates.find(&:file?)
rescue URI::InvalidURIError
  nil
end

def normalized_url(value)
  uri = URI.parse(value.to_s.strip)
  return nil unless uri.is_a?(URI::HTTPS) && uri.host

  path = URI::DEFAULT_PARSER.escape(URI::DEFAULT_PARSER.unescape(uri.path), /[^#{URI::PATTERN::UNRESERVED}\/]/)
  port = uri.port == 443 ? '' : ":#{uri.port}"
  "https://#{uri.host.downcase}#{port}#{path.empty? ? '/' : path}#{uri.query ? "?#{uri.query}" : ''}"
rescue URI::InvalidURIError
  nil
end

def allowlisted?(path, prefixes)
  Array(prefixes).any? { |prefix| path.start_with?(prefix) }
end

fail_with("Missing rendered site: #{SITE_ROOT}") unless SITE_ROOT.directory?
fail_with("Missing SEO quality config: #{CONFIG_PATH}") unless CONFIG_PATH.file?
config = YAML.safe_load(CONFIG_PATH.read, aliases: false) || {}
snippet = config.fetch('snippet_quality')
budgets = snippet.fetch('budgets')
allowlist = snippet.fetch('allowlisted_url_prefixes', {})
allowed_missing_og = Array(config['allowed_missing_og_assets']).to_h { |path| [path, false] }
allowed_missing_canonicals = Array(config['allowed_missing_canonicals']).to_h { |path| [path, false] }
allowed_missing_og_metadata = Array(config['allowed_missing_og_metadata']).to_h { |path| [path, false] }
allowed_invalid_og_urls = Array(config['allowed_invalid_og_urls']).to_h { |path| [path, false] }

sitemap_path = SITE_ROOT.join('sitemap.xml')
fail_with("Missing sitemap: #{sitemap_path}") unless sitemap_path.file?
sitemap = REXML::Document.new(sitemap_path.read)
entries = REXML::XPath.match(sitemap, '//*[local-name()="url"]')
fail_with('Sitemap contains no URL entries') if entries.empty?

issues = []
titles = Hash.new { |hash, key| hash[key] = [] }
descriptions = Hash.new { |hash, key| hash[key] = [] }
metrics = Hash.new(0)

entries.each do |entry|
  locations = REXML::XPath.match(entry, './*[local-name()="loc"]').map(&:text)
  lastmods = REXML::XPath.match(entry, './*[local-name()="lastmod"]').map(&:text)
  if locations.length != 1
    issues << "sitemap entry has #{locations.length} loc elements"
    next
  end

  location = locations.first
  path = URI.parse(location).path
  rendered = rendered_file(SITE_ROOT, location)
  unless rendered
    issues << "#{location}: rendered HTML is missing"
    next
  end

  document = Nokogiri::HTML(rendered.read)

  canonicals = document.css('head link[rel="canonical"]')
  if canonicals.length != 1
    if canonicals.empty? && allowed_missing_canonicals.key?(path)
      allowed_missing_canonicals[path] = true
    else
      issues << "#{location}: expected one canonical link; found #{canonicals.length}"
    end
  elsif normalized_url(canonicals.first['href']) != normalized_url(location)
    issues << "#{location}: canonical mismatch #{canonicals.first['href'].inspect}"
  end

  og_images = document.css('head meta[property="og:image"]')
  if og_images.length != 1 || og_images.first['content'].to_s.strip.empty?
    if og_images.empty? && allowed_missing_og_metadata.key?(path)
      allowed_missing_og_metadata[path] = true
    else
      issues << "#{location}: expected one nonblank og:image; found #{og_images.length}"
    end
  else
    og_value = og_images.first['content'].to_s.strip
    og_url = normalized_url(og_value)
    if og_url.nil?
      if allowed_invalid_og_urls.key?(path)
        allowed_invalid_og_urls[path] = true
      else
        issues << "#{location}: og:image is not a valid absolute HTTPS URL: #{og_value.inspect}"
      end
    else
      uri = URI.parse(og_url)
      if uri.host == URI.parse(PROPERTY_ORIGIN).host
        asset_path = SITE_ROOT.join(URI::DEFAULT_PARSER.unescape(uri.path).sub(%r{\A/}, ''))
        unless asset_path.file?
          if allowed_missing_og.key?(path)
            allowed_missing_og[path] = true
          else
            issues << "#{location}: local og:image asset is missing: #{uri.path}"
          end
        end
      end
    end
  end

  title = document.at_css('head title')&.text.to_s.gsub(/\s+/, ' ').strip
  description = document.at_css('head meta[name="description"]')&.[]('content').to_s.gsub(/\s+/, ' ').strip
  titles[title] << location unless title.empty?
  descriptions[description] << location unless description.empty?
  metrics['short_titles'] += 1 if title.length < snippet.fetch('title_minimum') &&
                                          !allowlisted?(path, allowlist['short_titles'])
  metrics['long_titles'] += 1 if title.length > snippet.fetch('title_maximum')
  metrics['short_descriptions'] += 1 if description.length < snippet.fetch('description_minimum') &&
                                                !allowlisted?(path, allowlist['short_descriptions'])
  metrics['long_descriptions'] += 1 if description.length > snippet.fetch('description_maximum')

  if lastmods.length != 1 || lastmods.first.to_s.strip.empty?
    metrics['missing_sitemap_lastmods'] += 1
  else
    begin
      lastmod_date = Date.iso8601(lastmods.first.to_s[0, 10])
      issues << "#{location}: sitemap lastmod is in the future" if lastmod_date > Date.today + 1

      json_script = document.at_css('script[type="application/ld+json"]')
      if json_script
        graph = JSON.parse(json_script.text)['@graph']
        primary = Array(graph).find { |node| node.is_a?(Hash) && node['dateModified'] }
        if primary
          modified_date = Date.iso8601(primary['dateModified'].to_s[0, 10])
          issues << "#{location}: sitemap lastmod #{lastmod_date} != schema dateModified #{modified_date}" unless lastmod_date == modified_date
          if primary['datePublished']
            published_date = Date.iso8601(primary['datePublished'].to_s[0, 10])
            issues << "#{location}: sitemap lastmod predates datePublished" if lastmod_date < published_date
          end
        end
      end
    rescue Date::Error, JSON::ParserError => error
      issues << "#{location}: invalid lastmod/schema date: #{error.message}"
    end
  end
end

metrics['duplicate_title_groups'] = titles.count { |_title, urls| urls.length > 1 }
metrics['duplicate_description_groups'] = descriptions.count { |_description, urls| urls.length > 1 }

budgets.each do |metric, maximum|
  actual = metrics.fetch(metric, 0)
  issues << "snippet budget #{metric} regressed: #{actual} > #{maximum}" if actual > maximum
end

{
  'allowed_missing_og_assets' => allowed_missing_og,
  'allowed_missing_canonicals' => allowed_missing_canonicals,
  'allowed_missing_og_metadata' => allowed_missing_og_metadata,
  'allowed_invalid_og_urls' => allowed_invalid_og_urls
}.each do |name, records|
  unused = records.select { |_path, used| !used }.keys
  issues << "remove stale #{name} entries: #{unused.join(', ')}" unless unused.empty?
end

unless issues.empty?
  warn "SEO quality regression check failed with #{issues.length} issue(s):"
  issues.first(100).each { |issue| warn "  - #{issue}" }
  warn "  - ... and #{issues.length - 100} more" if issues.length > 100
  exit 1
end

puts "SEO quality regressions OK (#{entries.length} sitemap pages; " \
     "snippet metrics: #{metrics.sort.map { |key, value| "#{key}=#{value}" }.join(', ')})"
