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
guides = JSON.parse(root.join('_data/folklore/reader_guides.json').read)
sourced_editions = root.glob('folklore/stories/**/*.html').filter_map do |path|
  fields = path.read[/\A---\n(\{.*?\})\n---/m, 1]
  next unless fields

  story = JSON.parse(fields)
  [story.fetch('permalink'), story.fetch('edition')] if story['edition']
end.to_h
sitemap = REXML::Document.new(site.join('sitemap.xml').read)
sitemap_paths = REXML::XPath.match(sitemap, '//*[local-name()="loc"]').map { |node| URI(node.text).path }

def page(site, url)
  Nokogiri::HTML(site.join(url.delete_prefix('/'), 'index.html').read)
end

def published_english(article)
  references = {}
  paragraphs = article.css('#english p').each_with_index.map do |paragraph, index|
    text = +''
    paragraph.children.each do |child|
      if child['class'] == 'folklore-note-reference'
        link = child.at_css('a')
        references[link['id']] = [index, text.length, link['href']]
      else
        text << child.text
      end
    end
    text
  end
  [paragraphs, references]
end

published = archive.fetch('stories').map { |item| item.fetch('url') }
source_notes = archive.fetch('source_notes').map { |item| item.fetch('url') }
abort 'Folklore catalog contains duplicate URLs' unless (published + source_notes).uniq.size == published.size + source_notes.size
abort 'Reader guide coverage differs from the published catalog' unless guides.fetch('stories').keys.sort == published.map { |url| url.split('/').last }.sort

indexes = {
  'places' => page(site, '/folklore/locations/'),
  'themes' => page(site, '/folklore/themes/')
}

published.each do |url|
  document = page(site, url)
  article = document.at_css('[data-pagefind-body]')
  unless article&.at_css('#english p') && article.at_css('#original [lang] p') &&
         document.at_css('.content-credit-translation-editor') && sitemap_paths.count(url) == 1
    abort "Missing bilingual text, credits, or canonical sitemap entry at #{url}"
  end

  guide = guides.fetch('stories').fetch(url.split('/').last)
  notes = guide.fetch('notes')
  english, references = published_english(article)
  unless english == sourced_editions.fetch(url).fetch('english_paragraphs')
    abort "Reader notes changed the approved English text at #{url}"
  end
  unless article.css('#original [lang] p').map(&:text) == sourced_editions.fetch(url).fetch('original_paragraphs')
    abort "Reader notes changed the approved original text at #{url}"
  end
  unless notes.any? && article.css('#reader-notes ol > li').size == notes.size && article.at_css('.folklore-context p')&.text == guide.fetch('summary')
    abort "Missing story summary or reader notes at #{url}"
  end
  notes.each do |note|
    number = note.fetch('number')
    body = article.at_css("#reader-note-#{number}")
    next unless note['anchor']

    reference = "reader-note-ref-#{number}"
    expected = [note.fetch('paragraph'), note.fetch('offset'), "#reader-note-#{number}"]
    unless references.delete(reference) == expected && body&.at_css("a[href='##{reference}']")
      abort "Invalid reader note #{number} reference or return link at #{url}"
    end
  end
  abort "Unexpected reader note reference at #{url}" unless references.empty?
  indexes.each do |field, index|
    guide.fetch(field).each do |entry|
      target = index.at_css("##{entry.fetch('url').split('#').last}")
      unless target&.parent&.at_css("a[href='#{url}']")
        abort "Missing #{field} index backlink at #{url}"
      end
    end
  end
end

source_notes.each do |url|
  document = page(site, url)
  if document.at_css('[data-pagefind-body], #english, #original, #reader-notes, .folklore-story-text') ||
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
reader_note_count = guides.fetch('stories').values.sum { |guide| guide.fetch('notes').size }
puts "Folklore archive OK (#{published.size} bilingual pages, #{reader_note_count} reader notes, #{source_notes.size} source notes, #{index_count} indexed)"
