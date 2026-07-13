#!/usr/bin/env ruby
# frozen_string_literal: true

# Turn a Google Search Console "Pages" CSV export into a prioritized SEO
# working queue. The export supplies real impressions/clicks/CTR/position;
# the rendered Jekyll site supplies the current title and description.

require 'csv'
require 'fileutils'
require 'nokogiri'
require 'optparse'
require 'pathname'
require 'uri'

options = {
  site_dir: '_site',
  output_dir: 'reports/seo/search-console',
  property_url: 'https://tedt.org'
}

OptionParser.new do |parser|
  parser.banner = 'Usage: bundle exec ruby scripts/analyze_search_console_performance.rb --pages CSV [options]'
  parser.on('--pages FILE', 'Search Console Pages CSV export') { |value| options[:pages_csv] = value }
  parser.on('--site DIR', 'Rendered Jekyll site (default: _site)') { |value| options[:site_dir] = value }
  parser.on('--output DIR', 'Output directory (default: reports/seo/search-console)') { |value| options[:output_dir] = value }
  parser.on('--property URL', 'Canonical property origin (default: https://tedt.org)') { |value| options[:property_url] = value }
end.parse!

abort 'ERROR: --pages FILE is required' unless options[:pages_csv]

pages_csv = File.expand_path(options[:pages_csv])
site_dir = File.expand_path(options[:site_dir])
output_dir = File.expand_path(options[:output_dir])
abort "ERROR: Search Console export not found: #{pages_csv}" unless File.file?(pages_csv)
abort "ERROR: rendered site not found: #{site_dir}" unless Dir.exist?(site_dir)

def normalized_header(value)
  value.to_s.delete_prefix("\uFEFF").strip.downcase.gsub(/[^a-z0-9]+/, ' ').strip
end

def find_header(headers, *candidates)
  normalized = headers.to_h { |header| [normalized_header(header), header] }
  candidates.each do |candidate|
    match = normalized[normalized_header(candidate)]
    return match if match
  end
  nil
end

def numeric(value)
  value.to_s.strip.gsub(',', '').to_f
end

def ctr_fraction(value)
  raw = value.to_s.strip
  return numeric(raw.delete_suffix('%')) / 100.0 if raw.end_with?('%')

  number = numeric(raw)
  number > 1 ? number / 100.0 : number
end

def canonical_url(value, property_url)
  raw = value.to_s.strip
  return '' if raw.empty?
  return raw if raw.match?(%r{\Ahttps?://}i)

  URI.join("#{property_url.sub(%r{/+\z}, '')}/", raw.sub(%r{\A/+}, '')).to_s
rescue URI::InvalidURIError
  raw
end

def rendered_file(site_dir, url)
  path = URI::DEFAULT_PARSER.unescape(URI.parse(url).path)
  relative = path.sub(%r{\A/}, '')
  candidates = if path.end_with?('/')
                 [File.join(site_dir, relative, 'index.html')]
               else
                 [
                   File.join(site_dir, relative),
                   File.join(site_dir, "#{relative}.html"),
                   File.join(site_dir, relative, 'index.html')
                 ]
               end
  candidates.find { |candidate| File.file?(candidate) }
rescue URI::InvalidURIError
  nil
end

table = CSV.read(pages_csv, headers: true, encoding: 'bom|utf-8')
headers = table.headers.compact
page_header = find_header(headers, 'Top pages', 'Page', 'URL')
clicks_header = find_header(headers, 'Clicks')
impressions_header = find_header(headers, 'Impressions')
ctr_header = find_header(headers, 'CTR', 'Average CTR')
position_header = find_header(headers, 'Position', 'Average position')

required = {
  page: page_header,
  clicks: clicks_header,
  impressions: impressions_header,
  ctr: ctr_header,
  position: position_header
}
missing = required.select { |_key, header| header.nil? }.keys
abort "ERROR: missing required Search Console column(s): #{missing.join(', ')}" unless missing.empty?

rows = table.filter_map do |source_row|
  url = canonical_url(source_row[page_header], options[:property_url])
  next if url.empty?

  clicks = numeric(source_row[clicks_header])
  impressions = numeric(source_row[impressions_header])
  ctr = ctr_fraction(source_row[ctr_header])
  position = numeric(source_row[position_header])
  file = rendered_file(site_dir, url)
  document = file ? Nokogiri::HTML(File.read(file)) : nil
  title = document&.at_css('title')&.text.to_s.strip
  description = document&.at_css('meta[name="description"]')&.[]('content').to_s.strip

  reasons = []
  reasons << 'near-page-one position (4-10)' if position >= 4 && position <= 10
  reasons << 'page-two position (10-20)' if position > 10 && position <= 20
  reasons << 'high impressions with CTR below 2%' if impressions >= 100 && ctr < 0.02
  reasons << 'search title over 65 characters' if title.length > 65
  reasons << 'description under 70 characters' if !description.empty? && description.length < 70
  reasons << 'description over 170 characters' if description.length > 170
  reasons << 'rendered page not found' unless file

  position_weight = if position >= 4 && position <= 10
                      2.0
                    elsif position > 10 && position <= 20
                      1.5
                    else
                      1.0
                    end
  opportunity_score = (impressions * [1.0 - ctr, 0.01].max * position_weight).round(2)

  {
    'url' => url,
    'clicks' => clicks.round,
    'impressions' => impressions.round,
    'ctr' => format('%.2f%%', ctr * 100),
    'position' => position.round(2),
    'opportunity_score' => opportunity_score,
    'current_title' => title,
    'title_length' => title.length,
    'description_length' => description.length,
    'reasons' => reasons.join('; '),
    'suggested_action' => if reasons.any? { |reason| reason.include?('title') || reason.include?('CTR') }
                            'Review query intent and add an seo_title override if it improves clarity.'
                          elsif position > 10 && position <= 20
                            'Strengthen the page and add contextual links from the relevant topic hub.'
                          else
                            'Monitor; prioritize only when query intent and business value justify work.'
                          end
  }
end

rows.sort_by! { |row| [-row['opportunity_score'], row['position'], row['url']] }
FileUtils.mkdir_p(output_dir)
csv_path = File.join(output_dir, 'page-opportunities.csv')
markdown_path = File.join(output_dir, 'page-opportunities.md')
columns = %w[url clicks impressions ctr position opportunity_score current_title title_length description_length reasons suggested_action]

CSV.open(csv_path, 'w', write_headers: true, headers: columns) do |csv|
  rows.each { |row| csv << columns.map { |column| row[column] } }
end

File.open(markdown_path, 'w') do |report|
  report.puts '# Search Console page opportunities'
  report.puts
  report.puts 'Ranked from a Google Search Console Pages export. The score is a triage aid, not a ranking prediction.'
  report.puts
  report.puts "- Pages analyzed: #{rows.length}"
  report.puts "- Near page one (positions 4-10): #{rows.count { |row| row['position'] >= 4 && row['position'] <= 10 }}"
  report.puts "- Page two (positions 10-20): #{rows.count { |row| row['position'] > 10 && row['position'] <= 20 }}"
  report.puts "- High-impression pages below 2% CTR: #{rows.count { |row| row['impressions'] >= 100 && row['ctr'].to_f < 2.0 }}"
  report.puts
  report.puts '| URL | Clicks | Impressions | CTR | Position | Score | Reasons | Suggested action |'
  report.puts '| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |'
  rows.first(200).each do |row|
    values = %w[url clicks impressions ctr position opportunity_score reasons suggested_action].map do |column|
      row[column].to_s.gsub('|', '\\|').gsub(/[\r\n]+/, ' ')
    end
    report.puts "| #{values.join(' | ')} |"
  end
end

puts "Analyzed #{rows.length} Search Console page rows."
puts "Wrote #{Pathname.new(csv_path)}."
puts "Wrote #{Pathname.new(markdown_path)}."
