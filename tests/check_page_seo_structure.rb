#!/usr/bin/env ruby
# Checks every sitemap target for one usable title, description, and H1.

require 'nokogiri'
require 'rexml/document'
require 'uri'

input_path = ARGV.fetch(0, '_site')
sitemap_path = File.directory?(input_path) ? File.join(input_path, 'sitemap.xml') : input_path
site_directory = File.directory?(input_path) ? input_path : File.dirname(sitemap_path)

abort "ERROR: sitemap missing: #{sitemap_path}" unless File.file?(sitemap_path)

begin
  sitemap = REXML::Document.new(File.read(sitemap_path))
rescue REXML::ParseException => e
  abort "ERROR: sitemap is not well formed: #{e.message}"
end

locations = REXML::XPath.match(sitemap, '//*[local-name()="loc"]').map(&:text).compact
abort "ERROR: sitemap contains no URLs: #{sitemap_path}" if locations.empty?

def rendered_file_for(location, site_directory)
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
rescue URI::InvalidURIError, ArgumentError
  nil
end

def nonblank_text?(node)
  !node.text.to_s.strip.empty?
end

def issue_message(element, nodes, nonblank_count)
  "expected exactly one nonblank #{element}; found #{nodes.length} total, #{nonblank_count} nonblank"
end

issues = []
title_pages = Hash.new { |hash, key| hash[key] = [] }
description_pages = Hash.new { |hash, key| hash[key] = [] }

locations.each do |location|
  rendered_path = rendered_file_for(location, site_directory)
  unless rendered_path
    issues << [location, 'rendered file not found (or URL could not be decoded)']
    next
  end

  html = Nokogiri::HTML(File.read(rendered_path))

  title_nodes = html.css('title')
  head_title_nodes = html.css('head > title')
  nonblank_titles = title_nodes.select { |node| nonblank_text?(node) }
  if title_nodes.length != 1 || head_title_nodes.length != 1 || nonblank_titles.length != 1
    issues << [location, "#{issue_message('<title>', title_nodes, nonblank_titles.length)}; " \
                         "#{head_title_nodes.length} found directly in <head>"]
  else
    title_pages[nonblank_titles.first.text.strip] << location
  end

  description_nodes = html.css('meta').select do |node|
    node['name'].to_s.casecmp('description').zero?
  end
  head_description_nodes = html.css('head meta').select do |node|
    node['name'].to_s.casecmp('description').zero?
  end
  nonblank_descriptions = description_nodes.select { |node| !node['content'].to_s.strip.empty? }
  if description_nodes.length != 1 || head_description_nodes.length != 1 || nonblank_descriptions.length != 1
    issues << [location, "#{issue_message('meta description', description_nodes, nonblank_descriptions.length)}; " \
                         "#{head_description_nodes.length} found in <head>"]
  else
    description_pages[nonblank_descriptions.first['content'].strip] << location
  end

  h1_nodes = html.css('h1')
  nonblank_h1s = h1_nodes.select { |node| nonblank_text?(node) }
  if h1_nodes.length != 1 || nonblank_h1s.length != 1
    issues << [location, issue_message('<h1>', h1_nodes, nonblank_h1s.length)]
  end
end

unless issues.empty?
  warn "ERROR: SEO structure failed for #{issues.map(&:first).uniq.length} of #{locations.length} sitemap pages"
  issues.group_by(&:last).each do |message, matching_issues|
    urls = matching_issues.map(&:first).uniq
    warn "  #{message} (#{urls.length} pages)"
    urls.first(50).each { |url| warn "    - #{url}" }
    warn "    - ... and #{urls.length - 50} more" if urls.length > 50
  end
  exit 1
end

duplicate_titles = title_pages.select { |_text, pages| pages.length > 1 }
duplicate_descriptions = description_pages.select { |_text, pages| pages.length > 1 }
unless duplicate_titles.empty? && duplicate_descriptions.empty?
  warn "WARNING: #{duplicate_titles.length} duplicate title groups and " \
       "#{duplicate_descriptions.length} duplicate description groups (not failures)"
end

puts "Page SEO structure OK (#{locations.length} sitemap pages; one nonblank title, description, and H1 each)"
