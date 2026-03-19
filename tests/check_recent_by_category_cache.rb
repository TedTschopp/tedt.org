#!/usr/bin/env ruby
require 'jekyll'

require_relative '../_plugins/category_recent_index'

SOURCE = File.expand_path('..', __dir__)
DESTINATION = File.join(SOURCE, '_site_recent_by_category_check')

def jekyll_site
  config = Jekyll.configuration(
    'source' => SOURCE,
    'destination' => DESTINATION,
    'quiet' => true
  )

  site = Jekyll::Site.new(config)
  site.reset
  site.read
  site
end

def expected_posts_for(site, slug, entry, limit)
  category_names = [slug, entry['title'], *Array(entry['raw_names'])].compact.map { |name| name.to_s.strip }.reject(&:empty?)

  site.posts.docs
    .select do |doc|
      doc_categories = Array(doc.data['categories']).map { |category| category.to_s.strip }
      !(doc_categories & category_names).empty?
    end
    .sort_by { |doc| doc.date || Time.at(0) }
    .reverse
    .first(limit)
end

def doc_ids(docs)
  Array(docs).map(&:relative_path)
end

site = jekyll_site
Jekyll::CategoryRecentIndex.new.generate(site)

cache = site.config['recent_by_category']
abort 'ERROR: recent_by_category cache missing after generator run' unless cache.is_a?(Hash)
abort 'ERROR: recent_by_category cache is empty after generator run' if cache.empty?

limit = (ENV['RECENT_BY_CATEGORY_LIMIT'] || site.config['recent_by_category_limit'] || 50).to_i
registry = site.data['category_registry'] || {}
errors = []

registry.each do |slug, entry|
  expected = expected_posts_for(site, slug, entry, limit)
  next if expected.empty?

  slug_key = slug.to_s
  title_key = entry['title'].to_s.strip
  expected_ids = doc_ids(expected)

  actual_slug = cache[slug_key]
  if actual_slug.nil? || actual_slug.empty?
    errors << "missing cache entry for slug '#{slug_key}'"
  elsif doc_ids(actual_slug) != expected_ids
    errors << "cache drift for slug '#{slug_key}'"
  end

  if title_key.empty?
    errors << "category '#{slug_key}' is missing a title in category_registry"
  else
    actual_title = cache[title_key]
    if actual_title.nil? || actual_title.empty?
      errors << "missing cache entry for title '#{title_key}'"
    elsif doc_ids(actual_title) != expected_ids
      errors << "cache drift for title '#{title_key}'"
    end
  end

  Array(entry['raw_names']).each do |raw_name|
    alias_key = raw_name.to_s.strip
    next if alias_key.empty?

    actual_alias = cache[alias_key]
    if actual_alias.nil? || actual_alias.empty?
      errors << "missing cache entry for alias '#{alias_key}'"
    elsif doc_ids(actual_alias) != expected_ids
      errors << "cache drift for alias '#{alias_key}'"
    end
  end
end

if errors.empty?
  puts 'recent_by_category cache validation: PASS'
else
  puts 'recent_by_category cache validation: FAIL'
  errors.each { |error| puts " - #{error}" }
  exit 1
end