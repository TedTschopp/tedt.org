#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'nokogiri'
require 'pathname'
require 'rexml/document'
require 'uri'
require 'yaml'

REPO_ROOT = Pathname.new(__dir__).parent
SITE_ROOT = Pathname.new(ARGV[0] || ENV['JEKYLL_DESTINATION'] || REPO_ROOT.join('_site').to_s)
PERSON_ID = 'https://tedt.org/#person'

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

def graph_for(path)
  document = Nokogiri::HTML(path.read)
  scripts = document.css('script[type="application/ld+json"]')
  fail_with("Expected one JSON-LD script in #{path}; found #{scripts.length}.") unless scripts.length == 1

  payload = JSON.parse(scripts.first.text)
  graph = payload['@graph']
  fail_with("JSON-LD does not contain an @graph in #{path}.") unless graph.is_a?(Array)

  [document, graph]
rescue JSON::ParserError => e
  fail_with("Invalid JSON-LD in #{path}: #{e.message}")
end

def node_with_type(graph, type)
  graph.find do |node|
    types = node['@type'].is_a?(Array) ? node['@type'] : [node['@type']]
    types.include?(type)
  end
end

def reference_id(value)
  value.is_a?(Hash) ? value['@id'] : nil
end

def rendered_file_for(location)
  path = URI::DEFAULT_PARSER.unescape(URI.parse(location).path)
  relative = path.sub(%r{\A/}, '')
  candidates = if path.end_with?('/')
                 [SITE_ROOT.join(relative, 'index.html')]
               else
                 [SITE_ROOT.join(relative), SITE_ROOT.join("#{relative}.html"), SITE_ROOT.join(relative, 'index.html')]
               end
  candidates.find(&:file?)
rescue URI::InvalidURIError
  nil
end

def reference_ids(value, found = [])
  case value
  when Array
    value.each { |item| reference_ids(item, found) }
  when Hash
    found << value['@id'] if value.keys == ['@id']
    value.each_value { |item| reference_ids(item, found) }
  end
  found
end

fail_with("Missing generated site: #{SITE_ROOT}. Run `bundle exec jekyll build` first.") unless SITE_ROOT.directory?

profile_path = SITE_ROOT.join('profile/index.html')
fail_with('Missing rendered /profile/ page.') unless profile_path.file?

_profile_document, profile_graph = graph_for(profile_path)
person = node_with_type(profile_graph, 'Person')
profile_page = node_with_type(profile_graph, 'ProfilePage')
website = node_with_type(profile_graph, 'WebSite')

fail_with('Profile graph is missing its Person node.') unless person
fail_with('Profile graph is missing its ProfilePage node.') unless profile_page
fail_with('Profile graph is missing its WebSite node.') unless website
fail_with("Person node has the wrong @id: #{person['@id'].inspect}") unless person['@id'] == PERSON_ID
fail_with('ProfilePage does not identify the Person as mainEntity.') unless reference_id(profile_page['mainEntity']) == PERSON_ID
fail_with('WebSite does not identify the Person as publisher.') unless reference_id(website['publisher']) == PERSON_ID

same_as = person['sameAs']
unless same_as.is_a?(Array) && same_as.length >= 3 &&
       same_as.any? { |url| url.include?('linkedin.com/in/tedtschopp') } &&
       same_as.any? { |url| url.include?('github.com/TedTschopp') }
  fail_with('Person sameAs must contain multiple stable identity profiles, including LinkedIn and GitHub.')
end
same_as.each do |url|
  uri = URI.parse(url)
  fail_with("Person sameAs is not an absolute HTTPS URL: #{url.inspect}") unless uri.is_a?(URI::HTTPS) && uri.host
rescue URI::InvalidURIError
  fail_with("Person sameAs is not a valid URL: #{url.inspect}")
end

knows_about = person['knowsAbout']
unless knows_about.is_a?(Array) && knows_about.length >= 5 &&
       knows_about.include?('Enterprise architecture') &&
       knows_about.include?('Enterprise artificial intelligence')
  fail_with('Person knowsAbout does not reflect the profile expertise section.')
end

works_for = person['worksFor']
unless works_for.is_a?(Hash) && works_for['@type'] == 'Organization' &&
       works_for['name'] == 'Southern California Edison' && works_for['url'].to_s.start_with?('https://')
  fail_with('Person worksFor is missing a named Organization with an HTTPS URL.')
end

# Check graph integrity for every discoverable page, not just role-aware
# editorial examples. This catches disconnected identities and duplicate nodes.
sitemap_path = SITE_ROOT.join('sitemap.xml')
fail_with('Missing rendered sitemap.') unless sitemap_path.file?
sitemap = REXML::Document.new(sitemap_path.read)
locations = REXML::XPath.match(sitemap, '//*[local-name()="loc"]').map(&:text).compact
fail_with('Rendered sitemap contains no URLs.') if locations.empty?
quality_config = YAML.safe_load(REPO_ROOT.join('tests/config/seo_quality.yml').read, aliases: false) || {}
allowed_missing_graph = Array(quality_config['allowed_missing_structured_data']).to_h { |path| [path, false] }

locations.each do |location|
  path = rendered_file_for(location)
  fail_with("Missing rendered sitemap page: #{location}") unless path
  scripts = Nokogiri::HTML(path.read).css('script[type="application/ld+json"]')
  if scripts.empty? && allowed_missing_graph.key?(URI.parse(location).path)
    allowed_missing_graph[URI.parse(location).path] = true
    next
  end
  _document, graph = graph_for(path)
  ids = graph.filter_map { |node| node['@id'].to_s.strip unless node['@id'].to_s.strip.empty? }
  duplicates = ids.tally.select { |_id, count| count > 1 }.keys
  fail_with("Duplicate JSON-LD @id values in #{path}: #{duplicates.join(', ')}") unless duplicates.empty?

  graph_person = node_with_type(graph, 'Person')
  graph_website = node_with_type(graph, 'WebSite')
  fail_with("Graph is missing stable Person in #{path}") unless graph_person&.[]('@id') == PERSON_ID
  fail_with("Graph is missing stable WebSite in #{path}") unless graph_website&.[]('@id') == 'https://tedt.org/#website'
  fail_with("WebSite publisher is disconnected in #{path}") unless reference_id(graph_website['publisher']) == PERSON_ID

  unless location == 'https://tedt.org/'
    primary = graph.find do |node|
      node_id = node['@id'].to_s
      node_id == "#{location}#webpage" || node_id == "#{location}#article"
    end
    fail_with("Graph has no canonical primary entity in #{path}") unless primary
    fail_with("Primary entity URL is not canonical in #{path}") unless primary['url'] == location
    fail_with("Primary entity is disconnected from WebSite in #{path}") unless reference_id(primary['isPartOf']) == 'https://tedt.org/#website'

    breadcrumb = node_with_type(graph, 'BreadcrumbList')
    fail_with("Graph has no BreadcrumbList in #{path}") unless breadcrumb
    fail_with("Primary entity does not reference its breadcrumb in #{path}") unless reference_id(primary['breadcrumb']) == breadcrumb['@id']
  end

  reference_ids(graph).uniq.each do |id|
    next unless id.to_s.start_with?('https://tedt.org/') && id.to_s.include?('#')
    fail_with("Unresolved internal JSON-LD reference #{id.inspect} in #{path}") unless ids.include?(id)
  end
end

unused_graph_allowlist = allowed_missing_graph.select { |_path, used| !used }.keys
fail_with("Remove stale allowed_missing_structured_data entries: #{unused_graph_allowlist.join(', ')}") unless unused_graph_allowlist.empty?

quote_count = 0
reprint_count = 0

SITE_ROOT.glob('**/*.html').select(&:file?).each do |path|
  html = path.read
  is_quote = html.include?('quote-source-author')
  is_reprint = html.include?('content-credit-source-author')
  next unless is_quote || is_reprint

  document, graph = graph_for(path)
  article = node_with_type(graph, 'BlogPosting')
  fail_with("Role-aware page lacks BlogPosting schema: #{path}") unless article
  fail_with("Role-aware page does not identify Ted as editor: #{path}") unless reference_id(article['editor']) == PERSON_ID

  if is_quote
    quote_count += 1
    authors = article['author']
    unless authors.is_a?(Array) && authors.length == 1 && reference_id(authors.first) == PERSON_ID
      fail_with("Quote BlogPosting must identify Ted as the webpage author: #{path}")
    end

    quotation = article['mainEntity']
    unless quotation.is_a?(Hash) && quotation['@type'] == 'Quotation' && !quotation['text'].to_s.strip.empty?
      fail_with("Quote BlogPosting must contain a nonblank Quotation mainEntity: #{path}")
    end
    creators = quotation['creator']
    creator_names = Array(creators).filter_map { |creator| creator['name'].to_s.strip unless creator['name'].to_s.strip.empty? }
    visible_name = document.at_css('.quote-source-author cite')&.text.to_s.strip
    unless !visible_name.empty? && creator_names.include?(visible_name)
      fail_with("Quotation creator does not match the visible quoted person #{visible_name.inspect}: #{path}")
    end

    visible_source = document.css('header p').find { |paragraph| paragraph.text.to_s.strip.start_with?('Source:') }
    if visible_source
      citation = article['citation']
      visible_source_name = visible_source.text.to_s.sub(/\ASource:\s*/, '').strip
      visible_source_url = visible_source.at_css('a[href]')&.[]('href').to_s.strip
      unless citation.is_a?(Hash) && citation['@type'] == 'CreativeWork' &&
             citation['name'].to_s.strip == visible_source_name
        fail_with("Quote citation does not match visible source #{visible_source_name.inspect}: #{path}")
      end
      if !visible_source_url.empty? && citation['url'].to_s.strip != visible_source_url
        fail_with("Quote citation URL does not match visible source URL #{visible_source_url.inspect}: #{path}")
      end
    end
  end

  if is_reprint
    reprint_count += 1
    authors = article['author']
    if !authors.is_a?(Array) || authors.empty? || authors.any? { |author| reference_id(author) == PERSON_ID }
      fail_with("Reprint must retain source author(s), separately from Ted's editor role: #{path}")
    end

    source_work = article['isBasedOn']
    unless source_work.is_a?(Hash) && source_work['@type'] == 'CreativeWork' &&
           source_work['author'].is_a?(Array) && source_work['author'].length == authors.length
      fail_with("Reprint must describe its source CreativeWork and source author(s): #{path}")
    end
  end
end

fail_with('No rendered quote pages were checked.') if quote_count.zero?
fail_with('No rendered reprint pages were checked.') if reprint_count.zero?

puts "Structured data graph and roles OK (#{locations.length} sitemap pages; " \
     "#{quote_count} quote pages; #{reprint_count} reprint pages)"
