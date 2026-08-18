# frozen_string_literal: true

require "cgi"
require "date"
require "digest"
require "fileutils"
require "find"
require "ipaddr"
require "json"
require "net/http"
require "nokogiri"
require "openssl"
require "pathname"
require "resolv"
require "tempfile"
require "time"
require "timeout"
require "uri"
require "yaml"

require "addressable/uri"
require "jekyll"
require "kramdown"
require "kramdown-parser-gfm"
require "liquid"

require_relative "adapter"

module TedT
  module Substack
    SCHEMA_VERSION = 1
    PAYLOAD_SCHEMA_VERSION = 1
    AUDIENCES = %w[everyone free paid founding].freeze
    EMAIL_TERMINAL_STATES = %w[accepted unknown].freeze
    LEDGER_STATES = %w[
      prepared
      drafted
      publish_intent
      scheduled
      published_web
      email_accepted
      unknown
      conflict
      manual_review
      retired
    ].freeze
    EMAIL_REQUEST_STATES = %w[not_requested pending accepted unknown].freeze
    WEB_STATES = %w[not_published scheduled published unknown].freeze
    ID_PATTERN = /\A[a-z0-9][a-z0-9._-]{1,126}[a-z0-9]\z/
    SLUG_PATTERN = /\A[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\z/
    SUBSTACK_KEYS = %w[
      enabled
      id
      delivery
      audience
      publish_at
      slug
      section
      tags
      paywall_after
      public_source_acknowledged
    ].freeze

    class BridgeError < StandardError
      attr_reader :code, :path, :details

      def initialize(code, message, path: nil, details: nil)
        @code = code
        @path = path
        @details = details
        super(message)
      end

      def to_h
        value = { "code" => code, "message" => message }
        value["path"] = path if path
        value["details"] = details if details
        value
      end
    end

    module Util
      module_function

      def deep_stringify(value)
        case value
        when Hash
          value.each_with_object({}) { |(key, child), result| result[key.to_s] = deep_stringify(child) }
        when Array
          value.map { |child| deep_stringify(child) }
        when String
          normalize_string(value)
        when Time, DateTime
          value.iso8601
        when Date
          value.iso8601
        else
          value
        end
      end

      def deep_sort(value)
        case value
        when Hash
          value.keys.map(&:to_s).sort.each_with_object({}) do |key, result|
            original_key = value.key?(key) ? key : value.keys.find { |candidate| candidate.to_s == key }
            result[key] = deep_sort(value.fetch(original_key))
          end
        when Array
          value.map { |child| deep_sort(child) }
        when String
          normalize_string(value)
        else
          value
        end
      end

      def canonical_json(value)
        JSON.generate(deep_sort(deep_stringify(value)))
      end

      def digest(value)
        Digest::SHA256.hexdigest(canonical_json(value))
      end

      def add_payload_hash(payload)
        value = deep_stringify(payload.reject { |key, _| key.to_s == "payload_hash" })
        value["payload_hash"] = digest(value)
        value
      end

      CONTENT_FIELDS = %w[
        canonical_url
        title
        subtitle
        description
        hero
        content_html
        preview_html
        paid_html
        preview_boundary
        assets
      ].freeze

      def content_hash(payload)
        value = deep_stringify(payload)
        digest(CONTENT_FIELDS.each_with_object({}) { |key, result| result[key] = value[key] })
      end

      def normalized_https_origin(value, code: "invalid_publication_url")
        uri = URI.parse(value.to_s.strip)
        unless uri.is_a?(URI::HTTPS) && uri.host && uri.userinfo.nil? && uri.query.nil? && uri.fragment.nil?
          raise BridgeError.new(code, "Publication URL must be an HTTPS origin")
        end
        unless uri.path.nil? || uri.path.empty? || uri.path == "/"
          raise BridgeError.new(code, "Publication URL must not contain a path")
        end

        port = uri.port == 443 ? nil : uri.port
        URI::HTTPS.build(host: uri.host.downcase, port: port).to_s.sub(%r{/+\z}, "")
      rescue URI::InvalidURIError
        raise BridgeError.new(code, "Publication URL must be a valid HTTPS origin")
      end

      # Encode only bytes that are not valid in an RFC 3986 reference. Existing
      # percent triplets and reserved delimiters are preserved so links such as
      # `?q=1#section` and already-encoded Unicode paths are not corrupted.
      def encode_uri_reference(value)
        bytes = normalize_string(value).bytes
        output = +""
        index = 0
        safe = /[A-Za-z0-9\-._~:\/?#\[\]@!$&'()*+,;=]/
        while index < bytes.length
          byte = bytes[index]
          character = byte.chr
          if character == "%" && index + 2 < bytes.length &&
             bytes[(index + 1)..(index + 2)].all? { |candidate| candidate.chr.match?(/[0-9A-Fa-f]/) }
            output << bytes[index, 3].pack("C*")
            index += 3
          elsif byte < 128 && character.match?(safe)
            output << character
            index += 1
          else
            output << format("%%%02X", byte)
            index += 1
          end
        end
        output
      end

      def field_hashes(payload)
        deep_stringify(payload).reject { |key, _| key == "payload_hash" }.sort.to_h.transform_values do |value|
          digest(value)
        end
      end

      def normalize_string(value)
        normalized = value.to_s.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
        normalized = normalized.unicode_normalize(:nfc) if normalized.respond_to?(:unicode_normalize)
        normalized.gsub("\r\n", "\n").gsub("\r", "\n")
      end

      def blank?(value)
        value.nil? || value.to_s.strip.empty?
      end

      def iso_time(value)
        value.respond_to?(:iso8601) ? value.iso8601 : value.to_s
      end

      def markdown_escape(value)
        CGI.escapeHTML(value.to_s.gsub(/[\r\n]+/, " ")).gsub("|", "\\|")
      end

      def safe_relative_path(path)
        pathname = Pathname.new(path.to_s)
        if pathname.absolute? || pathname.each_filename.any? { |part| part == ".." }
          raise BridgeError.new("unsafe_path", "Path escapes the expected package root", path: path.to_s)
        end

        pathname.cleanpath.to_s
      end
    end

    class FrontMatter
      FRONT_MATTER = /\A---[ \t]*\r?\n(?<yaml>.*?)\r?\n---[ \t]*(?:\r?\n|\z)/m

      def self.read(path, reject_duplicate_keys: true)
        raw = File.read(path, mode: "r:bom|utf-8")
        match = FRONT_MATTER.match(raw)
        unless match
          raise BridgeError.new("missing_front_matter", "Post must begin with valid YAML front matter", path: path)
        end

        reject_duplicate_keys!(match[:yaml], path) if reject_duplicate_keys
        data = YAML.safe_load(
          match[:yaml],
          permitted_classes: [Date, DateTime, Time],
          aliases: true,
          filename: path
        ) || {}
        unless data.is_a?(Hash)
          raise BridgeError.new("malformed_front_matter", "Front matter must be a YAML mapping", path: path)
        end

        [Util.deep_stringify(data), raw[match.end(0)..] || ""]
      rescue Psych::Exception => error
        raise BridgeError.new("malformed_front_matter", error.message, path: path)
      end

      def self.reject_duplicate_keys!(yaml, path)
        stream = Psych.parse_stream(yaml, filename: path)
        stream.children.each { |document| inspect_node!(document.root, path, []) if document.root }
      end

      def self.inspect_node!(node, path, key_path)
        case node
        when Psych::Nodes::Mapping
          seen = {}
          node.children.each_slice(2) do |key_node, value_node|
            unless key_node.is_a?(Psych::Nodes::Scalar)
              raise BridgeError.new("malformed_front_matter", "YAML mapping keys must be scalar values", path: path)
            end
            key = key_node.value.to_s
            if key == "<<" && key_path.first == "substack"
              raise BridgeError.new(
                "unsupported_yaml_alias",
                "YAML merge keys are not allowed inside substack settings",
                path: path
              )
            end
            if seen.key?(key)
              location = (key_path + [key]).join(".")
              raise BridgeError.new(
                "duplicate_yaml_key",
                "Duplicate YAML key '#{location}' is not allowed",
                path: path
              )
            end
            seen[key] = true
            inspect_node!(value_node, path, key_path + [key])
          end
        when Psych::Nodes::Sequence
          node.children.each { |child| inspect_node!(child, path, key_path) }
        when Psych::Nodes::Alias
          if key_path.first == "substack"
            raise BridgeError.new(
              "unsupported_yaml_alias",
              "YAML aliases are not allowed inside substack settings",
              path: path
            )
          end
        end
      end

      private_class_method :reject_duplicate_keys!, :inspect_node!
    end

    PostSpec = Struct.new(
      :id,
      :path,
      :relative_path,
      :data,
      :body,
      :settings,
      :post_date,
      :canonical_url,
      keyword_init: true
    )

    ScanResult = Struct.new(:posts, :excluded, :warnings, :errors, keyword_init: true)
    RenderedPost = Struct.new(:post, :payload, :assets, keyword_init: true)

    class Scanner
      def initialize(root:, now: -> { Time.now })
        @root = File.expand_path(root)
        @now = now
        @config = load_config
        @site_url = normalized_site_url
      end

      attr_reader :site_url

      def scan
        posts = []
        excluded = []
        warnings = []
        errors = []
        ids = Hash.new { |hash, key| hash[key] = [] }

        post_paths.each do |path|
          relative_path = Pathname.new(path).relative_path_from(Pathname.new(@root)).to_s
          begin
            data, body = FrontMatter.read(path, reject_duplicate_keys: false)
            raw_settings = data["substack"]
            next if raw_settings.nil?

            # Duplicate-key enforcement is intentionally scoped to opted-in
            # sources so legacy posts outside the bridge cannot break a deploy.
            data, body = FrontMatter.read(path)
            raw_settings = data["substack"]

            unless raw_settings.is_a?(Hash)
              raise BridgeError.new(
                "invalid_substack_front_matter",
                "substack must be a mapping",
                path: "#{relative_path}:substack"
              )
            end

            raw_id = raw_settings["id"]
            ids[raw_id.strip] << relative_path if raw_id.is_a?(String) && !raw_id.strip.empty?
            settings = validate_settings(raw_settings, relative_path)

            unless settings["enabled"]
              excluded << exclusion(relative_path, raw_id, "not_enabled")
              next
            end

            post_date = parse_post_date(data, path, relative_path)
            reason = eligibility_reason(data, post_date)
            if reason
              excluded << exclusion(relative_path, settings["id"], reason)
              next
            end

            if %w[paid founding].include?(settings["audience"])
              warnings << {
                "code" => "public_source_remains_available",
                "path" => relative_path,
                "message" => "Paid audience segmentation does not make the TedT.org source private"
              }
            end

            posts << PostSpec.new(
              id: settings.fetch("id"),
              path: path,
              relative_path: relative_path,
              data: data,
              body: body,
              settings: settings,
              post_date: post_date,
              canonical_url: canonical_url(data, path)
            )
          rescue BridgeError => error
            errors << error.to_h
          end
        end

        ids.each do |id, paths|
          next unless paths.length > 1

          errors << BridgeError.new(
            "duplicate_id",
            "Substack ID '#{id}' is used by more than one post",
            path: paths.join(", "),
            details: { "id" => id, "paths" => paths }
          ).to_h
        end

        ScanResult.new(posts: posts, excluded: excluded, warnings: warnings, errors: errors)
      end

      private

      def post_paths
        Dir.glob(File.join(@root, "_posts", "**", "*.{md,markdown}"), File::FNM_CASEFOLD).sort
      end

      def load_config
        path = File.join(@root, "_config.yml")
        return {} unless File.file?(path)

        value = YAML.safe_load(
          File.read(path, mode: "r:bom|utf-8"),
          permitted_classes: [Date, DateTime, Time],
          aliases: true,
          filename: path
        ) || {}
        Util.deep_stringify(value)
      rescue Psych::Exception => error
        raise BridgeError.new("malformed_site_config", error.message, path: path)
      end

      def normalized_site_url
        value = @config["url"].to_s.strip
        value = "https://tedt.org" if value.empty?
        uri = URI.parse(value)
        unless uri.is_a?(URI::HTTPS) && uri.host
          raise BridgeError.new("invalid_site_url", "Jekyll site.url must be an HTTPS origin", path: "_config.yml:url")
        end

        value.sub(%r{/+\z}, "")
      rescue URI::InvalidURIError
        raise BridgeError.new("invalid_site_url", "Jekyll site.url must be an HTTPS origin", path: "_config.yml:url")
      end

      def validate_settings(raw, relative_path)
        settings = Util.deep_stringify(raw)
        unknown = settings.keys - SUBSTACK_KEYS
        unless unknown.empty?
          raise BridgeError.new(
            "unknown_substack_field",
            "Unknown Substack fields: #{unknown.sort.join(', ')}",
            path: "#{relative_path}:substack"
          )
        end

        enabled = settings.fetch("enabled", false)
        strict_boolean!(enabled, "#{relative_path}:substack.enabled")
        return { "enabled" => false } unless enabled

        id = required_string(settings["id"], "#{relative_path}:substack.id")
        unless ID_PATTERN.match?(id)
          raise BridgeError.new(
            "invalid_id",
            "id must be 3-128 lowercase URL-safe characters",
            path: "#{relative_path}:substack.id"
          )
        end

        delivery = settings["delivery"]
        unless delivery.is_a?(Hash)
          raise BridgeError.new("invalid_delivery", "delivery must be a mapping", path: "#{relative_path}:substack.delivery")
        end
        delivery = Util.deep_stringify(delivery)
        unknown_delivery = delivery.keys - %w[web email]
        unless unknown_delivery.empty?
          raise BridgeError.new(
            "unknown_delivery_field",
            "Unknown delivery fields: #{unknown_delivery.sort.join(', ')}",
            path: "#{relative_path}:substack.delivery"
          )
        end
        %w[web email].each do |key|
          unless delivery.key?(key)
            raise BridgeError.new(
              "missing_delivery_field",
              "delivery.#{key} is required",
              path: "#{relative_path}:substack.delivery.#{key}"
            )
          end
          strict_boolean!(delivery[key], "#{relative_path}:substack.delivery.#{key}")
        end
        unless delivery.values_at("web", "email").any?
          raise BridgeError.new(
            "empty_delivery",
            "At least one of delivery.web or delivery.email must be true",
            path: "#{relative_path}:substack.delivery"
          )
        end

        audience = settings.fetch("audience", "everyone")
        unless audience.is_a?(String) && AUDIENCES.include?(audience)
          raise BridgeError.new(
            "invalid_audience",
            "audience must be one of: #{AUDIENCES.join(', ')}",
            path: "#{relative_path}:substack.audience"
          )
        end

        acknowledged = settings.fetch("public_source_acknowledged", false)
        strict_boolean!(acknowledged, "#{relative_path}:substack.public_source_acknowledged")
        if %w[paid founding].include?(audience) && !acknowledged
          raise BridgeError.new(
            "public_source_not_acknowledged",
            "paid and founding audiences require public_source_acknowledged: true",
            path: "#{relative_path}:substack.public_source_acknowledged"
          )
        end

        paywall_after = optional_string(settings["paywall_after"], "#{relative_path}:substack.paywall_after")
        if paywall_after && !%w[paid founding].include?(audience)
          raise BridgeError.new(
            "invalid_paywall_audience",
            "paywall_after is allowed only for paid or founding audiences",
            path: "#{relative_path}:substack.paywall_after"
          )
        end

        slug = optional_string(settings["slug"], "#{relative_path}:substack.slug")
        if slug && !SLUG_PATTERN.match?(slug)
          raise BridgeError.new(
            "invalid_slug",
            "slug must contain lowercase letters, numbers, and interior hyphens",
            path: "#{relative_path}:substack.slug"
          )
        end

        section = optional_string(settings["section"], "#{relative_path}:substack.section")
        tags = validate_tags(settings, relative_path)

        {
          "enabled" => true,
          "id" => id,
          "delivery" => delivery.slice("web", "email"),
          "audience" => audience,
          "publish_at" => validate_schedule(settings["publish_at"], relative_path),
          "slug" => slug,
          "section" => section,
          "tags" => tags,
          "paywall_after" => paywall_after,
          "public_source_acknowledged" => acknowledged
        }
      end

      def validate_tags(settings, relative_path)
        value = settings.key?("tags") ? settings["tags"] : nil
        return nil if value.nil?
        unless value.is_a?(Array) && value.all? { |tag| tag.is_a?(String) && !tag.strip.empty? }
          raise BridgeError.new(
            "invalid_tags",
            "tags must be an array of non-empty strings",
            path: "#{relative_path}:substack.tags"
          )
        end

        value.map(&:strip).uniq
      end

      def validate_schedule(value, relative_path)
        return nil if value.nil? || (value.is_a?(String) && value.strip.empty?)
        normalized = case value
                     when Time, DateTime
                       value.iso8601
                     when String
                       value.strip
                     else
                       nil
                     end
        unless normalized && /(?:Z|[+-]\d{2}:\d{2})\z/.match?(normalized)
          raise BridgeError.new(
            "invalid_schedule",
            "publish_at must be ISO-8601 with an explicit offset",
            path: "#{relative_path}:substack.publish_at"
          )
        end

        scheduled = DateTime.iso8601(normalized)
        now = @now.call.to_datetime
        if scheduled <= now
          raise BridgeError.new(
            "invalid_schedule",
            "publish_at must be in the future",
            path: "#{relative_path}:substack.publish_at"
          )
        end
        if scheduled > (now >> 3)
          raise BridgeError.new(
            "schedule_too_far",
            "publish_at may be no more than three calendar months ahead",
            path: "#{relative_path}:substack.publish_at"
          )
        end

        scheduled.iso8601
      rescue Date::Error
        raise BridgeError.new(
          "invalid_schedule",
          "publish_at must be a valid ISO-8601 timestamp",
          path: "#{relative_path}:substack.publish_at"
        )
      end

      def required_string(value, path)
        unless value.is_a?(String) && !value.strip.empty?
          raise BridgeError.new("missing_required_field", "A non-empty string is required", path: path)
        end

        value.strip
      end

      def optional_string(value, path)
        return nil if value.nil? || (value.is_a?(String) && value.strip.empty?)
        unless value.is_a?(String)
          raise BridgeError.new("invalid_field_type", "Expected a string or null", path: path)
        end

        value.strip
      end

      def strict_boolean!(value, path)
        return if value == true || value == false

        raise BridgeError.new("invalid_boolean", "Expected a YAML boolean", path: path)
      end

      def parse_post_date(data, path, relative_path)
        value = data["date"]
        return date_value(value, relative_path) unless value.nil?

        match = /(?:\A|\/)(\d{4})-(\d{2})-(\d{2})-/.match(path)
        unless match
          raise BridgeError.new("missing_post_date", "Post date is missing from front matter and filename", path: relative_path)
        end

        now_offset = @now.call.to_datetime.offset
        DateTime.new(match[1].to_i, match[2].to_i, match[3].to_i, 0, 0, 0, now_offset)
      end

      def date_value(value, relative_path)
        case value
        when DateTime
          value
        when Time
          value.to_datetime
        when Date
          DateTime.new(value.year, value.month, value.day, 0, 0, 0, @now.call.to_datetime.offset)
        else
          DateTime.parse(value.to_s)
        end
      rescue Date::Error
        raise BridgeError.new("invalid_post_date", "Post date is invalid", path: "#{relative_path}:date")
      end

      def eligibility_reason(data, post_date)
        return "published_false" if data["published"] == false
        return "draft" if data["draft"] == true
        return "future_post" if post_date > @now.call.to_datetime

        nil
      end

      def exclusion(path, id, reason)
        { "path" => path, "id" => id, "reason" => reason }
      end

      def canonical_url(data, path)
        basename = File.basename(path).sub(/\.(?:md|markdown)\z/i, "")
        file_slug = basename.sub(/\A\d{4}-\d{2}-\d{2}-/, "")
        slug = Jekyll::Utils.slugify((data["slug"] || file_slug).to_s)
        date = parse_post_date(data, path, path)
        template = data["permalink"]
        template ||= "/prompts/:slug/" if path.include?("/_posts/Prompts/")
        template ||= @config.fetch("permalink", "/:title/")

        if template.to_s.match?(%r{\A[a-z][a-z0-9+.-]*:}i)
          raise BridgeError.new("invalid_permalink", "Post permalink must be a site-relative path", path: path)
        end

        path_categories = Pathname.new(path).relative_path_from(Pathname.new(File.join(@root, "_posts"))).dirname
        categories = []
        categories.concat(path_categories.each_filename.to_a) unless path_categories.to_s == "."
        categories.concat(Array(data["categories"]))
        categories = categories.map { |value| Jekyll::Utils.slugify(value.to_s) }.reject(&:empty?).uniq.join("/")
        placeholders = {
          "title" => slug,
          "slug" => slug,
          "year" => format("%04d", date.year),
          "short_year" => format("%02d", date.year % 100),
          "month" => format("%02d", date.month),
          "i_month" => date.month.to_s,
          "day" => format("%02d", date.day),
          "i_day" => date.day.to_s,
          "y_day" => format("%03d", date.yday),
          "hour" => format("%02d", date.hour),
          "minute" => format("%02d", date.minute),
          "second" => format("%02d", date.second),
          "categories" => categories,
          "output_ext" => ".html"
        }
        relative = Jekyll::URL.new(template: template.to_s, placeholders: placeholders).to_s
        if relative.match?(/:[a-z_]+/i)
          raise BridgeError.new("unresolved_permalink", "Post permalink contains an unresolved Jekyll token", path: path)
        end

        URI.join("#{@site_url}/", relative.sub(%r{\A/+}, "")).to_s
      rescue ArgumentError, NoMethodError => error
        raise BridgeError.new("invalid_permalink", "Could not resolve post permalink: #{error.message}", path: path)
      end
    end

    class Renderer
      REJECT_TAGS = %w[
        script
        style
        iframe
        object
        embed
        form
        input
        button
        select
        textarea
        video
        audio
        source
        track
        canvas
        svg
        math
        link
        meta
      ].freeze
      ALLOWED_TAGS = %w[
        p h1 h2 h3 h4 h5 h6 blockquote pre code ul ol li a img figure figcaption
        table thead tbody tfoot tr th td hr br strong em b i u s del sup sub mark
        details summary dl dt dd span div section article abbr cite q kbd samp var
      ].freeze
      MODULE_SELECTORS = [
        "nav",
        ".site-navigation",
        ".comments",
        ".comment-thread",
        ".related-content",
        ".related-posts",
        ".call-to-action",
        ".alert-call-to-action",
        ".cta",
        ".newsletter-signup",
        "[data-module='related-content']",
        "[data-module='comments']",
        "[data-module='call-to-action']"
      ].freeze
      MARKER_PATTERN = /<!--\s*substack-paywall(?::(?<name>[a-zA-Z0-9._-]+))?\s*-->/

      def initialize(root:, site_url:, site_config: nil)
        @root = File.expand_path(root)
        @site_url = site_url.sub(%r{/+\z}, "")
        @site_config = site_config || load_site_config
      end

      def render(post)
        title = required_metadata(post, "title")
        body = preprocess_markdown(post.body)
        body = materialize_markers(body)
        liquid = render_liquid(body, post)
        html = render_markdown(liquid)
        fragment = Nokogiri::HTML::DocumentFragment.parse(html)

        reject_unsafe_markup!(fragment, post)
        remove_site_only_nodes!(fragment)
        boundary = locate_paywall_boundary(fragment, post)
        assets = []
        hero = hero_payload(post, assets)
        rewrite_and_sanitize!(fragment, post, assets)
        content = split_content(fragment, boundary, post)

        if Nokogiri::HTML::DocumentFragment.parse(content.fetch("content_html")).text.strip.empty?
          raise BridgeError.new("empty_content", "Rendered article body is empty", path: post.relative_path)
        end

        tags = if post.settings["tags"].nil?
                 Array(post.data["tags"]).map(&:to_s).map(&:strip).reject(&:empty?).uniq
               else
                 post.settings["tags"]
               end

        payload = {
          "schema_version" => PAYLOAD_SCHEMA_VERSION,
          "source_id" => post.id,
          "canonical_url" => post.canonical_url,
          "title" => title,
          "subtitle" => optional_metadata(post, "subtitle"),
          "description" => description(post),
          "slug" => post.settings["slug"],
          "section" => post.settings["section"],
          "tags" => tags,
          "audience" => post.settings.fetch("audience"),
          "delivery" => post.settings.fetch("delivery"),
          "publish_at" => post.settings["publish_at"],
          "hero" => hero,
          "content_html" => content.fetch("content_html"),
          "content_text" => Nokogiri::HTML::DocumentFragment.parse(content.fetch("content_html")).text.strip,
          "preview_html" => content.fetch("preview_html"),
          "paid_html" => content["paid_html"],
          "preview_boundary" => content["preview_boundary"],
          "asset_upload_policy" => "official_endpoint_when_available_otherwise_validated_https_url",
          "assets" => deduplicate_assets(assets)
        }
        payload["content_hash"] = Util.content_hash(payload)
        Util.add_payload_hash(payload)
      end

      private

      def load_site_config
        path = File.join(@root, "_config.yml")
        return {} unless File.file?(path)

        Util.deep_stringify(YAML.safe_load(File.read(path), aliases: true) || {})
      end

      def required_metadata(post, key)
        value = post.data[key]
        if Util.blank?(value)
          raise BridgeError.new("missing_article_field", "#{key} is required", path: "#{post.relative_path}:#{key}")
        end

        value.to_s.strip
      end

      def optional_metadata(post, key)
        value = post.data[key]
        Util.blank?(value) ? nil : value.to_s.strip
      end

      def description(post)
        value = post.data["description"] || post.data["excerpt"]
        return nil if Util.blank?(value)

        Nokogiri::HTML::DocumentFragment.parse(value.to_s).text.strip
      end

      def preprocess_markdown(body)
        body.to_s.lines.reject { |line| /^\s*\{\s*\.[^}]+\}\s*$/.match?(line) }.join
      end

      def materialize_markers(body)
        body.gsub(MARKER_PATTERN) do
          name = Regexp.last_match[:name].to_s
          %(<hr data-substack-paywall-marker="#{CGI.escapeHTML(name)}">)
        end
      end

      def render_liquid(body, post)
        protected_body, literals = protect_liquid_literals(body)
        template = Liquid::Template.parse(protected_body, error_mode: :strict)
        rendered = template.render!(
          {
            "page" => Util.deep_stringify(post.data),
            "site" => {
              "url" => @site_url,
              "baseurl" => @site_config["baseurl"],
              "title" => @site_config["title"]
            }
          },
          strict_variables: true,
          strict_filters: true
        )
        if rendered.include?("{{") || rendered.include?("{%")
          raise BridgeError.new("unresolved_liquid", "Rendered body contains unresolved Liquid", path: post.relative_path)
        end

        literals.each_with_index do |literal, index|
          rendered = rendered.gsub(liquid_literal_token(index), literal)
        end
        rendered
      rescue StandardError => error
        raise if error.is_a?(BridgeError)

        raise BridgeError.new(
          "unsupported_liquid",
          "Liquid could not be rendered safely (#{error.class}: #{error.message})",
          path: post.relative_path
        )
      end

      def protect_liquid_literals(body)
        literals = []
        output = []
        fence = nil
        fence_lines = []

        body.to_s.lines.each do |line|
          if fence
            fence_lines << line
            if /^\s*#{Regexp.escape(fence.fetch(:character))}{#{fence.fetch(:length)},}\s*$/.match?(line.chomp)
              output << liquid_literal_token(literals.length)
              output << "\n" unless output.last.end_with?("\n")
              literals << fence_lines.join
              fence = nil
              fence_lines = []
            end
            next
          end

          opening = /^\s*(?<delimiter>`{3,}|~{3,})/.match(line)
          if opening
            delimiter = opening[:delimiter]
            fence = { character: delimiter[0], length: delimiter.length }
            fence_lines = [line]
            next
          end

          output << line.gsub(/(`+)(.+?)\1/) do |literal|
            token = liquid_literal_token(literals.length)
            literals << literal
            token
          end
        end

        if fence
          raise BridgeError.new("unsupported_liquid", "Markdown code fence is not closed")
        end
        [output.join, literals]
      end

      def liquid_literal_token(index)
        "TEDTSUBSTACKLIQUIDLITERAL#{index}TOKEN"
      end

      def render_markdown(body)
        options = Util.deep_stringify(@site_config.fetch("kramdown", {}))
        options["input"] ||= "GFM"
        symbol_options = options.each_with_object({}) { |(key, value), result| result[key.to_sym] = value }
        Kramdown::Document.new(body, symbol_options).to_html
      rescue StandardError => error
        raise BridgeError.new("markdown_render_failed", error.message)
      end

      def reject_unsafe_markup!(fragment, post)
        REJECT_TAGS.each do |tag|
          next unless fragment.at_css(tag)

          raise BridgeError.new("unsupported_html", "Unsupported <#{tag}> element", path: post.relative_path)
        end

        fragment.css("*").each do |node|
          unless ALLOWED_TAGS.include?(node.name)
            raise BridgeError.new("unsupported_html", "Unsupported <#{node.name}> element", path: post.relative_path)
          end
          node.attribute_nodes.each do |attribute|
            next if attribute.name == "data-substack-paywall-marker"
            generated_table_alignment = attribute.name.downcase == "style" &&
                                        %w[th td].include?(node.name) &&
                                        /\Atext-align:\s*(?:left|right|center);?\z/i.match?(attribute.value.to_s.strip)
            if attribute.name.downcase.start_with?("on") ||
               (attribute.name.downcase == "style" && !generated_table_alignment)
              raise BridgeError.new(
                "unsafe_html_attribute",
                "Unsupported #{attribute.name} attribute on <#{node.name}>",
                path: post.relative_path
              )
            end
          end
        end
      end

      def remove_site_only_nodes!(fragment)
        MODULE_SELECTORS.each { |selector| fragment.css(selector).each(&:remove) }
        fragment.xpath(".//comment()").each(&:remove)
      end

      def locate_paywall_boundary(fragment, post)
        setting = post.settings["paywall_after"]
        markers = fragment.css("[data-substack-paywall-marker]")
        if setting.nil?
          unless markers.empty?
            raise BridgeError.new(
              "unexpected_paywall_marker",
              "A paywall marker requires substack.paywall_after",
              path: post.relative_path
            )
          end
          return nil
        end

        node = if setting == "marker" || setting.start_with?("marker:")
                 name = setting == "marker" ? "" : setting.delete_prefix("marker:")
                 if markers.length != 1
                   raise BridgeError.new(
                     "invalid_paywall_boundary",
                     "A marker boundary requires exactly one paywall marker in the article",
                     path: "#{post.relative_path}:substack.paywall_after",
                     details: { "matches" => markers.length }
                   )
                 end
                 matches = markers.select { |marker| marker["data-substack-paywall-marker"].to_s == name }
                 unique_boundary!(matches, setting, post)
               else
                 unless markers.empty?
                   raise BridgeError.new(
                     "invalid_paywall_boundary",
                     "Do not mix a heading boundary with paywall marker comments",
                     path: "#{post.relative_path}:substack.paywall_after"
                   )
                 end
                 normalized = normalize_text(setting)
                 matches = fragment.css("h1,h2,h3,h4,h5,h6").select { |heading| normalize_text(heading.text) == normalized }
                 unique_boundary!(matches, setting, post)
               end

        unless node.parent == fragment
          raise BridgeError.new(
            "nested_paywall_boundary",
            "The paywall boundary must be a top-level heading or marker",
            path: post.relative_path
          )
        end

        {
          "node" => node,
          "kind" => node["data-substack-paywall-marker"] ? "marker" : "heading",
          "value" => setting
        }
      end

      def unique_boundary!(matches, setting, post)
        if matches.length != 1
          raise BridgeError.new(
            "invalid_paywall_boundary",
            "paywall_after '#{setting}' must match exactly one heading or marker",
            path: "#{post.relative_path}:substack.paywall_after",
            details: { "matches" => matches.length }
          )
        end

        matches.first
      end

      def normalize_text(value)
        value.to_s.gsub(/\s+/, " ").strip.downcase
      end

      def rewrite_and_sanitize!(fragment, post, assets)
        fragment.css("a[href]").each do |link|
          link["href"] = absolute_url(link["href"], post.canonical_url, kind: "link", path: post.relative_path)
        end

        fragment.css("img").each do |image|
          if Util.blank?(image["src"])
            raise BridgeError.new("missing_asset_url", "Image is missing src", path: post.relative_path)
          end
          if Util.blank?(image["alt"])
            raise BridgeError.new("missing_image_alt", "Every inline image requires alt text", path: post.relative_path)
          end

          image["src"] = absolute_url(image["src"], post.canonical_url, kind: "image", path: post.relative_path)
          assets << asset_record(image["src"], "inline_image", image["alt"], post.relative_path)
        end

        fragment.css("*").each { |node| sanitize_attributes!(node) }
      end

      def sanitize_attributes!(node)
        allowed = case node.name
                  when "a" then %w[href title]
                  when "img" then %w[src alt title width height]
                  when "th", "td" then %w[colspan rowspan scope]
                  when "code", "pre", "span", "div", "section", "article" then %w[class id title]
                  when "abbr" then %w[title]
                  else %w[id title]
                  end
        node.attribute_nodes.each do |attribute|
          next if attribute.name == "data-substack-paywall-marker"
          node.remove_attribute(attribute.name) unless allowed.include?(attribute.name)
        end
      end

      def split_content(fragment, boundary, post)
        children = fragment.children.to_a
        if boundary.nil?
          html = children.map(&:to_html).join.strip
          return {
            "content_html" => html,
            "preview_html" => html,
            "paid_html" => nil,
            "preview_boundary" => nil
          }
        end

        node = boundary.fetch("node")
        index = children.index(node)
        marker = boundary.fetch("kind") == "marker"
        preview_nodes = marker ? children[0...index] : children[0..index]
        paid_nodes = children[(index + 1)..] || []
        full_nodes = children.reject { |child| child == node && marker }
        preview_html = preview_nodes.map(&:to_html).join.strip
        paid_html = paid_nodes.map(&:to_html).join.strip
        if Nokogiri::HTML::DocumentFragment.parse(preview_html).text.strip.empty? ||
           Nokogiri::HTML::DocumentFragment.parse(paid_html).text.strip.empty?
          raise BridgeError.new(
            "empty_paywall_segment",
            "The paywall boundary must leave substantive content on both sides",
            path: post.relative_path
          )
        end

        {
          "content_html" => full_nodes.map(&:to_html).join.strip,
          "preview_html" => preview_html,
          "paid_html" => paid_html,
          "preview_boundary" => {
            "kind" => boundary.fetch("kind"),
            "value" => boundary.fetch("value")
          }
        }
      end

      def hero_payload(post, assets)
        value = post.data["image"]
        return nil if Util.blank?(value)

        alt = post.data["image-alt"] || post.data["image_alt"]
        if Util.blank?(alt)
          raise BridgeError.new("missing_image_alt", "Hero image requires image-alt", path: "#{post.relative_path}:image-alt")
        end

        url = absolute_url(value.to_s, "#{@site_url}/", kind: "image", path: post.relative_path)
        assets << asset_record(url, "hero_image", alt.to_s, post.relative_path)
        artist_url = post.data["image-credits-artist-URL"]
        source_url = post.data["image-credits-source-URL"]
        {
          "url" => url,
          "alt" => alt.to_s.strip,
          "title" => post.data["image-title"],
          "description" => post.data["image-description"],
          "credits" => {
            "artist" => post.data["image-credits-artist"],
            "artist_url" => Util.blank?(artist_url) ? nil : absolute_url(artist_url, post.canonical_url, kind: "link", path: post.relative_path),
            "source" => post.data["image-credits-source"],
            "source_url" => Util.blank?(source_url) ? nil : absolute_url(source_url, post.canonical_url, kind: "link", path: post.relative_path)
          }.reject { |_key, child| Util.blank?(child) }
        }
      end

      def absolute_url(raw, base, kind:, path:)
        value = raw.to_s.strip
        raise BridgeError.new("missing_url", "URL cannot be empty", path: path) if value.empty?

        escaped = Util.encode_uri_reference(value)
        url = URI.join(base, escaped).to_s
        uri = URI.parse(url)

        if kind == "link" && %w[mailto tel].include?(uri.scheme)
          return url
        end
        unless %w[http https].include?(uri.scheme)
          raise BridgeError.new("unsupported_url_scheme", "Unsupported URL scheme in #{value}", path: path)
        end
        if kind == "image" && uri.scheme != "https"
          if uri.host == URI.parse(@site_url).host
            uri.scheme = "https"
            url = uri.to_s
          else
            raise BridgeError.new("insecure_asset_url", "Images must use HTTPS", path: path)
          end
        end

        url
      rescue URI::InvalidURIError
        raise BridgeError.new("invalid_url", "Invalid URL '#{value}'", path: path)
      end

      def asset_record(url, kind, alt, source_path)
        uri = URI.parse(url)
        site_host = URI.parse(@site_url).host
        record = {
          "url" => url,
          "kind" => kind,
          "alt" => alt.to_s,
          "local_path" => nil,
          "sha256" => nil
        }
        return record unless uri.host == site_host

        relative = URI::DEFAULT_PARSER.unescape(uri.path.to_s).sub(%r{\A/+}, "")
        expanded = File.expand_path(relative, @root)
        unless expanded.start_with?("#{@root}#{File::SEPARATOR}") && File.file?(expanded) && !File.symlink?(expanded)
          raise BridgeError.new("missing_asset", "Local asset does not exist: #{uri.path}", path: source_path)
        end
        real = File.realpath(expanded)
        unless real.start_with?("#{File.realpath(@root)}#{File::SEPARATOR}")
          raise BridgeError.new("unsafe_asset_path", "Local asset escapes the repository", path: source_path)
        end
        validate_image_file!(real, source_path)

        record["local_path"] = relative
        record["sha256"] = Digest::SHA256.file(real).hexdigest
        record
      end

      def validate_image_file!(path, source_path)
        header = File.binread(path, 32)
        image = header.start_with?("\x89PNG\r\n\x1A\n".b) ||
                header.start_with?("\xFF\xD8\xFF".b) ||
                header.start_with?("GIF87a".b) ||
                header.start_with?("GIF89a".b) ||
                (header.start_with?("RIFF".b) && header.byteslice(8, 4) == "WEBP".b) ||
                (header.byteslice(4, 4) == "ftyp".b && %w[avif avis mif1 msf1 heic heix].include?(header.byteslice(8, 4)))
        return if image

        raise BridgeError.new("invalid_image_asset", "Local asset is not a supported raster image", path: source_path)
      end

      def deduplicate_assets(assets)
        assets.each_with_object([]) do |asset, result|
          existing = result.find { |candidate| candidate["url"] == asset["url"] }
          if existing
            existing["kinds"] ||= [existing.delete("kind")]
            existing["kinds"] << asset["kind"] unless existing["kinds"].include?(asset["kind"])
          else
            result << asset.dup
          end
        end
      end
    end

    class RemoteAssetValidator
      PRIVATE_RANGES = %w[
        0.0.0.0/8
        10.0.0.0/8
        100.64.0.0/10
        127.0.0.0/8
        169.254.0.0/16
        172.16.0.0/12
        192.0.0.0/24
        192.168.0.0/16
        198.18.0.0/15
        224.0.0.0/4
        ::/128
        ::1/128
        fc00::/7
        fe80::/10
      ].map { |value| IPAddr.new(value) }.freeze

      def initialize(open_timeout: 8, read_timeout: 12, resolver: Resolv, expected_content_prefix: "image/")
        @open_timeout = open_timeout
        @read_timeout = read_timeout
        @resolver = resolver
        @expected_content_prefix = expected_content_prefix
      end

      def validate!(urls)
        urls.uniq.sort.each { |url| request!(URI.parse(url), redirects: 0) }
        true
      end

      private

      def request!(uri, redirects:)
        raise BridgeError.new("asset_redirect_loop", "Too many redirects for #{uri}") if redirects > 4
        unless uri.is_a?(URI::HTTPS) && uri.host
          raise BridgeError.new("invalid_remote_asset", "Remote asset must use HTTPS: #{uri}")
        end
        addresses = public_host!(uri.host)

        response = perform(uri, Net::HTTP::Head.new(uri.request_uri), addresses.first)
        if response.is_a?(Net::HTTPRedirection)
          location = response["location"]
          raise BridgeError.new("invalid_remote_asset", "Asset redirect omitted Location: #{uri}") if Util.blank?(location)

          return request!(URI.join(uri.to_s, location), redirects: redirects + 1)
        end
        if [403, 405].include?(response.code.to_i)
          request = Net::HTTP::Get.new(uri.request_uri)
          request["Range"] = "bytes=0-0"
          response = perform(uri, request, addresses.first)
        end
        unless response.code.to_i.between?(200, 299)
          raise BridgeError.new(
            "remote_asset_unavailable",
            "Asset returned HTTP #{response.code}: #{uri}"
          )
        end
        content_type = response["content-type"].to_s.split(";", 2).first.to_s.strip.downcase
        unless content_type.start_with?(@expected_content_prefix)
          raise BridgeError.new("invalid_remote_content_type", "URL has an unexpected content type: #{uri}")
        end

        true
      rescue SocketError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError => error
        raise BridgeError.new("remote_asset_unavailable", "Could not validate #{uri}: #{error.class}")
      end

      def perform(uri, request, address)
        request["User-Agent"] = "TedT.org-Substack-Bridge/1"
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.open_timeout = @open_timeout
        http.read_timeout = @read_timeout
        http.ipaddr = address.to_s
        http.start { |connection| connection.request(request) }
      end

      def public_host!(host)
        if host.downcase == "localhost" || host.downcase.end_with?(".local")
          raise BridgeError.new("private_asset_host", "Private asset hosts are not allowed")
        end

        addresses = begin
          [IPAddr.new(host)]
        rescue IPAddr::InvalidAddressError
          @resolver.getaddresses(host).map { |address| IPAddr.new(address) }
        end
        if addresses.empty? || addresses.any? { |address| PRIVATE_RANGES.any? { |range| range.include?(address) } }
          raise BridgeError.new("private_asset_host", "Asset host must resolve only to public addresses")
        end
        addresses
      end
    end

    class Ledger
      attr_reader :data, :path

      def self.bootstrap(activated_at:, publication_url: nil)
        new(
          nil,
          {
            "schema_version" => SCHEMA_VERSION,
            "activated_at" => activated_at,
            "publication_url" => publication_url,
            "entries" => {}
          }
        )
      end

      def self.load(path)
        unless File.file?(path)
          raise BridgeError.new("missing_ledger", "Substack ledger does not exist", path: path)
        end

        parsed = JSON.parse(File.read(path, mode: "r:bom|utf-8"))
        new(path, parsed)
      rescue JSON::ParserError => error
        raise BridgeError.new("malformed_ledger", error.message, path: path)
      end

      def initialize(path, data)
        @path = path
        @data = Util.deep_stringify(data)
        validate!
      end

      def entries
        data.fetch("entries")
      end

      def activated_at
        DateTime.iso8601(data.fetch("activated_at"))
      rescue Date::Error
        raise BridgeError.new("invalid_ledger", "activated_at must be ISO-8601", path: path)
      end

      def [](source_id)
        entries[source_id]
      end

      def publication_url
        data["publication_url"]
      end

      def verify_publication_url!(value, allow_unbound_empty: false)
        configured = Util.normalized_https_origin(value)
        if Util.blank?(publication_url)
          return configured if allow_unbound_empty && entries.empty?

          raise BridgeError.new(
            "unbound_publication",
            "The durable ledger must be bound to the approved Substack publication before API mutation",
            path: path
          )
        end
        recorded = Util.normalized_https_origin(publication_url)
        if recorded != configured
          raise BridgeError.new("publication_mismatch", "Configured publication does not match the durable ledger", path: path)
        end

        configured
      end

      def bind_publication_url!(value)
        configured = Util.normalized_https_origin(value)
        if Util.blank?(publication_url)
          unless entries.empty?
            raise BridgeError.new("unbound_publication", "A non-empty ledger cannot be bound implicitly", path: path)
          end
          data["publication_url"] = configured
          return true
        end

        verify_publication_url!(configured)
        false
      end

      def save!(target = path)
        raise BridgeError.new("missing_ledger_path", "A ledger path is required") if Util.blank?(target)
        validate!

        directory = File.dirname(target)
        FileUtils.mkdir_p(directory)
        Tempfile.create(["substack-sync", ".json"], directory) do |tempfile|
          tempfile.write(JSON.pretty_generate(Util.deep_sort(data)))
          tempfile.write("\n")
          tempfile.flush
          tempfile.fsync
          File.rename(tempfile.path, target)
        end
        @path = target
        true
      end

      def mark_intent!(candidate, now: Time.now)
        source_id = candidate.fetch("id")
        payload = candidate.fetch("payload")
        entry = entries[source_id] ||= {}
        previous_email = entry.dig("email", "request_status")
        unless candidate.dig("effective_delivery", "email") == true
          raise BridgeError.new("email_intent_not_required", "Candidate does not request email delivery", path: source_id)
        end
        if %w[pending accepted unknown].include?(previous_email) || %w[publish_intent unknown].include?(entry["state"])
          raise BridgeError.new("email_retry_blocked", "An accepted, pending, or unknown email request cannot be retried", path: source_id)
        end
        unless entry["state"] == "drafted" && !Util.blank?(entry.dig("remote", "draft_id"))
          raise BridgeError.new("draft_not_durable", "Email intent requires a durably recorded remote draft", path: source_id)
        end
        if entry["payload_hash"] == payload.fetch("payload_hash") && %w[published_web email_accepted].include?(entry["state"])
          raise BridgeError.new("already_synchronized", "The prepared payload is already recorded", path: source_id)
        end

        entry.merge!(base_entry(candidate, now))
        entry["state"] = "publish_intent"
        entry["intent_payload_hash"] = payload.fetch("payload_hash")
        entry["intent_created_at"] = now.iso8601
        entry["email"] ||= {}
        entry["email"]["request_status"] = "pending"
        entry
      end

      def record_manual!(candidate, publication_url:, remote_url:, remote_post_id:, remote_draft_id: nil,
                         web_status: "published", email_status: "not_requested", now: Time.now)
        validate_remote_url!(publication_url, remote_url)
        bind_publication_url!(publication_url)
        unless WEB_STATES.include?(web_status)
          raise BridgeError.new("invalid_web_status", "Invalid manual web status")
        end
        unless %w[not_requested accepted unknown].include?(email_status)
          raise BridgeError.new("invalid_email_status", "Invalid manual email request status")
        end
        if Util.blank?(remote_post_id) && Util.blank?(remote_draft_id)
          raise BridgeError.new("missing_remote_id", "A remote post or draft ID is required")
        end
        if web_status == "published" && Util.blank?(remote_post_id)
          raise BridgeError.new("missing_remote_id", "A published web record requires a remote post ID")
        end
        if email_status != "not_requested" && candidate.dig("effective_delivery", "email") != true
          raise BridgeError.new(
            "inconsistent_email_status",
            "An email status can be recorded only when the prepared delivery requested email"
          )
        end

        source_id = candidate.fetch("id")
        entry = entries[source_id] ||= {}
        previous_email = entry.dig("email", "request_status")
        if (previous_email == "accepted" && email_status != "accepted") ||
           (previous_email == "unknown" && !%w[unknown accepted].include?(email_status)) ||
           (previous_email == "pending" && email_status == "not_requested")
          raise BridgeError.new("email_state_regression", "Manual recording cannot downgrade a prior email request state", path: source_id)
        end
        existing_post_id = entry.dig("remote", "post_id")
        if existing_post_id && remote_post_id && existing_post_id != remote_post_id
          raise BridgeError.new("remote_id_conflict", "The ledger already points to another remote post", path: source_id)
        end
        assert_remote_identity_available!(source_id, remote_post_id, remote_draft_id, remote_url)

        entry.merge!(base_entry(candidate, now))
        entry["remote"] ||= {}
        entry["remote"]["post_id"] = remote_post_id unless Util.blank?(remote_post_id)
        entry["remote"]["draft_id"] = remote_draft_id unless Util.blank?(remote_draft_id)
        entry["remote"]["url"] = remote_url
        entry["web"] = {
          "status" => web_status,
          "published" => web_status == "published",
          "verified_at" => now.iso8601
        }
        entry["email"] = {
          "request_status" => email_status,
          "delivery_evidence" => "unknown",
          "recorded_at" => now.iso8601
        }
        entry["state"] = if email_status == "unknown" || web_status == "unknown"
                           "unknown"
                         elsif email_status == "accepted"
                           "email_accepted"
                         elsif web_status == "published"
                           "published_web"
                         elsif web_status == "scheduled"
                           "scheduled"
                         else
                           "drafted"
                         end
        if %w[scheduled published].include?(web_status)
          entry["slug"] ||= candidate.dig("payload", "slug") || slug_from_url(remote_url)
        end
        entry.delete("intent_payload_hash")
        entry.delete("intent_created_at")
        entry
      end

      private

      def validate!
        unless data.is_a?(Hash) && data["schema_version"] == SCHEMA_VERSION
          raise BridgeError.new(
            "unsupported_ledger_version",
            "Ledger schema_version must equal #{SCHEMA_VERSION}",
            path: path
          )
        end
        unless data["entries"].is_a?(Hash) && data["activated_at"].is_a?(String)
          raise BridgeError.new("invalid_ledger", "Ledger requires activated_at and entries", path: path)
        end
        unless data["publication_url"].nil? || data["publication_url"].is_a?(String)
          raise BridgeError.new("invalid_ledger", "publication_url must be a string or null", path: path)
        end
        data["publication_url"] = Util.normalized_https_origin(data["publication_url"]) unless Util.blank?(data["publication_url"])
        activated_at
        identities = { "post_id" => {}, "draft_id" => {}, "url" => {} }
        entries.each do |source_id, entry|
          validate_entry!(source_id, entry)
          identities.each_key do |key|
            value = entry.dig("remote", key)
            next if Util.blank?(value)
            if identities[key].key?(value)
              raise BridgeError.new(
                "remote_id_conflict",
                "Remote #{key} is shared by '#{identities[key][value]}' and '#{source_id}'",
                path: path
              )
            end
            identities[key][value] = source_id
          end
        end
      end

      def base_entry(candidate, now)
        payload = candidate.fetch("payload")
        existing = entries[candidate.fetch("id")] || {}
        paths = Array(existing["source_paths"]) | [existing["source_path"], candidate.fetch("source_path")].compact
        {
          "source_path" => candidate.fetch("source_path"),
          "source_paths" => paths,
          "source_sha" => candidate.fetch("source_sha"),
          "payload_hash" => payload.fetch("payload_hash"),
          "content_hash" => payload["content_hash"] || Util.content_hash(payload),
          "field_hashes" => Util.field_hashes(payload),
          "canonical_url" => payload["canonical_url"],
          "proposed_slug" => payload["slug"],
          "audience" => payload.fetch("audience"),
          "delivery" => payload.fetch("delivery"),
          "last_effective_delivery" => candidate.fetch("effective_delivery"),
          "publish_at" => payload["publish_at"],
          "updated_at" => now.iso8601
        }
      end

      def validate_entry!(source_id, entry)
        unless source_id.is_a?(String) && ID_PATTERN.match?(source_id) && entry.is_a?(Hash)
          raise BridgeError.new("invalid_ledger", "Ledger entries require valid source IDs and mappings", path: path)
        end
        required_strings = %w[source_path source_sha payload_hash content_hash canonical_url state updated_at]
        required_strings.each do |key|
          unless entry[key].is_a?(String) && !entry[key].empty?
            raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' requires #{key}", path: path)
          end
        end
        %w[payload_hash content_hash].each do |key|
          unless /\A[0-9a-f]{64}\z/.match?(entry[key])
            raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has an invalid #{key}", path: path)
          end
        end
        unless LEDGER_STATES.include?(entry["state"])
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has an unknown state", path: path)
        end
        unless entry["source_paths"].is_a?(Array) && entry["source_paths"].all? { |value| value.is_a?(String) && !value.empty? } &&
               entry["source_paths"].include?(entry["source_path"])
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid source path history", path: path)
        end
        unless entry["field_hashes"].is_a?(Hash) && entry["field_hashes"].values.all? { |value| /\A[0-9a-f]{64}\z/.match?(value.to_s) }
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid field hashes", path: path)
        end
        unless AUDIENCES.include?(entry["audience"])
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has an invalid audience", path: path)
        end
        %w[delivery last_effective_delivery].each do |key|
          delivery = entry[key]
          unless delivery.is_a?(Hash) && delivery.keys.sort == %w[email web] &&
                 delivery.values.all? { |value| value == true || value == false } && delivery.values.any?
            raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid #{key}", path: path)
          end
        end
        unless entry["email"].is_a?(Hash) && EMAIL_REQUEST_STATES.include?(entry.dig("email", "request_status"))
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid email state", path: path)
        end
        unless entry["web"].is_a?(Hash) && entry["remote"].is_a?(Hash)
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' requires web and remote mappings", path: path)
        end
        if entry["web"].key?("status") && !WEB_STATES.include?(entry.dig("web", "status"))
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid web state", path: path)
        end
        if entry["web"].key?("published") && ![true, false].include?(entry.dig("web", "published"))
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid web publication flag", path: path)
        end
        entry["remote"].each do |key, value|
          next if value.nil? || (value.is_a?(String) && !value.empty?)

          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid remote.#{key}", path: path)
        end
        if entry["slug"] && !SLUG_PATTERN.match?(entry["slug"])
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has an invalid locked slug", path: path)
        end
        begin
          DateTime.iso8601(entry["updated_at"])
          DateTime.iso8601(entry["publish_at"]) unless Util.blank?(entry["publish_at"])
          canonical = URI.parse(entry["canonical_url"])
          unless canonical.is_a?(URI::HTTPS) && canonical.host
            raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has an invalid canonical URL", path: path)
          end
        rescue Date::Error, URI::InvalidURIError
          raise BridgeError.new("invalid_ledger", "Entry '#{source_id}' has invalid timestamp or URL metadata", path: path)
        end
        if !Util.blank?(entry.dig("remote", "url")) && !Util.blank?(publication_url)
          validate_remote_url!(publication_url, entry.dig("remote", "url"))
        end
        if entry["state"] == "drafted" && Util.blank?(entry.dig("remote", "draft_id"))
          raise BridgeError.new("invalid_ledger", "Drafted entry '#{source_id}' requires a remote draft ID", path: path)
        end
        if entry["state"] == "email_accepted" && entry.dig("email", "request_status") != "accepted"
          raise BridgeError.new("invalid_ledger", "Email-accepted entry '#{source_id}' lacks accepted request evidence", path: path)
        end
        if entry["state"] == "published_web" && entry.dig("web", "published") != true
          raise BridgeError.new("invalid_ledger", "Published entry '#{source_id}' lacks web verification", path: path)
        end
        if entry.dig("web", "published") == true &&
           (Util.blank?(entry.dig("remote", "post_id")) || Util.blank?(entry.dig("remote", "url")))
          raise BridgeError.new("invalid_ledger", "Published entry '#{source_id}' requires a remote post ID and URL", path: path)
        end
        if entry["state"] == "scheduled" && entry.dig("web", "status") != "scheduled"
          raise BridgeError.new("invalid_ledger", "Scheduled entry '#{source_id}' lacks schedule state", path: path)
        end
        if entry.dig("web", "status") == "scheduled" && Util.blank?(entry.dig("remote", "url"))
          raise BridgeError.new("invalid_ledger", "Scheduled entry '#{source_id}' requires a remote URL", path: path)
        end
        if entry["state"] == "publish_intent"
          unless entry.dig("email", "request_status") == "pending" &&
                 entry["intent_payload_hash"] == entry["payload_hash"] && !Util.blank?(entry.dig("remote", "draft_id"))
            raise BridgeError.new("invalid_ledger", "Publish intent '#{source_id}' is incomplete", path: path)
          end
        end
      end

      def assert_remote_identity_available!(source_id, post_id, draft_id, remote_url)
        entries.each do |other_id, other|
          next if other_id == source_id
          conflict = (!Util.blank?(post_id) && other.dig("remote", "post_id") == post_id) ||
                     (!Util.blank?(draft_id) && other.dig("remote", "draft_id") == draft_id) ||
                     (!Util.blank?(remote_url) && other.dig("remote", "url") == remote_url)
          raise BridgeError.new("remote_id_conflict", "Remote identity is already assigned to '#{other_id}'") if conflict
        end
      end

      def slug_from_url(value)
        URI.parse(value.to_s).path.to_s.split("/").reject(&:empty?).last
      rescue URI::InvalidURIError
        nil
      end

      def validate_remote_url!(publication_url, remote_url)
        publication = URI.parse(Util.normalized_https_origin(publication_url))
        remote = URI.parse(remote_url.to_s)
        unless publication.is_a?(URI::HTTPS) && remote.is_a?(URI::HTTPS) &&
               publication.host && remote.host == publication.host && remote.port == publication.port &&
               remote.userinfo.nil? && remote.query.nil? && remote.fragment.nil? && !remote.path.to_s.empty?
          raise BridgeError.new(
            "invalid_remote_url",
            "Remote URL must be HTTPS on the configured Substack publication host"
          )
        end
      rescue URI::InvalidURIError
        raise BridgeError.new("invalid_remote_url", "Remote URL is invalid")
      end
    end

    class Planner
      CONFLICT_STATES = %w[publish_intent unknown conflict manual_review].freeze

      def initialize(ledger:, source_sha:, backfill: false, source_id: nil, force_package: nil)
        @ledger = ledger
        @source_sha = source_sha
        @backfill = backfill
        @source_id = source_id
        @force_package = force_package
      end

      def plan(rendered_posts)
        candidates = []
        skipped = []
        alerts = []
        current_ids = rendered_posts.map { |rendered| rendered.post.id }

        rendered_posts.each do |rendered|
          post = rendered.post
          next if @source_id && post.id != @source_id

          payload = apply_slug_lock(rendered.payload, post)
          entry = @ledger[post.id]
          enforce_immutable_id!(post, payload, current_ids)

          if @force_package
            candidates << candidate(post, payload, @force_package, entry)
            next
          end

          if entry.nil? && post.post_date < @ledger.activated_at && !@backfill
            skipped << skip(post, "historical_requires_backfill")
            next
          end

          if @backfill
            if entry
              skipped << skip(post, "tracked_post_not_backfilled")
              alerts << alert(post, "backfill_already_tracked", "Backfill is limited to untracked historical posts")
              next
            end
            forced_delivery = { "web" => true, "email" => false }
            payload = force_delivery(payload, forced_delivery)
            candidates << candidate(post, payload, "backfill", entry, delivery: forced_delivery)
            next
          end

          if entry && CONFLICT_STATES.include?(entry["state"])
            alerts << alert(post, "blocked_ledger_state", "Ledger state '#{entry['state']}' requires reconciliation")
            next
          end


          if entry && entry["state"] == "drafted" && entry["payload_hash"] == payload.fetch("payload_hash")
            candidates << candidate(post, payload, "resume_release", entry)
            next
          end

          if entry && entry["payload_hash"] == payload.fetch("payload_hash")
            skipped << skip(post, "unchanged")
            if entry["source_path"] && entry["source_path"] != post.relative_path
              alerts << alert(post, "source_path_changed", "Source path changed; the immutable ID prevented duplication")
            end
            next
          end

          operation = if entry.nil?
                        "first_publication"
                      elsif EMAIL_TERMINAL_STATES.include?(entry.dig("email", "request_status"))
                        "post_email_correction"
                      elsif entry["state"] == "drafted"
                        "draft_update"
                      else
                        "web_correction"
                      end
          if operation == "post_email_correction" &&
             (entry.dig("web", "published") != true || Util.blank?(entry.dig("remote", "post_id")))
            raise BridgeError.new(
              "email_only_correction_requires_manual",
              "An emailed post without an existing web post cannot be corrected automatically",
              path: post.relative_path
            )
          end
          effective_delivery = if %w[post_email_correction web_correction].include?(operation)
                                 { "web" => true, "email" => false }
                               else
                                 payload.fetch("delivery")
                               end
          candidates << candidate(post, payload, operation, entry, delivery: effective_delivery)
        end

        if @source_id && candidates.empty? && skipped.none? { |item| item["id"] == @source_id } &&
           alerts.none? { |item| item["id"] == @source_id }
          raise BridgeError.new("unknown_source_id", "No eligible opted-in post has ID '#{@source_id}'")
        end

        @ledger.entries.each do |id, entry|
          next if current_ids.include?(id) || entry["state"] == "retired"

          alerts << {
            "id" => id,
            "path" => entry["source_path"],
            "code" => "source_disabled_or_deleted",
            "message" => "Ledger entry has no eligible source; remote deletion is never automatic"
          }
        end

        { "candidates" => candidates, "skipped" => skipped, "alerts" => alerts }
      end

      private

      def apply_slug_lock(payload, post)
        entry = @ledger[post.id]
        return payload unless entry && !Util.blank?(entry["slug"])
        if payload["slug"] && payload["slug"] != entry["slug"]
          raise BridgeError.new("locked_slug_changed", "Published slug is immutable", path: post.relative_path)
        end

        value = Util.deep_stringify(payload)
        value["slug"] = entry["slug"]
        Util.add_payload_hash(value)
      end

      def enforce_immutable_id!(post, payload, current_ids)
        conflict = @ledger.entries.find do |id, entry|
          id != post.id && Array(entry["source_paths"] || entry["source_path"]).include?(post.relative_path)
        end
        if conflict
          raise BridgeError.new(
            "immutable_id_changed",
            "Source path was previously recorded as '#{conflict.first}'",
            path: post.relative_path
          )
        end

        # A path and ID changed together cannot use the path alone as a recovery
        # key. Compare stable content/canonical identity against orphaned entries
        # and require manual disposition instead of risking a duplicate send.
        ambiguous = @ledger.entries.find do |id, entry|
          id != post.id && !current_ids.include?(id) && entry["state"] != "retired" &&
            ((!Util.blank?(entry["canonical_url"]) && entry["canonical_url"] == payload["canonical_url"]) ||
             (!Util.blank?(entry["content_hash"]) && entry["content_hash"] == payload["content_hash"]))
        end
        return unless ambiguous

        raise BridgeError.new(
          "ambiguous_source_identity",
          "Post may be a renamed source previously recorded as '#{ambiguous.first}'; reconcile or retire that entry first",
          path: post.relative_path
        )
      end

      def force_delivery(payload, delivery)
        value = Util.deep_stringify(payload)
        value["delivery"] = delivery
        value["publish_at"] = nil if @backfill
        Util.add_payload_hash(value)
      end

      def candidate(post, payload, operation, entry, delivery: nil)
        {
          "id" => post.id,
          "title" => payload.fetch("title"),
          "source_path" => post.relative_path,
          "source_sha" => @source_sha,
          "operation" => operation,
          "prior_payload_hash" => entry && entry["payload_hash"],
          "payload_hash" => payload.fetch("payload_hash"),
          "changed_fields" => changed_fields(entry, payload),
          "audience" => payload.fetch("audience"),
          "publish_at" => payload["publish_at"],
          "slug" => payload["slug"],
          "effective_delivery" => delivery || payload.fetch("delivery"),
          "payload" => payload
        }
      end

      def skip(post, reason)
        { "id" => post.id, "path" => post.relative_path, "reason" => reason }
      end

      def changed_fields(entry, payload)
        return ["new"] unless entry
        prior = entry["field_hashes"]
        return ["unknown_prior_payload"] unless prior.is_a?(Hash)

        current = Util.field_hashes(payload)
        (prior.keys | current.keys).select { |key| prior[key] != current[key] }.sort
      end

      def alert(post, code, message)
        { "id" => post.id, "path" => post.relative_path, "code" => code, "message" => message }
      end
    end

    class PackageBuilder
      PACKAGE_MARKER = "PACKAGE-MARKER"

      def initialize(root:, output:, ledger:, source_sha:, publication_url: nil, repository: nil,
                     now: -> { Time.now }, backfill: false, source_id: nil, force_package: nil,
                     validate_remote_assets: false, remote_validator: RemoteAssetValidator.new,
                     canonical_validator: nil)
        @root = File.expand_path(root)
        @output = File.expand_path(output)
        @ledger = ledger
        @source_sha = source_sha
        @publication_url = if Util.blank?(publication_url)
                             @ledger.publication_url
                           else
                             Util.normalized_https_origin(publication_url)
                           end
        if !Util.blank?(@ledger.publication_url) && @publication_url != Util.normalized_https_origin(@ledger.publication_url)
          raise BridgeError.new("publication_mismatch", "Prepared publication does not match the durable ledger")
        end
        @repository = repository
        @now = now
        @backfill = backfill
        @source_id = source_id
        @force_package = force_package
        @validate_remote_assets = validate_remote_assets
        @remote_validator = remote_validator
        @canonical_validator = canonical_validator || RemoteAssetValidator.new(expected_content_prefix: "text/html")
      end

      def build
        validate_output_path!
        scanner = Scanner.new(root: @root, now: @now)
        scan = scanner.scan
        raise_batch!(scan.errors) unless scan.errors.empty?

        renderer = Renderer.new(root: @root, site_url: scanner.site_url)
        rendered = []
        render_errors = []
        scan.posts.each do |post|
          begin
            rendered << RenderedPost.new(post: post, payload: renderer.render(post))
          rescue BridgeError => error
            render_errors << error.to_h
          end
        end
        raise_batch!(render_errors) unless render_errors.empty?

        planner = Planner.new(
          ledger: @ledger,
          source_sha: @source_sha,
          backfill: @backfill,
          source_id: @source_id,
          force_package: @force_package
        )
        plan = planner.plan(rendered)
        validate_assets!(plan.fetch("candidates")) if @validate_remote_assets
        write_package(scan, plan)
      end

      private

      def validate_output_path!
        broad = [File::SEPARATOR, File.expand_path(Dir.home), @root]
        if broad.include?(@output) || @root.start_with?("#{@output}#{File::SEPARATOR}")
          raise BridgeError.new("unsafe_output_path", "Prepared package output cannot be a broad or repository path", path: @output)
        end
        if File.symlink?(@output)
          raise BridgeError.new("unsafe_output_path", "Prepared package output cannot be a symlink", path: @output)
        end
        parent = File.dirname(@output)
        FileUtils.mkdir_p(parent)
        resolved = if File.exist?(@output)
                     File.realpath(@output)
                   else
                     File.join(File.realpath(parent), File.basename(@output))
                   end
        if broad.include?(resolved) || File.realpath(@root).start_with?("#{resolved}#{File::SEPARATOR}")
          raise BridgeError.new("unsafe_output_path", "Resolved package output is a broad or repository path", path: @output)
        end
        return unless File.exist?(@output)
        unless File.directory?(@output) && File.file?(File.join(@output, PACKAGE_MARKER))
          raise BridgeError.new(
            "unsafe_output_path",
            "Existing output is not a recognized generated Substack package",
            path: @output
          )
        end
      end

      def raise_batch!(errors)
        raise BridgeError.new(
          "validation_failed",
          "Substack preparation failed with #{errors.length} validation error(s)",
          details: { "errors" => errors }
        )
      end

      def validate_assets!(candidates)
        urls = candidates.flat_map { |candidate| candidate.dig("payload", "assets").map { |asset| asset["url"] } }
        @remote_validator.validate!(urls)
        @canonical_validator.validate!(candidates.map { |candidate| candidate.dig("payload", "canonical_url") })
      end

      def write_package(scan, plan)
        parent = File.dirname(@output)
        FileUtils.mkdir_p(parent)
        temporary = Dir.mktmpdir(".substack-package-", parent)
        File.write(File.join(temporary, PACKAGE_MARKER), "TedT.org Substack package schema #{SCHEMA_VERSION}\n")

        candidates = plan.fetch("candidates")
        manifest_candidates = candidates.map do |candidate|
          directory = File.join(temporary, "posts", candidate.fetch("id"))
          FileUtils.mkdir_p(directory)
          write_json(File.join(directory, "payload.json"), candidate.fetch("payload"))
          write_json(File.join(directory, "assets.json"), candidate.dig("payload", "assets"))
          File.write(File.join(directory, "article.html"), "#{candidate.dig('payload', 'content_html')}\n")
          File.write(File.join(directory, "preview.html"), self.class.preview_document(candidate))

          candidate.reject { |key, _| key == "payload" }
        end

        validation = {
          "schema_version" => SCHEMA_VERSION,
          "valid" => true,
          "errors" => [],
          "warnings" => scan.warnings,
          "excluded" => scan.excluded,
          "alerts" => plan.fetch("alerts"),
          "skipped" => plan.fetch("skipped")
        }
        manifest = {
          "schema_version" => SCHEMA_VERSION,
          "repository" => @repository,
          "source_sha" => @source_sha,
          "prepared_at" => @now.call.iso8601,
          "publication_url" => @publication_url,
          "backfill" => @backfill,
          "ledger_sha256" => Util.digest(@ledger.data),
          "candidate_count" => manifest_candidates.length,
          "candidates" => manifest_candidates
        }
        write_json(File.join(temporary, "manifest.json"), manifest)
        write_json(File.join(temporary, "validation-report.json"), validation)
        File.write(File.join(temporary, "summary.md"), summary(manifest, validation))
        write_checksums(temporary)

        FileUtils.remove_entry_secure(@output) if File.exist?(@output)
        File.rename(temporary, @output)
        manifest
      rescue StandardError
        FileUtils.remove_entry_secure(temporary) if temporary && File.exist?(temporary)
        raise
      end

      def self.preview_document(candidate)
        payload = candidate.fetch("payload")
        hero = payload["hero"]
        hero_html = if hero
                      title = hero["title"] ? %( title="#{CGI.escapeHTML(hero['title'].to_s)}") : ""
                      %(<figure><img src="#{CGI.escapeHTML(hero.fetch('url'))}" alt="#{CGI.escapeHTML(hero.fetch('alt'))}"#{title}></figure>)
                    else
                      ""
                    end
        <<~HTML
          <!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>#{CGI.escapeHTML(payload.fetch("title"))}</title>
          </head>
          <body>
            <article>
              <h1>#{CGI.escapeHTML(payload.fetch("title"))}</h1>
              #{payload["subtitle"] ? "<p><strong>#{CGI.escapeHTML(payload['subtitle'])}</strong></p>" : ""}
              #{hero_html}
              #{payload.fetch("content_html")}
            </article>
          </body>
          </html>
        HTML
      end

      def summary(manifest, validation)
        rows = manifest.fetch("candidates").map do |candidate|
          delivery = candidate.fetch("effective_delivery")
          schedule = candidate["publish_at"] || "after approval"
          changes = Array(candidate["changed_fields"]).join(", ")
          "| #{Util.markdown_escape(candidate['id'])} | #{Util.markdown_escape(candidate['operation'])} | #{Util.markdown_escape(candidate['audience'])} | " \
            "#{Util.markdown_escape(changes)} | #{Util.markdown_escape(candidate['payload_hash'])} | #{delivery['web']} | #{delivery['email']} | " \
            "#{Util.markdown_escape(schedule)} |"
        end
        rows << "| _none_ | no-op | — | — | — | — | — | — |" if rows.empty?
        warning_lines = report_lines(validation.fetch("warnings"), "warning")
        alert_lines = report_lines(validation.fetch("alerts"), "alert")

        <<~MARKDOWN
          ## TedT.org → Substack preparation

          - Source SHA: `#{Util.markdown_escape(manifest['source_sha'])}`
          - Publication: `#{Util.markdown_escape(manifest['publication_url'] || 'not configured; artifact only')}`
          - Ledger snapshot: `#{Util.markdown_escape(manifest['ledger_sha256'])}`
          - Candidates: **#{manifest['candidate_count']}**
          - Validation warnings: **#{validation.fetch('warnings').length}**
          - Manual-disposition alerts: **#{validation.fetch('alerts').length}**
          - Adapter status: **artifact-only until an official write contract passes its canary**

          | Source ID | Operation | Audience | Changed fields | Payload hash | Web | Email | Schedule |
          |---|---|---|---|---|---:|---:|---|
          #{rows.join("\n")}

          ### Validation warnings

          #{warning_lines}

          ### Manual-disposition alerts

          #{alert_lines}

          `web published`, `email request accepted`, and actual email delivery are separate states.
        MARKDOWN
      end

      def report_lines(items, label)
        return "- None." if items.empty?

        items.map do |item|
          code = Util.markdown_escape(item["code"] || label)
          path = Util.markdown_escape(item["path"] || item["id"] || "repository")
          message = Util.markdown_escape(item["message"] || item["reason"] || "Review required")
          "- `#{code}` at `#{path}`: #{message}"
        end.join("\n")
      end

      def write_json(path, value)
        File.write(path, "#{JSON.pretty_generate(Util.deep_sort(value))}\n")
      end

      def write_checksums(directory)
        entries = []
        Find.find(directory) do |path|
          next if File.directory?(path)
          relative = Pathname.new(path).relative_path_from(Pathname.new(directory)).to_s
          next if relative == "checksums.sha256"

          entries << [relative, Digest::SHA256.file(path).hexdigest]
        end
        content = entries.sort.map { |relative, digest| "#{digest}  #{relative}" }.join("\n")
        File.write(File.join(directory, "checksums.sha256"), "#{content}\n")
      end
    end

    class PackageReader
      attr_reader :root, :manifest

      def initialize(root)
        @root = File.expand_path(root)
        raise BridgeError.new("missing_package", "Prepared package directory does not exist", path: root) unless File.directory?(@root)
        unless File.file?(File.join(@root, PackageBuilder::PACKAGE_MARKER))
          raise BridgeError.new("missing_package_marker", "Prepared package marker is missing", path: root)
        end

        verify_no_symlinks!
        verify_checksums!
        @manifest = read_json("manifest.json")
        unless manifest["schema_version"] == SCHEMA_VERSION
          raise BridgeError.new("unsupported_package_version", "Unsupported package schema version")
        end
        candidates = manifest["candidates"]
        unless candidates.is_a?(Array) && manifest["candidate_count"] == candidates.length
          raise BridgeError.new("malformed_package", "Manifest candidate count is inconsistent")
        end
        ids = candidates.map { |candidate| candidate["id"] }
        if ids.any? { |id| !id.is_a?(String) || !ID_PATTERN.match?(id) } || ids.uniq.length != ids.length
          raise BridgeError.new("malformed_package", "Manifest contains invalid or duplicate candidate IDs")
        end
        unless manifest["source_sha"].is_a?(String) && !manifest["source_sha"].empty? &&
               /\A[0-9a-f]{64}\z/.match?(manifest["ledger_sha256"].to_s)
          raise BridgeError.new("malformed_package", "Manifest source or ledger identity is invalid")
        end
        validation = read_json("validation-report.json")
        unless validation["schema_version"] == SCHEMA_VERSION && validation["valid"] == true &&
               validation["errors"].is_a?(Array) && validation["errors"].empty?
          raise BridgeError.new("invalid_package_validation", "Prepared package did not pass validation")
        end
      end

      def verify_context!(ledger:, publication_url:)
        expected_ledger = Util.digest(ledger.data)
        unless manifest["ledger_sha256"] == expected_ledger
          raise BridgeError.new("stale_ledger", "Prepared package no longer matches the durable ledger snapshot")
        end
        configured = Util.normalized_https_origin(publication_url)
        packaged = Util.normalized_https_origin(manifest["publication_url"])
        unless packaged == configured
          raise BridgeError.new("publication_mismatch", "Prepared package targets a different Substack publication")
        end
        ledger.verify_publication_url!(configured, allow_unbound_empty: true)
        true
      end

      def candidate(source_id)
        metadata = manifest.fetch("candidates").find { |value| value["id"] == source_id }
        raise BridgeError.new("unknown_source_id", "Package has no candidate '#{source_id}'") unless metadata

        payload = read_json(File.join("posts", source_id, "payload.json"))
        unless payload["payload_hash"] == metadata["payload_hash"] &&
               Util.add_payload_hash(payload)["payload_hash"] == payload["payload_hash"]
          raise BridgeError.new("payload_hash_mismatch", "Prepared payload hash does not match manifest", path: source_id)
        end
        expected_content_hash = Util.content_hash(payload)
        unless payload["content_hash"] == expected_content_hash
          raise BridgeError.new("payload_hash_mismatch", "Prepared content hash is invalid", path: source_id)
        end
        metadata_checks = {
          "id" => payload["source_id"],
          "payload_hash" => payload["payload_hash"],
          "audience" => payload["audience"],
          "publish_at" => payload["publish_at"],
          "slug" => payload["slug"]
        }
        metadata_checks.each do |key, expected|
          unless metadata[key] == expected
            raise BridgeError.new("package_metadata_mismatch", "Manifest #{key} does not match the transport payload", path: source_id)
          end
        end
        unless metadata["source_sha"] == manifest["source_sha"] &&
               metadata["effective_delivery"].is_a?(Hash) &&
               metadata["effective_delivery"].keys.sort == %w[email web] &&
               metadata["effective_delivery"].values.all? { |value| value == true || value == false } &&
               metadata["effective_delivery"].values.any?
          raise BridgeError.new("package_metadata_mismatch", "Manifest candidate identity or delivery is inconsistent", path: source_id)
        end
        allowed_operations = %w[
          first_publication
          resume_release
          draft_update
          web_correction
          post_email_correction
          backfill
          reconcile
          record_manual
        ]
        unless allowed_operations.include?(metadata["operation"])
          raise BridgeError.new("package_metadata_mismatch", "Manifest candidate operation is unsupported", path: source_id)
        end
        expected_delivery = if %w[web_correction post_email_correction].include?(metadata["operation"])
                              { "web" => true, "email" => false }
                            else
                              payload["delivery"]
                            end
        unless metadata["effective_delivery"] == expected_delivery
          raise BridgeError.new("package_metadata_mismatch", "Manifest effective delivery is inconsistent", path: source_id)
        end

        assets = read_json(File.join("posts", source_id, "assets.json"))
        article = File.read(File.join(root, "posts", source_id, "article.html"), mode: "r:bom|utf-8")
        preview = File.read(File.join(root, "posts", source_id, "preview.html"), mode: "r:bom|utf-8")
        unless assets == payload["assets"] && article == "#{payload['content_html']}\n"
          raise BridgeError.new("package_metadata_mismatch", "Article or asset artifact does not match payload", path: source_id)
        end
        complete = metadata.merge("payload" => payload)
        unless preview == PackageBuilder.preview_document(complete)
          raise BridgeError.new("package_metadata_mismatch", "Rendered preview does not match payload", path: source_id)
        end
        complete
      end

      private

      def verify_no_symlinks!
        Find.find(root) do |path|
          raise BridgeError.new("unsafe_package_symlink", "Prepared package contains a symlink", path: path) if File.symlink?(path)
        end
      end

      def verify_checksums!
        path = File.join(root, "checksums.sha256")
        raise BridgeError.new("missing_checksums", "Prepared package has no checksums") unless File.file?(path)

        seen = {}
        File.readlines(path, chomp: true).reject(&:empty?).each do |line|
          digest, relative = line.split(/\s+/, 2)
          relative = relative.to_s.strip
          unless /\A[0-9a-f]{64}\z/.match?(digest.to_s)
            raise BridgeError.new("malformed_checksums", "Checksum line has an invalid SHA-256 digest")
          end
          safe = Util.safe_relative_path(relative)
          raise BridgeError.new("duplicate_checksum", "Checksum path is repeated", path: safe) if seen.key?(safe)

          seen[safe] = digest
          target = File.join(root, safe)
          unless File.file?(target) && Digest::SHA256.file(target).hexdigest == digest
            raise BridgeError.new("checksum_mismatch", "Prepared artifact checksum failed", path: relative)
          end
        end

        actual = []
        Find.find(root) do |target|
          next if File.directory?(target)
          relative = Pathname.new(target).relative_path_from(Pathname.new(root)).to_s
          actual << relative unless relative == "checksums.sha256"
        end
        unless seen.keys.sort == actual.sort
          raise BridgeError.new("incomplete_checksums", "Checksums do not cover exactly the package files")
        end
      end

      def read_json(relative)
        safe = Util.safe_relative_path(relative)
        JSON.parse(File.read(File.join(root, safe), mode: "r:bom|utf-8"))
      rescue JSON::ParserError => error
        raise BridgeError.new("malformed_package", error.message, path: relative)
      end
    end
  end
end
