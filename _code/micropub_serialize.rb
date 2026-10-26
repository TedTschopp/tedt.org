#!/usr/bin/env ruby
# frozen_string_literal: true
require 'json'
require 'cgi'
require 'time'
require 'date'
require 'yaml'
require 'jekyll'
require 'nokogiri'
require_relative 'indieweb'

module MicropubPublication
  OWNER = 'https://tedt.org/'
  TAGS = %w[a abbr address audio b blockquote br caption code col colgroup dd del details div dl dt em figcaption figure h2 h3 h4 h5 h6 hr i img li ol p pre s small source span strong sub summary sup table tbody td th thead time tr track u ul video].freeze
  DISCARD = %w[script style iframe object embed svg math template form input link meta base button textarea select noscript].freeze
  ATTRIBUTES = { 'a' => %w[href title], 'abbr' => %w[title], 'img' => %w[src alt width height], 'audio' => %w[src], 'video' => %w[src poster width height], 'source' => %w[src type], 'td' => %w[colspan rowspan], 'th' => %w[colspan rowspan scope], 'time' => %w[datetime], 'track' => %w[src kind srclang label default] }.freeze

  def self.url(value)
    value = String(value)
    raise ArgumentError, 'Invalid public URL' if value.match?(/[\x00-\x20\x7f\\]/)
    parsed = URI(value)
    raise ArgumentError, 'Invalid public URL' unless %w[http https].include?(parsed.scheme) && parsed.host && !parsed.userinfo && parsed.port == (parsed.scheme == 'https' ? 443 : 80)
    value
  end

  def self.clean_html(value)
    doc = Nokogiri::HTML5.fragment(String(value))
    doc.css(DISCARD.join(',')).remove
    doc.xpath('.//comment()').remove
    doc.css('h1').each { |node| node.name = 'h2' }
    doc.traverse do |node|
      next unless node.element?
      unless TAGS.include?(node.name)
        node.replace(node.children)
        next
      end
      allowed = ATTRIBUTES.fetch(node.name, [])
      node.attribute_nodes.each do |attribute|
        key = attribute.name
        if !allowed.include?(key)
          attribute.remove
        elsif %w[href src poster].include?(key)
          begin
            if key == 'href' && attribute.value.match?(/\Amailto:[\w.+%-]+@[\w.-]+\.[A-Za-z]+\z/)
              next
            end
            url(attribute.value)
          rescue ArgumentError, URI::Error
            attribute.remove
          end
        elsif %w[width height colspan rowspan].include?(key) && !attribute.value.match?(/\A[1-9]\d{0,3}\z/)
          attribute.remove
        end
      end
      node['rel'] = 'noopener noreferrer' if node.name == 'a' && node['href']
      node['alt'] ||= 'Photo' if node.name == 'img'
      if %w[audio video].include?(node.name)
        node['controls'] = 'controls'
        node['preload'] = 'metadata'
      end
    end
    # Jekyll expands Liquid before Markdown, including text inside HTML elements.
    # Entities retain literal braces for readers without evaluating authoring text.
    doc.to_html.gsub('{', '&#123;').gsub('}', '&#125;')
  end

  def self.content(properties)
    value = properties.fetch('content', ['']).first
    return clean_html(value.fetch('html')) if value.is_a?(Hash) && value.key?('html')
    value = value.fetch('text') if value.is_a?(Hash)
    escaped = CGI.escapeHTML(String(value)).gsub('{', '&#123;').gsub('}', '&#125;')
    converter = Jekyll::Converters::Markdown.new(Jekyll.configuration('quiet' => true))
    clean_html(converter.convert(escaped))
  end

  def self.path(record)
    raise ArgumentError, 'Invalid managed entry ID' unless record.fetch('id').match?(/\A[0-9a-f-]{36}\z/)
    created = Time.iso8601(record.fetch('created')).utc.iso8601
    expected = %r{\Ahttps://tedt\.org/updates/#{created[0, 10].tr('-', '/')}/[a-z0-9-]+/\z}
    raise ArgumentError, 'Invalid managed entry URL' unless record.fetch('url').match?(expected)
    "_posts/Micropub/#{created[0, 10]}-#{record.fetch('id')}.md"
  end

  def self.render(record, existing: nil)
    target = path(record)
    previous = {}
    if existing && File.file?(existing)
      raw = File.read(existing)
      match = raw.match(/\A---\s*\n(.*?)\n---\s*\n/m)
      raise ArgumentError, 'Invalid managed source front matter' unless match
      previous = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false)
      raise ArgumentError, 'Unrelated source at managed path' unless previous.is_a?(Hash) && previous.dig('micropub', 'id') == record.fetch('id')
    end
    return { 'path' => target, 'content' => nil, 'media' => [] } unless record.fetch('publish')
    properties = record.fetch('properties')
    raise ArgumentError, 'A draft or private entry cannot enter the public repository' if properties.fetch('post-status', ['published']).first != 'published' || properties.fetch('visibility', ['public']).first != 'public'
    raise ArgumentError, 'Unsupported entry type' unless %w[h-entry h-event].include?(record.fetch('type'))
    body = content(properties)
    plain = Nokogiri::HTML5.fragment(body).text.gsub(/\s+/, ' ').strip
    place = properties.fetch('checkin', []).first
    place_name = place.is_a?(Hash) ? place.dig('properties', 'name', 0) : nil
    title = properties.dig('name', 0) || (place_name && "Checked into #{place_name}") || (plain.empty? ? nil : plain[0, 100])
    title ||= %w[photo audio video like-of repost-of bookmark-of in-reply-to].find { |key| properties[key]&.any? }&.tr('-', ' ')&.capitalize
    title ||= 'Update'
    published = Time.iso8601(properties.fetch('published').first).iso8601
    front = {
      'layout' => 'micropubpost', 'title' => title, 'description' => (properties.dig('summary', 0) || plain[0, 240] || title),
      'date' => published, 'web_published_at' => published, 'last_modified' => (properties.dig('updated', 0) || published),
      'permalink' => URI(record.fetch('url')).path, 'categories' => properties.fetch('category', ['Updates']),
      'author' => 'tschopp', 'authors' => ['tschopp'],
      'micropub' => { 'id' => record.fetch('id'), 'type' => record.fetch('type'), 'revision' => record.fetch('revision') },
      # Explicit selection is consumed by the existing Mastodon eligibility adapter.
      'mastodon-syndicate' => properties.fetch('mp-syndicate-to', []).include?('https://tschopp.net/@Ted')
    }
    %w[mastodon-post-id mastodon-post-url redirect_from].each { |key| front[key] = previous[key] if previous.key?(key) }
    properties.each do |key, values|
      next if %w[content post-status visibility mp-slug mp-syndicate-to published updated category].include?(key)
      front["mf-#{key}"] = values
    end
    doc = Nokogiri::HTML5.fragment(body)
    media = %w[photo audio video].flat_map do |key|
      properties.fetch(key, []).map { |v| v.is_a?(Hash) ? v.fetch('value') : v }
    end
    media.concat(doc.css('img[src],audio[src],video[src],video[poster],source[src],track[src]').flat_map { |node| [node['src'], node['poster']].compact })
    media.concat(doc.css('a[href]').filter_map { |node| value = node['href']; value if value.start_with?('https://media.tedt.org/files/') })
    media.each { |value| url(value) }
    { 'path' => target, 'content' => "#{YAML.dump(front)}---\n<div markdown=\"0\" class=\"micropub-body\">\n#{body}\n</div>\n", 'media' => media.uniq }
  end

  def self.check_media(urls, http: IndieWeb::HTTP.new)
    urls.each do |value|
      response = http.request(url(value), method: 'HEAD')
      raise IndieWeb::Error, 'Referenced media is not yet available' unless (200..299).cover?(response.status)
    end
  end
end

if $PROGRAM_NAME == __FILE__
  begin
    record = JSON.parse(STDIN.read(131073))
    existing_index = ARGV.index('--existing-file')
    result = MicropubPublication.render(record, existing: existing_index ? ARGV.fetch(existing_index + 1) : nil)
    if ARGV.include?('--check-media')
      begin
        MicropubPublication.check_media(result.fetch('media'))
      rescue IndieWeb::Error
        STDERR.puts 'Micropub publication waits for referenced media to become available.'
        exit 75
      end
    end
    puts JSON.generate(result)
  rescue JSON::ParserError, KeyError, ArgumentError, URI::Error, Psych::Exception
    STDERR.puts 'Invalid Micropub publication payload; nothing was written.'
    exit 1
  end
end
