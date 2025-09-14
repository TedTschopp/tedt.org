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
#   site.recent_by_category["Some Category"] -> Array<Post> newest first (already sorted / truncated)
#
module Jekyll
  class CategoryRecentIndex < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      limit = resolve_limit(site)
      map = Hash.new { |h, k| h[k] = [] }

      if ENV['CATEGORY_INDEX_PROBE'] == '1'
        rss = `ps -o rss= -p #{Process.pid}`.to_i
        warn "[recent_by_category] start rss=#{rss}KB limit=#{limit} posts=#{site.posts.docs.size}"
      end

      # Collect posts per category
      site.posts.docs.each do |doc|
        Array(doc.data['categories']).each do |cat|
          map[cat] << doc
        end
      end

      # Sort descending by date and truncate
      map.each do |cat, arr|
        sorted = arr.sort_by { |d| d.date || Time.at(0) }.reverse!
        map[cat] = sorted.first(limit)
      end

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
  end
end
