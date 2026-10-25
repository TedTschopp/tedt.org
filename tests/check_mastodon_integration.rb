#!/usr/bin/env ruby
require 'date'
require 'jekyll'
require 'json'
require 'nokogiri'
require 'open3'
require 'pathname'
require 'uri'

root = Pathname.new(__dir__).parent
site = Jekyll::Site.new(Jekyll.configuration('source' => root.to_s, 'quiet' => true))
site.reset
site.read
errors = []
prompts = site.posts.docs.select { |post| post.relative_path.downcase.start_with?('_posts/prompts/') }
redirects_path = root.join('_site/redirects.json')
abort 'Build Jekyll first: missing _site/redirects.json' unless redirects_path.file?
redirects = JSON.parse(redirects_path.read)

prompts.each do |post|
  target = post.data['redirect_to']
  unless target.is_a?(String) && target.start_with?('https://ai.tedt.org/')
    errors << "#{post.relative_path}: missing explicit AI Library redirect_to"
    next
  end
  output = root.join('_site', post.url.sub(%r{\A/}, ''))
  output = output.join('index.html') if post.url.end_with?('/')
  unless output.file?
    errors << "Missing legacy prompt output: #{post.url}"
    next
  end
  html = Nokogiri::HTML(output.read)
  errors << "#{post.url}: plugin did not record the redirect" unless redirects[post.url] == target
  errors << "#{post.url}: canonical destination mismatch" unless html.at_css('link[rel="canonical"]')&.[]('href') == target
  errors << "#{post.url}: refresh destination mismatch" unless html.at_css('meta[http-equiv="refresh"]')&.[]('content') == "0; url=#{target}"
  errors << "#{post.url}: accessible fallback is missing" unless html.at_css('main h1') && html.css('main a').any? { |link| link['href'] == target && !link.text.strip.empty? }
end

merged = {
  '/prompts/ai-simulation-creator-roleplay-prompt/' => '/prompts/ai-simulation-creator/',
  '/prompts/building-block/' => '/prompts/abb-sbb-ubb-builder/',
  '/prompts/product-requirements-document-prd-template-2/' => '/prompts/product-requirements-document-prd-template/',
  '/prompts/product-requirements-document-prd-template-3/' => '/prompts/product-requirements-document-prd-template/',
  '/prompts/product-requirements-document-prd-template-4/' => '/prompts/product-requirements-document-prd-template/',
  '/prompts/script-a-podcast/' => '/skills/generating-podcast-script/',
  '/prompts/teds-writing-style/' => '/skills/ted-writing-style/'
}
merged.each do |source, target|
  errors << "#{source}: merged alias must forward directly to its final destination" unless redirects[source] == "https://ai.tedt.org#{target}"
end

output, stderr, status = Open3.capture3('bundle', 'exec', 'ruby', '-W0', root.join('_code/mastodon_manifest.rb').to_s, chdir: root.to_s)
abort "Manifest export failed: #{stderr}" unless status.success?
manifest = JSON.parse(output)
expected = site.posts.docs.reject { |post| post.relative_path.downcase.match?(%r{\A_posts/(policy|homepage)/}) }
actual = manifest.fetch('items').map { |item| item.fetch('source_path') }
errors << 'Manifest does not cover the complete eligible Jekyll archive' unless actual.sort == expected.map(&:relative_path).sort
manifest.fetch('items').each do |item|
  errors << "#{item['source_path']}: status exceeds 480 characters" if item.fetch('content_text').length > 480
  mid = item['mastodon_post_id']
  errors << "#{item['source_path']}: Mastodon ID must be a string" if mid && !mid.is_a?(String)
  if item.fetch('source_path').downcase.start_with?('_posts/prompts/')
    errors << "#{item['source_path']}: publisher is using a legacy prompt URL" unless item.fetch('canonical_url').start_with?('https://ai.tedt.org/')
  end
end

review = site.data.fetch('mastodon_legacy_review', {})
legacy = JSON.parse(root.join('cache/jsonfeed-to-mastodon.json').read)
review.fetch('records', {}).each do |old_url, record|
  errors << "#{old_url}: unknown review disposition" unless %w[mapped retired ambiguous].include?(record['disposition'])
  errors << "#{old_url}: reviewed key is not in the preserved legacy cache" unless legacy.key?(old_url)
  expected_url = old_url.start_with?('https://') ? old_url : "#{site.config.fetch('url')}#{old_url}"
  if record['disposition'] == 'mapped'
    matches = manifest.fetch('items').select { |item| item['canonical_url'] == record.fetch('canonical_url') }
    errors << "#{old_url}: mapped canonical is not an eligible document" if matches.empty?
    errors << "#{old_url}: reviewed source does not match the canonical document" unless matches.any? { |item| item['source_path'] == record.fetch('source_path') }
    errors << "#{old_url}: reviewed alias was not exported" unless matches.any? { |item| item['aliases'].include?(expected_url) }
  elsif record['disposition'] == 'retired'
    errors << "#{old_url}: a retired publication was reintroduced" if manifest.fetch('items').any? { |item| item['canonical_url'] == expected_url }
  end
end
archive_target = 'https://tedt.org/TheOneRing-LegacyArchive/'
errors << 'The live archive status still links to a missing landing page' unless redirects['/TheOneRing-com-Legacy-Archive/'] == archive_target

profile_id = site.config.dig('profile', 'social', 'mastodon_user_id')
errors << 'Profile account ID must remain an exact string' unless profile_id.is_a?(String) && profile_id.match?(/\A\d+\z/)
progress = JSON.parse(root.join('_site/mastodon-backfill-progress.json').read)
if root.join('_data/mastodon_status.json').file?
  saved = JSON.parse(root.join('_data/mastodon_status.json').read)
  errors << 'Progress endpoint is not reporting the verified run' unless progress == saved
end

errors << 'Durable ledger must be excluded from the public build' if root.join('_site/cache/mastodon-ledger.json').exist?
if errors.empty?
  puts "Mastodon integration: PASS (#{prompts.length} plugin redirects; #{actual.length} eligible source documents)."
else
  warn errors.join("\n")
  abort 'Mastodon integration: FAIL'
end
