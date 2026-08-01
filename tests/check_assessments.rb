#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "nokogiri"
require "pathname"
require "time"
require "yaml"

ROOT = Pathname.new(__dir__).parent.expand_path
SITE_DIR = Pathname.new(ARGV[0] || ENV.fetch("JEKYLL_DESTINATION", ROOT.join("_site").to_s)).expand_path
DATA_PATH = ROOT.join("_data", "assessments.yml")
LANDING_PATH = ROOT.join("assessments", "index.html")
SITE_ORIGIN = "https://tedt.org"
FRONT_MATTER = /\A---[ \t]*\n(?<yaml>.*?)\n---[ \t]*\n/m

REQUIRED_KEYS = %w[
  slug order title eyebrow version stage kind description permalink image image_alt
  image_width image_height scope privacy measures published_at modified_at
].freeze
MEASURE_KEYS = %w[value label].freeze
VALID_STAGES = %w[alpha beta stable].freeze

errors = []

def blank?(value)
  value.nil? || value.to_s.strip.empty?
end

def rel(path)
  path.relative_path_from(ROOT).to_s
rescue ArgumentError
  path.to_s
end

def add_error(errors, message)
  errors << message
end

def read_file(path, errors)
  unless path.file?
    add_error(errors, "missing #{rel(path)}")
    return nil
  end

  path.binread
rescue SystemCallError => e
  add_error(errors, "cannot read #{rel(path)}: #{e.message}")
  nil
end

def yaml_duplicate_keys(path, errors)
  stream = Psych.parse_stream(path.read)
  visit = lambda do |node, location|
    case node
    when Psych::Nodes::Mapping
      seen = {}
      node.children.each_slice(2) do |key, value|
        key_name = key.respond_to?(:value) ? key.value.to_s : "<complex key>"
        if seen.key?(key_name)
          add_error(errors, "#{rel(path)} has duplicate key #{key_name.inspect} at #{location}")
        end
        seen[key_name] = true
        visit.call(value, "#{location}.#{key_name}")
      end
    when Psych::Nodes::Sequence
      node.children.each_with_index { |child, index| visit.call(child, "#{location}[#{index}]") }
    else
      Array(node.children).each { |child| visit.call(child, location) } if node.respond_to?(:children)
    end
  end
  visit.call(stream, "root")
rescue Psych::Exception => e
  add_error(errors, "#{rel(path)} has invalid YAML: #{e.message}")
end

def safe_yaml(text, label, errors)
  YAML.safe_load(text, permitted_classes: [], permitted_symbols: [], aliases: false)
rescue Psych::Exception => e
  add_error(errors, "#{label} has invalid YAML: #{e.message}")
  nil
end

def split_front_matter(path, errors)
  source = read_file(path, errors)
  return [nil, nil] unless source

  source = source.force_encoding(Encoding::UTF_8)
  match = FRONT_MATTER.match(source)
  unless match
    add_error(errors, "#{rel(path)} must begin with closed YAML front matter")
    return [nil, nil]
  end

  metadata = safe_yaml(match[:yaml], rel(path), errors)
  unless metadata.is_a?(Hash)
    add_error(errors, "#{rel(path)} front matter must be a mapping")
    metadata = nil
  end
  [metadata, match.post_match]
end

def parse_time(value, label, errors)
  return add_error(errors, "#{label} must be a quoted ISO 8601 timestamp") if blank?(value)

  Time.iso8601(value.to_s)
rescue ArgumentError
  add_error(errors, "#{label} must be a valid ISO 8601 timestamp")
  nil
end

def png_dimensions(path, errors)
  bytes = read_file(path, errors)
  return nil unless bytes

  unless bytes.bytesize >= 24 && bytes.start_with?("\x89PNG\r\n\x1A\n".b) && bytes.byteslice(12, 4) == "IHDR"
    add_error(errors, "#{rel(path)} must be a PNG with a valid IHDR chunk")
    return nil
  end

  bytes.byteslice(16, 8).unpack("NN")
end

def html_document(source, label, errors)
  document = Nokogiri::HTML5.parse(source, max_errors: 100)
  document.errors.each do |error|
    add_error(errors, "#{label} has an HTML parse error: #{error.message.lines.first.to_s.strip}")
  end
  document
rescue Nokogiri::XML::SyntaxError, ArgumentError => e
  add_error(errors, "#{label} is not parseable HTML: #{e.message.lines.first.to_s.strip}")
  Nokogiri::HTML5.parse(source)
end

def attribute_content(document, selector)
  document.at_css(selector)&.[]("content")&.strip
end

def validate_html(document, source, record, label, errors)
  canonical_url = "#{SITE_ORIGIN}#{record.fetch("permalink")}"
  social_image_url = "#{SITE_ORIGIN}#{record.fetch("image")}"

  add_error(errors, "#{label} must begin with an HTML doctype") unless source.match?(/\A<!doctype html>/i)
  add_error(errors, "#{label} must set html[lang]") if blank?(document.at_css("html")&.[]("lang"))
  add_error(errors, "#{label} must contain exactly one h1") unless document.css("h1").length == 1

  title = document.at_css("title")&.text&.strip
  add_error(errors, "#{label} title must include #{record.fetch("title").inspect}") unless title&.include?(record.fetch("title"))
  add_error(errors, "#{label} description does not match the catalog") unless attribute_content(document, 'meta[name="description"]') == record.fetch("description")
  add_error(errors, "#{label} canonical URL is wrong") unless document.at_css('link[rel="canonical"]')&.[]("href") == canonical_url
  add_error(errors, "#{label} Open Graph URL is wrong") unless attribute_content(document, 'meta[property="og:url"]') == canonical_url
  add_error(errors, "#{label} X URL is wrong") unless attribute_content(document, 'meta[name="twitter:url"]') == canonical_url

  {
    'meta[property="og:image"]' => social_image_url,
    'meta[name="twitter:image"]' => social_image_url,
    'meta[property="og:image:alt"]' => record.fetch("image_alt"),
    'meta[name="twitter:image:alt"]' => record.fetch("image_alt"),
    'meta[property="og:image:width"]' => record.fetch("image_width").to_s,
    'meta[property="og:image:height"]' => record.fetch("image_height").to_s,
    'meta[name="twitter:image:width"]' => record.fetch("image_width").to_s,
    'meta[name="twitter:image:height"]' => record.fetch("image_height").to_s
  }.each do |selector, expected|
    actual = attribute_content(document, selector)
    add_error(errors, "#{label} #{selector} must be #{expected.inspect}") unless actual == expected
  end
  unless attribute_content(document, 'meta[name="twitter:card"]') == "summary_large_image"
    add_error(errors, "#{label} must request a large X social card")
  end

  viewport = attribute_content(document, 'meta[name="viewport"]')
  add_error(errors, "#{label} must include a responsive viewport") if blank?(viewport)
  if viewport&.match?(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0)?(?:\D|\z)/i)
    add_error(errors, "#{label} must not disable browser zoom")
  end

  skip_link = document.at_css('a.skip-link[href^="#"]')
  if skip_link
    target_id = skip_link["href"].delete_prefix("#")
    target_exists = document.xpath('//*[@id]').any? { |node| node["id"] == target_id }
    add_error(errors, "#{label} skip link target ##{target_id} is missing") unless target_exists
  else
    add_error(errors, "#{label} must include a visible-on-focus skip link")
  end

  document.css("[tabindex]").each do |node|
    value = Integer(node["tabindex"], exception: false)
    add_error(errors, "#{label} contains positive tabindex=#{value}") if value&.positive?
  end
  add_error(errors, "#{label} must not use canvas for essential content") if document.at_css("canvas")

  document.css("script[src]").each do |node|
    add_error(errors, "#{label} has external script dependency #{node["src"]}") if node["src"].match?(%r{\Ahttps?://}i)
  end
  document.css('link[rel~="stylesheet"][href]').each do |node|
    add_error(errors, "#{label} has external stylesheet dependency #{node["href"]}") if node["href"].match?(%r{\Ahttps?://}i)
  end

  add_error(errors, "#{label} contains the retired Tools route") if source.include?("/tools/ai-coding-maturity-assessment/")
  add_error(errors, "#{label} must persist resumable work locally") unless source.include?("localStorage")
  unless source.match?(/responses stay in this browser/i) && source.match?(/does not send (?:it|responses?) to a server/i)
    add_error(errors, "#{label} must state its browser-only response handling")
  end

  graphs = []
  document.css('script[type="application/ld+json"]').each do |script|
    value = JSON.parse(script.text)
    graphs.concat(value.is_a?(Hash) && value["@graph"].is_a?(Array) ? value["@graph"] : [value])
  rescue JSON::ParserError => e
    add_error(errors, "#{label} has invalid JSON-LD: #{e.message}")
  end

  find_type = lambda do |type|
    graphs.find { |node| node.is_a?(Hash) && Array(node["@type"]).include?(type) }
  end
  person = find_type.call("Person")
  website = find_type.call("WebSite")
  webpage = find_type.call("WebPage")
  application = find_type.call("WebApplication")
  breadcrumb = find_type.call("BreadcrumbList")

  add_error(errors, "#{label} JSON-LD must identify Ted Tschopp") unless person&.[]("@id") == "#{SITE_ORIGIN}/#person"
  add_error(errors, "#{label} JSON-LD must identify the TedT.org website") unless website&.[]("@id") == "#{SITE_ORIGIN}/#website"
  add_error(errors, "#{label} WebPage JSON-LD has the wrong URL") unless webpage&.[]("url") == canonical_url
  add_error(errors, "#{label} WebApplication JSON-LD has the wrong URL") unless application&.[]("url") == canonical_url
  add_error(errors, "#{label} WebApplication JSON-LD has the wrong version") unless application&.[]("softwareVersion").to_s == record.fetch("version")

  expected_breadcrumbs = [
    [1, "Home", "#{SITE_ORIGIN}/"],
    [2, "Assessments", "#{SITE_ORIGIN}/assessments/"],
    [3, record.fetch("title"), canonical_url]
  ]
  actual_breadcrumbs = Array(breadcrumb&.[]("itemListElement")).map do |item|
    [item["position"], item["name"], item["item"]]
  end
  add_error(errors, "#{label} JSON-LD breadcrumb must be Home, Assessments, then the assessment") unless actual_breadcrumbs == expected_breadcrumbs
end

unless DATA_PATH.file?
  add_error(errors, "missing #{rel(DATA_PATH)}")
end

records = []
if DATA_PATH.file?
  yaml_duplicate_keys(DATA_PATH, errors)
  parsed = safe_yaml(DATA_PATH.read, rel(DATA_PATH), errors)
  if parsed.is_a?(Array) && !parsed.empty?
    records = parsed
  else
    add_error(errors, "#{rel(DATA_PATH)} must be a nonempty top-level array")
  end
end

seen = Hash.new { |hash, key| hash[key] = {} }
records.each_with_index do |record, index|
  label = "#{rel(DATA_PATH)} record #{index + 1}"
  unless record.is_a?(Hash)
    add_error(errors, "#{label} must be a mapping")
    next
  end

  missing = REQUIRED_KEYS.reject { |key| record.key?(key) && !blank?(record[key]) }
  unknown = record.keys.map(&:to_s) - REQUIRED_KEYS
  add_error(errors, "#{label} is missing #{missing.join(', ')}") unless missing.empty?
  add_error(errors, "#{label} has unknown keys #{unknown.join(', ')}") unless unknown.empty?
  next unless missing.empty?

  slug = record.fetch("slug").to_s
  add_error(errors, "#{label} has invalid slug #{slug.inspect}") unless slug.match?(/\A[a-z0-9][a-z0-9-]*\z/)

  order = record.fetch("order")
  add_error(errors, "#{label} order must be a positive integer") unless order.is_a?(Integer) && order.positive?
  add_error(errors, "#{label} version must look like 1.0") unless record.fetch("version").is_a?(String) && record.fetch("version").match?(/\A\d+\.\d+(?:\.\d+)?\z/)
  add_error(errors, "#{label} stage must be one of #{VALID_STAGES.join(', ')}") unless VALID_STAGES.include?(record.fetch("stage"))

  description_length = record.fetch("description").to_s.length
  add_error(errors, "#{label} description must be 70–170 characters (found #{description_length})") unless (70..170).cover?(description_length)
  alt_length = record.fetch("image_alt").to_s.length
  add_error(errors, "#{label} image_alt must be 50–240 characters (found #{alt_length})") unless (50..240).cover?(alt_length)
  %w[scope privacy].each do |key|
    length = record.fetch(key).to_s.length
    add_error(errors, "#{label} #{key} must be 40–220 characters (found #{length})") unless (40..220).cover?(length)
  end

  expected_permalink = "/assessments/#{slug}/"
  permalink = record.fetch("permalink").to_s
  add_error(errors, "#{label} permalink must be #{expected_permalink.inspect}") unless permalink == expected_permalink

  expected_image = "#{expected_permalink}#{slug}-social.png"
  image = record.fetch("image").to_s
  add_error(errors, "#{label} image must be #{expected_image.inspect}") unless image == expected_image
  dimensions = png_dimensions(ROOT.join(image.delete_prefix("/")), errors)
  declared_dimensions = [record.fetch("image_width"), record.fetch("image_height")]
  add_error(errors, "#{label} social image must declare 1200x630") unless declared_dimensions == [1200, 630]
  add_error(errors, "#{label} social image dimensions do not match its PNG") if dimensions && dimensions != declared_dimensions

  measures = record.fetch("measures")
  if !measures.is_a?(Array) || !(1..6).cover?(measures.length)
    add_error(errors, "#{label} measures must contain one to six entries")
  else
    labels = []
    measures.each_with_index do |measure, measure_index|
      measure_label = "#{label} measure #{measure_index + 1}"
      unless measure.is_a?(Hash) && measure.keys.map(&:to_s).sort == MEASURE_KEYS.sort
        add_error(errors, "#{measure_label} must contain only value and label")
        next
      end
      add_error(errors, "#{measure_label} value must be a nonblank string") unless measure["value"].is_a?(String) && !blank?(measure["value"])
      add_error(errors, "#{measure_label} label must be a nonblank string") unless measure["label"].is_a?(String) && !blank?(measure["label"])
      labels << measure["label"].to_s.downcase
    end
    add_error(errors, "#{label} measure labels must be unique") unless labels.uniq.length == labels.length
  end

  published_at = parse_time(record.fetch("published_at"), "#{label} published_at", errors)
  modified_at = parse_time(record.fetch("modified_at"), "#{label} modified_at", errors)
  add_error(errors, "#{label} modified_at must not precede published_at") if published_at && modified_at && modified_at < published_at

  { "slug" => slug, "permalink" => permalink, "order" => order, "title" => record.fetch("title") }.each do |field, value|
    if seen[field].key?(value)
      add_error(errors, "#{label} duplicates #{field} #{value.inspect} from record #{seen[field][value]}")
    else
      seen[field][value] = index + 1
    end
  end

  child_path = ROOT.join("assessments", slug, "index.html")
  front, child_source = split_front_matter(child_path, errors)
  if front && child_source
    unless front.key?("layout") && front["layout"].nil?
      add_error(errors, "#{rel(child_path)} must set layout: null")
    end
    add_error(errors, "#{rel(child_path)} permalink must match the catalog") unless front["permalink"] == permalink
    add_error(errors, "#{rel(child_path)} web_published_at must match the catalog") unless front["web_published_at"] == record.fetch("published_at")
    add_error(errors, "#{rel(child_path)} web_modified_at must match the catalog") unless front["web_modified_at"] == record.fetch("modified_at")
    validate_html(html_document(child_source, rel(child_path), errors), child_source, record, rel(child_path), errors)
  end
end

landing_front, landing_source = split_front_matter(LANDING_PATH, errors)
if landing_front && landing_source
  add_error(errors, "#{rel(LANDING_PATH)} must set layout: page") unless landing_front["layout"] == "page"
  add_error(errors, "#{rel(LANDING_PATH)} must use /assessments/") unless landing_front["permalink"] == "/assessments/"
  add_error(errors, "#{rel(LANDING_PATH)} must render site.data.assessments") unless landing_source.include?("site.data.assessments")
  add_error(errors, "#{rel(LANDING_PATH)} must render assessment cards") unless landing_source.include?("assessments-library-card")
end

scss_path = ROOT.join("_sass", "_overrides-assessments.scss")
add_error(errors, "missing #{rel(scss_path)}") unless scss_path.file?
bootstrap_path = ROOT.join("css", "bootstrap-build.scss")
if bootstrap_path.file?
  add_error(errors, "#{rel(bootstrap_path)} must import overrides-assessments") unless bootstrap_path.read.include?('@import "overrides-assessments"')
else
  add_error(errors, "missing #{rel(bootstrap_path)}")
end

nav_path = ROOT.join("_includes", "layout", "top-nav-bar.html")
if nav_path.file?
  add_error(errors, "#{rel(nav_path)} must link to the first-class Assessments section") unless nav_path.read.include?("/assessments/")
else
  add_error(errors, "missing #{rel(nav_path)}")
end

unless SITE_DIR.directory?
  add_error(errors, "built site directory is missing: #{SITE_DIR}")
else
  built_landing_path = SITE_DIR.join("assessments", "index.html")
  built_landing = read_file(built_landing_path, errors)&.force_encoding(Encoding::UTF_8)
  if built_landing
    document = html_document(built_landing, rel(built_landing_path), errors)
    add_error(errors, "built Assessments landing must contain exactly one h1") unless document.css("h1").length == 1
    cards = document.css("article.assessments-library-card")
    add_error(errors, "built Assessments landing has #{cards.length} cards for #{records.length} catalog records") unless cards.length == records.length
    records.each do |record|
      count = document.css('a[href]').count { |node| node["href"] == record["permalink"] }
      add_error(errors, "built Assessments landing must link once to #{record["permalink"]} (found #{count})") unless count == 1
    end
  end

  records.each do |record|
    slug = record["slug"]
    source_path = ROOT.join("assessments", slug, "index.html")
    _front, expected_child = split_front_matter(source_path, errors)
    built_child_path = SITE_DIR.join("assessments", slug, "index.html")
    built_child = read_file(built_child_path, errors)&.force_encoding(Encoding::UTF_8)
    if built_child && expected_child
      add_error(errors, "#{rel(built_child_path)} differs from the layout-null source body") unless built_child == expected_child
      validate_html(html_document(built_child, rel(built_child_path), errors), built_child, record, rel(built_child_path), errors)
    end

    built_image_path = SITE_DIR.join(record["image"].delete_prefix("/"))
    dimensions = png_dimensions(built_image_path, errors)
    add_error(errors, "#{rel(built_image_path)} must be 1200x630") if dimensions && dimensions != [1200, 630]
  end

  sitemap_path = SITE_DIR.join("sitemap.xml")
  sitemap_source = read_file(sitemap_path, errors)
  if sitemap_source
    begin
      sitemap = Nokogiri::XML(sitemap_source) { |config| config.strict }
      locations = sitemap.xpath('//*[local-name()="loc"]').map { |node| node.text.strip }
      ["#{SITE_ORIGIN}/assessments/", *records.map { |record| "#{SITE_ORIGIN}#{record["permalink"]}" }].each do |url|
        count = locations.count(url)
        add_error(errors, "sitemap must contain #{url} exactly once (found #{count})") unless count == 1
      end
    rescue Nokogiri::XML::SyntaxError => e
      add_error(errors, "#{rel(sitemap_path)} is invalid XML: #{e.message.lines.first.to_s.strip}")
    end
  end
end

if errors.empty?
  puts "Assessment check passed: #{records.length} catalog #{records.length == 1 ? 'entry' : 'entries'}, source apps, social images, navigation, styles, rendered pages, and sitemap."
else
  warn "Assessment check failed with #{errors.length} #{errors.length == 1 ? 'error' : 'errors'}:"
  errors.each { |message| warn "  - #{message}" }
  exit 1
end
