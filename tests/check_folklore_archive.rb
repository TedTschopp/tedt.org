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
story_stubs = root.glob('folklore/stories/**/*.html').filter_map do |path|
  fields = path.read[/\A---\n(\{.*?\})\n---/m, 1]
  next unless fields

  story = JSON.parse(fields)
  [story.fetch('permalink'), story] if story['story_id']
end.to_h
sitemap_stories = archive.fetch('stories')
all_entries = sitemap_stories + archive.fetch('source_notes')
origin = 'https://tedt.org'
indieweb = JSON.parse(site.join('indieweb-manifest.json').read).fetch('entries').to_h { |entry| [entry.fetch('url'), entry] }
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

published = sitemap_stories.map { |item| item.fetch('url') }
source_notes = archive.fetch('source_notes').map { |item| item.fetch('url') }
abort 'Folklore catalog contains duplicate URLs' unless (published + source_notes).uniq.size == published.size + source_notes.size
abort 'Reader guide coverage differs from the published catalog' unless guides.fetch('stories').keys.sort == sitemap_stories.map { |entry| entry.fetch('id') }.sort

all_entries.each do |entry|
  url = entry.fetch('url')
  id = entry.fetch('id')
  canonical = origin + url
  aliases = story_stubs.fetch(url).fetch('redirect_from', [])
  unless archive.fetch('urls_by_id').fetch(id) == url && url.match?(%r{\A/folklore/stories/[a-z0-9-]+/\z}) && !url.include?(id)
    abort "Invalid title-based folklore URL at #{url}"
  end

  document = page(site, url)
  unless document.css('h1').size == 1 && document.at_css('h1').text.strip == entry.fetch('title')
    abort "Story heading differs from its English catalog title at #{url}"
  end
  source_records = story_stubs.fetch(url).dig('edition', 'source_records') || []
  rendered_sources = document.css('#story-sources > ul > li')
  abort "Source records missing or duplicated at #{url}" unless rendered_sources.size == source_records.size
  source_records.zip(rendered_sources).each do |record, rendered|
    links = rendered.css('a').map { |link| link['href'] }
    unless (record.fetch('urls') - links).empty? && record.fetch('notes').all? { |note| rendered.text.include?(note) }
      abort "Source links or annotations missing from shared page at #{url}"
    end
  end
  endpoint = document.at_css('link[rel="webmention"]')&.[]('href')
  form = document.at_css('#webmentions-section form')
  discussion = document.at_css('#discussion a[rel~="external"]')
  unless document.at_css('link[rel="canonical"]')&.[]('href') == canonical &&
         document.at_css('.folklore-discussion-links a[href="#discussion"]') &&
         document.at_css('.folklore-discussion-links a[href="#webmentions-section"]') &&
         discussion && endpoint && form&.[]('action') == endpoint &&
         form.at_css('input[name="target"]')&.[]('value') == canonical
    abort "Missing canonical discussion or Webmention controls at #{url}"
  end
  unless indieweb.fetch(canonical).values_at('aliases', 'outgoing') == [aliases, false]
    abort "Missing response routing for #{url}"
  end
  aliases.each do |alias_url|
    redirect = page(site, alias_url)
    unless redirect.at_css('link[rel="canonical"]')&.[]('href') == canonical &&
           redirect.at_css('meta[http-equiv="refresh"]')&.[]('content') == "0; url=#{canonical}" &&
           redirect.at_css('link[rel="webmention"]')&.[]('href') == endpoint &&
           !sitemap_paths.include?(alias_url) && !redirect.at_css('[data-pagefind-body]')
      abort "Incorrect story redirect from #{alias_url}"
    end
  end
end

indexes = {
  'places' => page(site, '/folklore/locations/'),
  'themes' => page(site, '/folklore/themes/')
}

sitemap_stories.each do |entry|
  url = entry.fetch('url')
  document = page(site, url)
  article = document.at_css('[data-pagefind-body]')
  unless article&.at_css('#english p') && article.at_css('#original [lang] p') &&
         document.at_css('.content-credit-translation-editor') && sitemap_paths.count(url) == 1
    abort "Missing bilingual text, credits, or canonical sitemap entry at #{url}"
  end

  guide = guides.fetch('stories').fetch(entry.fetch('id'))
  notes = guide.fetch('notes')
  english, references = published_english(article)
  edition = story_stubs.fetch(url).fetch('edition')
  unless english == edition.fetch('english_paragraphs')
    abort "Reader notes changed the approved English text at #{url}"
  end
  unless article.css('#original [lang] p').map(&:text) == edition.fetch('original_paragraphs')
    abort "Reader notes changed the approved original text at #{url}"
  end
  unless notes.any? && article.css('#reader-notes ol > li').size == notes.size && article.at_css('.folklore-story-summary')&.text == guide.fetch('summary')
    abort "Missing story summary or reader notes at #{url}"
  end
  sections = article.css('.folklore-reading-nav, #english, #reader-notes, #original, #story-context')
                    .map { |node| node['id'] || 'reading-nav' }
  nav = article.at_css('.folklore-reading-nav')
  unless sections == %w[reading-nav english reader-notes original story-context] &&
         nav.css('a').map { |link| link['href'] } == %w[#english #reader-notes #original]
    abort "Reading navigation and story context overlap at #{url}"
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
search = page(site, '/folklore/search/').at_css('pagefind-config')
unless search&.[]('base-url') == '/' && search['bundle-path'] == '/folklore/pagefind/'
  abort 'Folklore search must resolve story results from the site root'
end
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
