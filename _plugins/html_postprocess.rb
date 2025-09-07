#!/usr/bin/env ruby
# frozen_string_literal: true

# Post-render HTML sanitation helpers (minimal edition).
# We intentionally REMOVED all automatic / heuristic alt generation & mutation.
# Many legacy passes had begun to accumulate, causing exponential duplication of
# alt attributes ( <img ... alt=".." alt="" alt="Image" ...> ) across multi-pass builds.
# Remaining responsibilities:
#   * Ensure empty src replaced with data URI placeholder.
#   * Collapse duplicate alt attributes WITHOUT inventing new text.
#   * Normalize malformed URLs (host duplication, stray &quot; entities, double slashes).
# NOTE: If you need smarter accessibility behavior, implement it upstream in the
# templates / content, not via post-render regex hacks.

module TedtOrg
  module HtmlPostProcess
    SITE_HOST = 'https://tedt.org'

    IMG_TAG_REGEX = /<img\b[^>]*>/i.freeze
    SRC_ATTR_REGEX = /\bsrc=("')(.*?)(\1)/i.freeze
    # Updated: allow multiline alt values (prompt text spilling lines)
    ALT_ATTR_REGEX = /\balt=("')([\s\S]*?)(\1)/i.freeze
    HREF_ATTR_REGEX = /\bhref=("')(.*?)(\1)/i.freeze
    PLACEHOLDER_DATA_URI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

    def self.sanitize_alt(text)
      return '' unless text
      cleaned = text.gsub(/\s+/,' ').strip
      cleaned[0,180]
    end

    def self.rebuild_with_alt(tag, alt_text)
      insertion = " alt=\"#{alt_text}\""
      if tag =~ /\s\/>$/
        tag.sub(/\s*\/>$/) { |m| insertion + m }
      else
        tag.sub(/>$/) { |m| insertion + m }
      end
    end

  # (Deprecated) clean_duplicate_alts removed – superseded by collapse_duplicate_alts.

    def self.fix_empty_img_src(html)
      return html unless html.include?('<img')
      html.gsub(IMG_TAG_REGEX) do |tag|
        if tag =~ /\bsrc=("')\s*(\1)/i
          tag = tag.sub(/\bsrc=("')\s*(\1)/i, "src=\"#{PLACEHOLDER_DATA_URI}\"")
        end
        tag
      end
    end

  # Removed derive_alt & add_missing_img_alts – alt authoring lives in content now.

    def self.normalize_urls(html)
      # Fix duplicated host prefixes inside href/src attributes and stray &quot;
      html.gsub(/\b(href|src)=("')(.*?)(\2)/i) do
        attr = Regexp.last_match(1)
        quote = Regexp.last_match(2)
        url = Regexp.last_match(3)
        original = Regexp.last_match(0)

        cleaned = url.dup
        # Remove HTML entity quotes surrounding actual URL (leading/trailing)
        cleaned = cleaned.gsub(/^&quot;/,'').gsub(/&quot;$/,'')
        # Collapse duplicated host prefixes
        cleaned = cleaned.sub(%r{#{SITE_HOST}/#{SITE_HOST}/?}i, SITE_HOST + '/')
        # Collapse accidental double scheme host join (SITE_HOST + 'https://')
        cleaned = cleaned.sub(%r{#{SITE_HOST}/https?://}i, SITE_HOST + '/')
        # Collapse double slashes after host (but keep protocol)
        cleaned = cleaned.sub(%r{(https?://[^/]+)//+}i, '\1/')

        # Rebuild attribute
        %(#{attr}=#{quote}#{cleaned}#{quote})
      rescue StandardError
        original # fallback on any unexpected error
      end
    end

  # Removed finalize_img_alts & unify_image_alts – complex heuristics caused duplication loops.

    def self.process(html)
      return html unless html.is_a?(String)
      updated = fix_empty_img_src(html)
      updated = collapse_duplicate_alts(updated)
      updated = normalize_urls(updated)
      updated = updated.sub(/<\/head>/i, "<!-- html-postprocess:ok --><\/head>") unless updated.include?('<!-- html-postprocess:ok -->')
      updated
    end

    # New minimal pass: collapse duplicate alt attributes without creating new alts or deriving from filenames.
    # Strategy:
    #  * If 0 or 1 alt attributes, leave tag unchanged.
    #  * If >1, keep the first non-empty, non-generic (not exactly 'image' case-insensitive) alt; else first; else empty string.
    #  * Strip all existing alt attributes and reinsert ONLY the chosen one (unless none existed originally).
    def self.collapse_duplicate_alts(html)
      return html unless html.include?('<img')
      html.gsub(IMG_TAG_REGEX) do |tag|
        # Fast path: 0 or 1 alt present
        alt_markers = tag.scan(/\balt=/i)
        next tag if alt_markers.size <= 1

        # Extract ALL alt values (allow newlines) using broad pattern
        values = tag.scan(/alt=("')(.*?)\1/i).map { |m| sanitize_alt(m[1]) }
        chosen = values.find { |v| !v.empty? && v.downcase != 'image' } || values.find { |v| !v.empty? } || ''

        # Aggressively strip any alt= attribute (tolerate malformed spacing)
        stripped = tag.dup
        loop do
          before = stripped.dup
          stripped.sub!(/\s*alt=("')[^"']*?\1/i, '')
          break if stripped == before
        end
        # Fallback broad removal (handles potential embedded quotes captured earlier)
        stripped.gsub!(/\s*alt=("')[\s\S]*?\1/i, '') if stripped =~ /\balt=/i
        stripped.gsub!(/\s{2,}/, ' ')
        stripped.gsub!(/\s+(\/?>)/, '\1')
        rebuild_with_alt(stripped, chosen)
      end
    end
  end
end

# Optional site-wide sweep (disabled by default to avoid double-processing that was creating duplicate alt attributes).
# Enable only if needed by setting ENV['HTML_POSTPROCESS_SITE_SWEEP'] = '1'.
if ENV['HTML_POSTPROCESS_SITE_SWEEP'] == '1'
  Jekyll::Hooks.register :site, :post_write do |site|
    begin
      Dir.glob(File.join(site.dest, '**', '*.html')).each do |path|
        begin
          content = File.read(path)
          processed = TedtOrg::HtmlPostProcess.process(content)
          if processed != content
            File.open(path, 'w') { |f| f.write(processed) }
          end
        rescue => e
          warn "[html_postprocess] post_write file error #{path}: #{e.class}: #{e.message}"
        end
      end
    rescue => e
      warn "[html_postprocess] post_write sweep error: #{e.class}: #{e.message}"
    end
  end
end

# Register Jekyll hooks (each scope must be registered separately; arrays are ignored)
[:pages, :documents, :posts].each do |scope|
  Jekyll::Hooks.register scope, :post_render do |item|
    next unless item.respond_to?(:output_ext) && item.output_ext == '.html'
    begin
      item.output = TedtOrg::HtmlPostProcess.process(item.output)
      unless @__html_postprocess_logged
        warn '[html_postprocess] post_render hook active'
        @__html_postprocess_logged = true
      end
    rescue => e
      warn "[html_postprocess] Warning (#{scope}): #{e.class}: #{e.message}"
    end
  end
end
