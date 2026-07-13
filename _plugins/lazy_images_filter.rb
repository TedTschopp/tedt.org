#!/usr/bin/env ruby
# Enhance images in rendered Markdown/content with the generated responsive
# WebP manifest. All article-body images are below the page hero and therefore
# load lazily. The original method name remains for template compatibility.
require 'cgi'
require 'uri'

module Jekyll
  module LazyImagesFilter
    def lazy_images_except_first(html)
      return html unless html && html.include?('<img')
      site = @context && @context.registers[:site]
      manifest = site && site.data.dig('responsive_images', 'images')

      html.gsub(/<img\b[^>]*>/i) do |tag|
        enhanced = remove_attribute(tag, 'fetchpriority')
        enhanced = set_attribute(enhanced, 'loading', 'lazy')
        enhanced = set_attribute(enhanced, 'decoding', 'async')
        next enhanced unless manifest

        raw_src = attribute_value(enhanced, 'src')
        key = normalize_local_url(raw_src, site)
        image = key && manifest[key]
        next enhanced unless image

        enhanced = set_attribute(enhanced, 'src', escape_url(raw_src))
        enhanced = add_attribute(enhanced, 'width', image['width'].to_s)
        enhanced = add_attribute(enhanced, 'height', image['height'].to_s)
        srcset = image.fetch('variants', []).map do |variant|
          "#{escape_url(variant['path'])} #{variant['width']}w"
        end.join(', ')
        enhanced = add_attribute(enhanced, 'srcset', srcset) unless srcset.empty?
        add_attribute(enhanced, 'sizes', '100vw')
      end
    rescue => e
      warn "[lazy_images_filter] error: #{e.class}: #{e.message}"
      html
    end

    private

    def attribute_value(tag, name)
      match = tag.match(/\b#{Regexp.escape(name)}\s*=\s*(["'])(.*?)\1/i)
      match && CGI.unescapeHTML(match[2])
    end

    def add_attribute(tag, name, value)
      return tag if tag.match?(/\b#{Regexp.escape(name)}\s*=/i)
      tag.sub(/\A<img\b/i, %(<img #{name}="#{CGI.escapeHTML(value)}"))
    end

    def set_attribute(tag, name, value)
      escaped = CGI.escapeHTML(value)
      pattern = /\b#{Regexp.escape(name)}\s*=\s*(["']).*?\1/i
      return tag.sub(pattern, %(#{name}="#{escaped}")) if tag.match?(pattern)
      add_attribute(tag, name, value)
    end

    def remove_attribute(tag, name)
      tag.gsub(/\s+#{Regexp.escape(name)}\s*=\s*(["']).*?\1/i, '')
    end

    def escape_url(value)
      unsafe = /[^#{URI::PATTERN::UNRESERVED}#{URI::PATTERN::RESERVED}%]/
      URI::DEFAULT_PARSER.escape(value.to_s, unsafe)
    end

    def normalize_local_url(src, site)
      return nil if src.nil? || src.empty? || src.start_with?('data:')
      value = URI::DEFAULT_PARSER.unescape(src.split('?', 2).first)
      site_url = site.config['url'].to_s.sub(%r{/\z}, '')
      if value.start_with?('http://', 'https://')
        return nil unless !site_url.empty? && value.start_with?(site_url + '/')
        value = value.delete_prefix(site_url)
      end
      baseurl = site.config['baseurl'].to_s.sub(%r{/\z}, '')
      value = value.delete_prefix(baseurl) unless baseurl.empty?
      value.start_with?('/') ? value : "/#{value}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::LazyImagesFilter)
