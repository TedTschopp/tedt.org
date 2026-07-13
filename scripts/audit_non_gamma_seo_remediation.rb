#!/usr/bin/env ruby
# frozen_string_literal: true

# Produce the exact non-Gamma-World remainder of the post-remediation SEO list:
# social-image defects (including invalid URLs), unpublished quote sources,
# orphans, missing canonicals, duplicate descriptions, and sitemap URLs
# without lastmod.

require 'csv'
require 'nokogiri'
require 'optparse'
require 'pathname'
require 'rexml/document'
require 'uri'

options = {
  site_dir: '_site',
  social_csv: 'reports/seo/social-image-needs.csv',
  output: 'reports/seo/non-gamma-item-4-remediation.md'
}

OptionParser.new do |parser|
  parser.banner = 'Usage: bundle exec ruby scripts/audit_non_gamma_seo_remediation.rb [options]'
  parser.on('--site DIR', 'Rendered Jekyll site (default: _site)') { |value| options[:site_dir] = value }
  parser.on('--social-csv FILE', 'Current social-image audit CSV') { |value| options[:social_csv] = value }
  parser.on('--output FILE', 'Markdown report path') { |value| options[:output] = value }
end.parse!

root = Pathname.new(__dir__).parent
site_dir = Pathname.new(options[:site_dir]).expand_path
social_csv = Pathname.new(options[:social_csv]).expand_path
output = Pathname.new(options[:output]).expand_path
sitemap_path = site_dir.join('sitemap.xml')
abort "ERROR: rendered sitemap missing: #{sitemap_path}" unless sitemap_path.file?
abort "ERROR: social-image audit missing: #{social_csv}" unless social_csv.file?

def gamma_world?(url, source_path = '')
  path = URI.parse(url.to_s).path
  path.start_with?('/Gamma-World-Bestiary/') ||
    ['/category/gamma-world/', '/category/bestiary/'].include?(path) ||
    source_path.to_s.start_with?('_posts/Gamma World/') ||
    ['category/gamma-world.html', 'category/Bestiary.html'].include?(source_path.to_s)
rescue URI::InvalidURIError
  false
end

def rendered_file(site_dir, url)
  path = URI::DEFAULT_PARSER.unescape(URI.parse(url).path)
  relative = path.sub(%r{\A/}, '')
  candidates = if path.end_with?('/')
                 [site_dir.join(relative, 'index.html')]
               else
                 [site_dir.join(relative), site_dir.join("#{relative}.html"), site_dir.join(relative, 'index.html')]
               end
  candidates.find(&:file?)
rescue URI::InvalidURIError
  nil
end

def markdown(value)
  value.to_s.gsub('|', '\\|').gsub(/[\r\n]+/, ' ').strip
end

sitemap = REXML::Document.new(sitemap_path.read)
entries = REXML::XPath.match(sitemap, '//*[local-name()="url"]').map do |node|
  {
    url: REXML::XPath.first(node, './*[local-name()="loc"]')&.text.to_s.strip,
    lastmod: REXML::XPath.first(node, './*[local-name()="lastmod"]')&.text.to_s.strip
  }
end.reject { |entry| entry[:url].empty? || gamma_world?(entry[:url]) }
urls = entries.map { |entry| entry[:url] }
url_set = urls.to_h { |url| [url, true] }

social_rows = CSV.read(social_csv, headers: true).filter_map do |row|
  next if gamma_world?(row['url'], row['source_path'])

  row.to_h
end

undated_quotes = root.join('_posts/Quotes').glob('*.md').reject do |path|
  path.basename.to_s.match?(/\A\d{4}-\d{2}-\d{2}-/)
end.sort

incoming = Hash.new(0)
documents = {}
urls.each do |url|
  file = rendered_file(site_dir, url)
  next unless file

  document = Nokogiri::HTML(file.read)
  documents[url] = document
  seen = {}
  document.css('a[href]').each do |anchor|
    href = anchor['href'].to_s.strip
    next if href.empty? || href.start_with?('#', 'mailto:', 'tel:', 'javascript:')

    begin
      resolved = URI.parse(URI.join(url, href).to_s.sub(/#.*\z/, ''))
      next unless ['tedt.org', 'www.tedt.org'].include?(resolved.host)

      canonical = "https://tedt.org#{resolved.path}"
      next unless url_set[canonical] && canonical != url

      seen[canonical] = true
    rescue URI::InvalidURIError, ArgumentError
      next
    end
  end
  seen.each_key { |target| incoming[target] += 1 }
end

orphans = urls.reject { |url| url == 'https://tedt.org/' }.select { |url| incoming[url].zero? }
canonical_issues = documents.filter_map do |url, document|
  next if document.at_css('link[rel="canonical"]')&.[]('href').to_s.strip != ''

  main = document.at_css('main') || document.at_css('body')
  [url, main ? main.text.scan(/[[:alnum:]][[:alnum:]’'-]*/).length : 0]
end

description_groups = Hash.new { |hash, key| hash[key] = [] }
documents.each do |url, document|
  description = document.at_css('meta[name="description"]')&.[]('content').to_s.strip
  description_groups[description] << url unless description.empty?
end
duplicate_descriptions = description_groups.select { |_description, pages| pages.length > 1 }
                                            .sort_by { |_description, pages| -pages.length }
missing_lastmod = entries.select { |entry| entry[:lastmod].empty? }.map { |entry| entry[:url] }

output.dirname.mkpath
File.open(output, 'w') do |report|
  report.puts '# Item 4: non-Gamma SEO remediation list'
  report.puts
  report.puts 'Generated from the rendered sitemap/HTML and the current social-image audit. Gamma World URLs are excluded.'
  report.puts
  report.puts '## Summary'
  report.puts
  report.puts "- Social-image issues: #{social_rows.length}"
  social_rows.group_by { |row| row['reason'] }.sort.each do |reason, rows|
    report.puts "  - #{reason}: #{rows.length}"
  end
  report.puts "- Quote source files not publishable as Jekyll posts: #{undated_quotes.length}"
  report.puts "- Sitemap orphans: #{orphans.length}"
  report.puts "- Sitemap pages missing canonical links: #{canonical_issues.length}"
  report.puts "- Duplicate-description groups: #{duplicate_descriptions.length}"
  report.puts "- Sitemap URLs missing lastmod: #{missing_lastmod.length}"
  report.puts

  report.puts '## Social-image issues'
  report.puts
  report.puts '| Reason | URL | Source | Current image | Suggested image |'
  report.puts '| --- | --- | --- | --- | --- |'
  social_rows.sort_by { |row| [row['reason'].to_s, row['url'].to_s] }.each do |row|
    report.puts "| #{%w[reason url source_path current_og_image suggested_asset_path].map { |key| markdown(row[key]) }.join(' | ')} |"
  end
  report.puts

  report.puts '## Quote sources without dated post filenames'
  report.puts
  undated_quotes.each { |path| report.puts "- `#{path.relative_path_from(root)}`" }
  report.puts

  report.puts '## Orphaned sitemap URLs'
  report.puts
  orphans.each { |url| report.puts "- #{url}" }
  report.puts

  report.puts '## Sitemap pages missing canonical links'
  report.puts
  canonical_issues.each { |url, words| report.puts "- #{url} (approximately #{words} main-content words)" }
  report.puts

  report.puts '## Duplicate description groups'
  report.puts
  duplicate_descriptions.each do |description, pages|
    report.puts "- #{markdown(description)}"
    pages.each { |url| report.puts "  - #{url}" }
  end
  report.puts

  report.puts '## Sitemap URLs missing lastmod'
  report.puts
  missing_lastmod.each { |url| report.puts "- #{url}" }
end

puts "Wrote #{output}."
puts "Non-Gamma item-4 totals: #{social_rows.length} social, #{undated_quotes.length} undated quotes, " \
     "#{orphans.length} orphans, #{canonical_issues.length} missing canonicals, " \
     "#{duplicate_descriptions.length} duplicate-description groups, #{missing_lastmod.length} missing lastmod."
