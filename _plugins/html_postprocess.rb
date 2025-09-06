#!/usr/bin/env ruby
# frozen_string_literal: true

# Post-render HTML sanitation helpers.
# Performs two main tasks:
# 1. Adds alt attributes to <img> tags that are missing them.
#    - Derives a basic alt from the filename (e.g., Physical Sciences.webp -> "Physical Sciences skill icon").
#    - For skill icons (/img/skills/vertical/NAME.webp) we append " skill icon".
#    - Falls back to a generic "Image" if filename cannot be determined.
# 2. Normalizes malformed absolute URLs and stray quoted entities inside href/src attributes.
#    - Collapses duplicated host prefixes (https://tedt.org/https://tedt.org/ -> https://tedt.org/)
#    - Collapses double slashes after the host (https://tedt.org//RPG -> https://tedt.org/RPG)
#    - Removes leading &quot; or trailing &quot; artifacts surrounding URLs.
#    - Fixes href attributes like href="&quot;https://example.com...&quot;".
#
# This is intentionally conservative (regex-based) to avoid bringing in Nokogiri
# on older Ruby installations (< 3.1) where newer Nokogiri versions are not available.

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

    def self.clean_duplicate_alts(tag)
  alt_count = tag.scan(/\balt=/i).size
  return tag if alt_count <= 1
  # Collect candidate alts (prefer first non-empty, non-generic)
  alts = tag.scan(/alt=("')(.*?)\1/i).map { |m| sanitize_alt(m[1]) }
  chosen = alts.find { |a| a !~ /no image provided/i && !a.strip.empty? } || alts.find { |a| !a.strip.empty? } || 'Image'
  # Remove all alt attributes entirely
  stripped = tag.gsub(/\s*alt=("')[^>]*?\1/i,'')
  # Tidy repeated whitespace
  stripped.gsub!(/\s{2,}/,' ')
  # Remove any space directly before closing > or />
  stripped.gsub!(/\s+(\/?>)/,'\1')
  rebuild_with_alt(stripped, chosen)
    end

    def self.fix_empty_img_src(html)
      return html unless html.include?('<img')
      html.gsub(IMG_TAG_REGEX) do |tag|
        if tag =~ /\bsrc=("')\s*(\1)/i
          tag = tag.sub(/\bsrc=("')\s*(\1)/i, "src=\"#{PLACEHOLDER_DATA_URI}\"")
        end
        tag
      end
    end

    def self.derive_alt(src)
      return 'Image' unless src
      # Extract file name
      fname = src.split('/').last.to_s
      base = fname.sub(/\.[a-zA-Z0-9]{1,5}$/,'')
      base = base.gsub(/[%_]/,' ').gsub(/[-]+/,' ').strip
      return 'Image' if base.empty?
      if src.include?('/img/skills/vertical/')
        # Preserve internal capitalization / spacing
        return base + ' skill icon'
      end
      base
    end

    def self.add_missing_img_alts(html)
      return html unless html.include?("<img")
      html.gsub(IMG_TAG_REGEX) do |tag|
        tag = clean_duplicate_alts(tag) if tag.scan(/\balt=/i).size > 1
        if tag =~ ALT_ATTR_REGEX
          tag = tag.sub(ALT_ATTR_REGEX) do
            q=$1; val=$2
            sanitized = sanitize_alt(val)
            "alt=#{q}#{sanitized}#{q}"
          end
          if tag =~ /\balt=("')(?:\s*|Image)(\1)/i
            src = (tag[SRC_ATTR_REGEX, 2] rescue nil)
            if src && !src.empty? && src != PLACEHOLDER_DATA_URI
              alt_text = sanitize_alt(derive_alt(src))
              tag = tag.sub(/\balt=("')(?:\s*|Image)(\1)/i, "alt=\"#{alt_text}\"")
            else
              tag = tag.sub(/\balt=("')(?:\s*|Image)(\1)/i, 'alt=""')
            end
          end
          next tag
        end
        src = (tag[SRC_ATTR_REGEX, 2] rescue nil)
        if src == PLACEHOLDER_DATA_URI || src.nil? || src.empty?
          rebuild_with_alt(tag, '')
        else
          alt_text = sanitize_alt(derive_alt(src))
          rebuild_with_alt(tag, alt_text)
        end
      end
    end

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

    # Final safety pass: collapse any residual multiple alt attributes that slipped through earlier
    def self.finalize_img_alts(html)
      return html unless html.include?('<img')
      removed = 0
      result = html.gsub(IMG_TAG_REGEX) do |tag|
        alt_matches = tag.scan(/alt=("')(.*?)\1/i)
        # Fast path: already zero or one alt
        if alt_matches.size <= 1
          next tag
        end
        removed += (alt_matches.size - 1)

        # Pick best alt: first non-empty, non-generic; else first; else empty
        chosen = alt_matches.map { |(_, v)| sanitize_alt(v) }
                             .find { |v| !v.strip.empty? && v !~ /no image provided/i } ||
                 alt_matches.map { |(_, v)| sanitize_alt(v) }.find { |v| !v.strip.empty? } || ''

        # Strip ALL alt= attributes (even multiline / with odd spacing)
        stripped = tag.gsub(/\s*alt=("')[^>]*?\1/i, '')
        stripped.gsub!(/\s{2,}/,' ')
        stripped.gsub!(/\s+(\/?>)/,'\1')

        # Ensure we don't already have an alt left from a malformed removal
        if stripped !~ /\balt=/i
          stripped = rebuild_with_alt(stripped, chosen)
        end
        stripped
      end
      if removed > 0
        warn "[html_postprocess] finalize_img_alts removed #{removed} duplicate alt attributes"
      end
      result
    end

    # Deterministic unifier: regardless of earlier passes, ensure exactly ONE alt attribute per <img> tag.
    # Strategy:
    #  * Gather all existing alt values (in order).
    #  * Pick the first non-empty alt that is not a generic 'Image'/'image'.
    #  * Else pick the first non-empty alt.
    #  * Else derive from filename (if any) or fallback to empty string.
    #  * Strip ALL existing alt= attributes and re-insert a single clean alt= value near the end of the tag.
    def self.unify_image_alts(html)
      return html unless html.include?('<img')
      multi_before = 0
      processed = html.gsub(IMG_TAG_REGEX) do |tag|
        src = (tag[SRC_ATTR_REGEX, 2] rescue nil)
        raw_alts = tag.scan(ALT_ATTR_REGEX).map { |m| sanitize_alt(m[1]) }
        multi_before += 1 if raw_alts.size > 1
        chosen = raw_alts.find { |a| !a.empty? && a !~ /^image$/i }
        chosen ||= raw_alts.find { |a| !a.empty? }
        if (chosen.nil? || chosen.empty?)
          if src && !src.empty? && src != PLACEHOLDER_DATA_URI
            chosen = sanitize_alt(derive_alt(src))
          else
            chosen = ''
          end
        end
        # Aggressively strip all alt= attributes via iterative sub to avoid edge cases
        stripped = tag.dup
        loop do
          before = stripped.dup
            # alt attribute pattern: leading optional whitespace then alt=quote...quote (quotes balanced)
          stripped.sub!(/\s*alt=("')[^"']*?\1/i, '')
          break if stripped == before
        end
        # Fallback: remove any remaining alt= (including those with embedded quotes) using broader pattern
        stripped.gsub!(/\s*alt=("')[\s\S]*?\1/i, '') if stripped =~ /\balt=/i
        stripped.gsub!(/\s{2,}/, ' ')
        stripped.gsub!(/\s+(\/?>)/, '\1')
        # Rebuild with a single alt
        rebuild_with_alt(stripped, chosen)
      end
      if multi_before > 0 && processed =~ /<img[^>]*\balt=[^>]*\balt=/i
        warn "[html_postprocess] unify_image_alts WARNING: residual multi-alt after unify (#{multi_before} candidates)"
      elsif multi_before > 0
        warn "[html_postprocess] unify_image_alts collapsed #{multi_before} multi-alt tags"
      end
      processed
    end

    def self.process(html)
      return html unless html.is_a?(String)
      # Forced cleanup mode bypasses marker guard entirely
      force = ENV['HTML_POSTPROCESS_FORCE'] == '1'
      unless force
        # Idempotence guard: if marker present AND no evidence of duplicate alt attributes, skip.
        # We still want to re-run if historical duplicates remain from earlier passes.
        if html.include?('<!-- html-postprocess:ok -->')
          has_multi_alt = html.match(/<img[^>]*\balt=[^>]*\balt=/i)
          return html unless has_multi_alt
        end
      end
      pre_count = html.scan(/<img[^>]*\balt=[^>]*\balt=/i).size
      updated = fix_empty_img_src(html)
      # Preserve existing staged logic, then unify deterministically as final pass.
      updated = add_missing_img_alts(updated)
      updated = finalize_img_alts(updated)
      mid_count = updated.scan(/<img[^>]*\balt=[^>]*\balt=/i).size
      updated = normalize_urls(updated)
      updated = unify_image_alts(updated)
      post_count = updated.scan(/<img[^>]*\balt=[^>]*\balt=/i).size
      if pre_count > 0 || mid_count > 0 || post_count > 0
        warn "[html_postprocess] duplicate-alt counts pre=#{pre_count} mid=#{mid_count} post=#{post_count}"
      end
      unless updated.include?('<!-- html-postprocess:ok -->')
        updated = updated.sub(/<\/head>/i, "<!-- html-postprocess:ok --></head>")
      end
      updated
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
