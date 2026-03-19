#!/usr/bin/env ruby
# Precompute a limited, date-sorted list of recent posts per category.
# This eliminates repeated O(total_posts) filtering (site.posts | where_exp ...) in layouts
# for every rendered document (previously multiplying work by number of pages).
#
# Configuration:
#   recent_by_category_limit: <Integer> (in _config.yml) OR env RECENT_BY_CATEGORY_LIMIT
# Defaults to 50 if not set.
#
# Exposes to Liquid:
#   site.recent_by_category["some-slug"] -> Array<Post> newest first
#   site.recent_by_category["Human Title"] -> same array when registry metadata exists
#   site.recent_by_category["Legacy Alias"] -> same array when raw_names define aliases
#
# Registry-aware alias expansion keeps homepage/category templates on the fast path even when
# older posts still use legacy category spellings.
#
module Jekyll
  class CategoryRecentIndex < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      limit = resolve_limit(site)
      canonical_map = Hash.new { |h, k| h[k] = [] }
      alias_map = build_alias_map(site)

      if ENV['CATEGORY_INDEX_PROBE'] == '1'
        rss = `ps -o rss= -p #{Process.pid}`.to_i
        warn "[recent_by_category] start rss=#{rss}KB limit=#{limit} posts=#{site.posts.docs.size}"
      end

      # Collect posts per category
      site.posts.docs.each do |doc|
        Array(doc.data['categories']).each do |cat|
          category_name = cat.to_s.strip
          next if category_name.empty?

          canonical_key = alias_map[normalize_key(category_name)] || category_name
          canonical_map[canonical_key] << doc unless canonical_map[canonical_key].include?(doc)
        end
      end

      # Sort descending by date and truncate
      canonical_map.each do |cat, arr|
        sorted = arr.sort_by { |d| d.date || Time.at(0) }.reverse!
        canonical_map[cat] = sorted.first(limit)
      end

      map = expand_alias_entries(site, canonical_map)
      site.config['recent_by_category'] = map

      if ENV['CATEGORY_INDEX_PROBE'] == '1'
        rss = `ps -o rss= -p #{Process.pid}`.to_i
        cat_count = map.keys.size
        largest = map.values.map(&:size).max || 0
        total_refs = map.values.reduce(0) { |s,a| s + a.size }
        warn "[recent_by_category] done rss=#{rss}KB categories=#{cat_count} total_refs=#{total_refs} largest_list=#{largest}"
      end
    rescue => e
      warn "[recent_by_category] generator error: #{e.class}: #{e.message}"
    end

    private

    def resolve_limit(site)
      cfg = site.config['recent_by_category_limit']
      env = ENV['RECENT_BY_CATEGORY_LIMIT']
      (env || cfg || 50).to_i
    end

    def build_alias_map(site)
      registry = site.data['category_registry'] || {}
      aliases = {}

      registry.each do |slug, entry|
        canonical_slug = slug.to_s.strip
        next if canonical_slug.empty?

        [canonical_slug, entry['title'], *Array(entry['raw_names'])].compact.each do |name|
          normalized = normalize_key(name)
          next if normalized.empty?

          aliases[normalized] = canonical_slug
        end
      end

      aliases
    end

    def expand_alias_entries(site, canonical_map)
      expanded = canonical_map.dup
      registry = site.data['category_registry'] || {}

      registry.each do |slug, entry|
        canonical_slug = slug.to_s.strip
        next if canonical_slug.empty?

        posts = canonical_map[canonical_slug]
        next if posts.nil? || posts.empty?

        [canonical_slug, entry['title'], *Array(entry['raw_names'])].compact.each do |name|
          alias_name = name.to_s.strip
          next if alias_name.empty?

          expanded[alias_name] = posts
        end
      end

      expanded
    end

    def normalize_key(value)
      value.to_s.strip.downcase
    end
  end
end
