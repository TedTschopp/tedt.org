#!/usr/bin/env ruby
# Export Jekyll's actual public documents before redirect generators replace content.
require 'jekyll'
require 'json'
require 'nokogiri'
require 'optparse'
require 'time'
require 'uri'

options = { root: File.expand_path('..', __dir__) }
OptionParser.new do |parser|
  parser.on('--root PATH') { |value| options[:root] = File.expand_path(value) }
end.parse!

site = Jekyll::Site.new(Jekyll.configuration('source' => options[:root], 'quiet' => true))
site.reset
site.read
origin = site.config.fetch('url').sub(%r{/+$}, '')
markdown = site.find_converter_instance(Jekyll::Converters::Markdown)
excluded = %w[_posts/policy/ _posts/homepage/]

def public_url(value, origin)
  url = value.to_s.start_with?('https://') ? value.to_s : "#{origin}/#{value.to_s.sub(%r{\A/+}, '')}"
  parsed = URI.parse(URI::DEFAULT_PARSER.escape(url))
  raise "Invalid publication URL: #{url}" unless parsed.scheme == 'https' && parsed.host && !parsed.userinfo
  url
end

legacy_review = site.data.fetch('mastodon_legacy_review', {})
raise 'Unsupported legacy-review version' unless legacy_review.empty? || legacy_review['version'] == 1
legacy_aliases = Hash.new { |hash, key| hash[key] = [] }
legacy_review.fetch('records', {}).each do |legacy_url, record|
  next unless record.fetch('disposition') == 'mapped'
  legacy_aliases[public_url(record.fetch('canonical_url'), origin)] << public_url(legacy_url, origin)
end

items = site.posts.docs.filter_map do |post|
  next if excluded.any? { |prefix| post.relative_path.downcase.start_with?(prefix) }
  next if post.data['published'] == false

  old_url = public_url(post.url, origin)
  target = post.data['redirect_to']
  if post.relative_path.downcase.start_with?('_posts/prompts/') && !target
    raise "#{post.relative_path}: relocated prompt needs an explicit redirect_to"
  end
  canonical = target ? public_url(target, origin) : old_url
  if target && URI.parse(canonical).host != 'ai.tedt.org'
    next # Other redirects are utility pages, not additional publications.
  end
  published = post.data['web_published_at'] || post.date
  published = Time.parse(published.to_s).utc.iso8601
  summary = post.data['summary'] || post.data['SEO-description'] || post.data['excerpt'] || post.excerpt.to_s
  summary = summary.to_s.gsub(/\{%.*?%\}|\{\{.*?\}\}/m, '')
  fragment = Nokogiri::HTML.fragment(markdown.convert(summary))
  fragment.css('script, style').remove
  summary = fragment.text.gsub(/\s+/, ' ').strip
  title = post.data.fetch('title').to_s.gsub(/\s+/, ' ').strip
  budget = 480 - canonical.length - title.length - 3
  raise "#{post.relative_path}: title and canonical URL exceed 480 characters" if budget.negative?
  summary = "#{summary[0, budget - 1].rstrip}…" if summary.length > budget && budget.positive?
  summary = '' if budget.zero?
  content = [title, summary, canonical].reject(&:empty?).join("\n")
  aliases = [old_url, canonical] + legacy_aliases[canonical]
  Array(post.data['redirect_from']).each { |value| aliases << public_url(value, origin) }
  # Import only; exact Jekyll URLs above remain authoritative for output.
  filename = File.basename(post.relative_path, File.extname(post.relative_path))
  slug = filename.sub(/\A\d{4}-\d{2}-\d{2}-/, '')
  ["/#{filename}/", "/#{filename}.md", "/#{slug}/"].each do |legacy|
    aliases << public_url(legacy, origin)
  end
  {
    'source_path' => post.relative_path,
    'canonical_url' => canonical,
    'aliases' => aliases.uniq,
    'published_at' => published,
    'title' => title,
    'content_text' => content,
    'mastodon_post_id' => post.data['mastodon-post-id']&.to_s,
    'mastodon_post_url' => post.data['mastodon-post-url']
  }
end

puts JSON.pretty_generate(
  'version' => 1,
  'instance' => "https://#{site.config.fetch('mastodon_comments').fetch('host')}",
  'username' => site.config.fetch('mastodon_comments').fetch('username'),
  'items' => items.sort_by { |item| [item.fetch('published_at'), item.fetch('canonical_url'), item.fetch('source_path')] }
)
