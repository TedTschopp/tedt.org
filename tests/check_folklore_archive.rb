#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'nokogiri'
require 'pathname'
require 'rexml/document'
require 'uri'

site = Pathname.new(ARGV.fetch(0, '_site'))
root = Pathname.new(__dir__).parent
archive = JSON.parse(root.join('_data/folklore/archive.json').read)
sitemap = REXML::Document.new(site.join('sitemap.xml').read)
sitemap_paths = REXML::XPath.match(sitemap, '//*[local-name()="loc"]').map { |node| URI(node.text).path }

def page(site, url)
  Nokogiri::HTML(site.join(url.delete_prefix('/'), 'index.html').read)
end

published = archive.fetch('stories').map { |item| item.fetch('url') }
source_notes = archive.fetch('source_notes').map { |item| item.fetch('url') }
abort 'Folklore catalog contains duplicate URLs' unless (published + source_notes).uniq.size == published.size + source_notes.size

published.each do |url|
  document = page(site, url)
  article = document.at_css('[data-pagefind-body]')
  unless article&.at_css('#english p') && article.at_css('#original [lang] p') &&
         document.at_css('.content-credit-translation-editor') && sitemap_paths.count(url) == 1
    abort "Missing bilingual text, credits, or canonical sitemap entry at #{url}"
  end
end

source_notes.each do |url|
  document = page(site, url)
  if document.at_css('[data-pagefind-body], #english, #original, .folklore-story-text') ||
     sitemap_paths.include?(url) || !document.at_css('meta[name="robots"]')&.[]('content')&.include?('noindex')
    abort "Source note exposes story text or appears in discovery at #{url}"
  end
end

index = JSON.parse(site.join('folklore/pagefind/pagefind-entry.json').read)
index_count = index.fetch('languages').values.sum { |language| language.fetch('page_count') }
abort "Pagefind indexed #{index_count} stories, expected #{published.size}" unless index_count == published.size
archive_pages = archive.fetch('page_count').times.map { |i| i.zero? ? '/folklore/' : "/folklore/page/#{i + 1}/" }
browse_links = archive_pages.flat_map do |url|
  listing = page(site, url)
  links = listing.css('.folklore-catalog h3 a').map { |link| link['href'] }
  abort "Folklore browse page exceeds page size at #{url}" if links.size > archive.fetch('page_size')
  links
end
abort 'Bilingual stories and archive browse links differ' unless published == browse_links
puts "Folklore archive OK (#{published.size} bilingual pages, #{source_notes.size} source notes, #{index_count} indexed)"
