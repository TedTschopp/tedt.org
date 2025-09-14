#!/usr/bin/env ruby
# A Liquid filter to add loading="lazy" to all <img> tags except the first one
# in a block of HTML. Replaces prior Liquid capture/replace pipeline that
# duplicated large post content strings multiple times in memory.
module Jekyll
  module LazyImagesFilter
    def lazy_images_except_first(html)
      return html unless html && html.include?('<img')
      first_idx = html.index('<img')
      return html unless first_idx # safety
      # Keep the first <img ...> segment untouched. We'll search from after the '<img'
      # marker so the opening tag stays eager-loaded for LCP.
      head = html[0...first_idx + 4] # '<img'
      tail = html[first_idx + 4..-1]
      # Only add loading attribute where one is not already present in the tag start.
      # Use a conservative gsub with negative lookahead-like manual check.
      processed = tail.gsub('<img') do |m|
        m # placeholder, we'll post-process below
      end
      # A faster single-pass builder respecting existing loading attribute.
      out = +""
      i = 0
      while i < tail.length
        img_pos = tail.index('<img', i)
        unless img_pos
          out << tail[i..-1]
          break
        end
        out << tail[i...img_pos]
        # Find tag end
        tag_end = tail.index('>', img_pos)
        if tag_end.nil?
          out << tail[img_pos..-1]
          break
        end
        tag = tail[img_pos...tag_end+1]
        if tag =~ /loading\s*=\s*"/i
          out << tag # already has loading
        else
          # inject just after <img
            out << tag.sub('<img', '<img loading="lazy"')
        end
        i = tag_end + 1
      end
      head + out
    rescue => e
      warn "[lazy_images_filter] error: #{e.class}: #{e.message}"
      html
    end
  end
end

Liquid::Template.register_filter(Jekyll::LazyImagesFilter)
