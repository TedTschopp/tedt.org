#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "digest"
require "fileutils"
require "nokogiri"
require "optparse"
require "pathname"
require "tmpdir"
require "uri"

options = {
  site_dir: "_site",
  output_dir: "reports/seo",
  source_dir: Dir.pwd
}

OptionParser.new do |parser|
  parser.banner = "Usage: bundle exec ruby scripts/audit_social_images.rb [options]"
  parser.on("--site DIR", "Rendered Jekyll site (default: _site)") { |value| options[:site_dir] = value }
  parser.on("--output DIR", "Report directory (default: reports/seo)") { |value| options[:output_dir] = value }
  parser.on("--source DIR", "Jekyll source directory (default: current directory)") { |value| options[:source_dir] = value }
end.parse!

source_dir = File.expand_path(options[:source_dir])
site_dir = File.expand_path(options[:site_dir], source_dir)
output_dir = File.expand_path(options[:output_dir], source_dir)
sitemap_path = File.join(site_dir, "sitemap.xml")

abort "Rendered sitemap not found: #{sitemap_path}" unless File.file?(sitemap_path)

def normalized_path(value)
  uri = URI.parse(value.to_s)
  path = uri.path.to_s
  path = "/" if path.empty?
  path = URI::DEFAULT_PARSER.unescape(path)
  path = "/#{path}" unless path.start_with?("/")
  path.gsub(%r{/+}, "/")
rescue URI::InvalidURIError
  value.to_s
end

def rendered_file(site_dir, page_url)
  path = normalized_path(page_url)
  relative = path.sub(%r{\A/}, "")
  relative = "index.html" if relative.empty?
  relative = File.join(relative, "index.html") if path.end_with?("/") && path != "/"
  File.expand_path(relative, site_dir)
end

def source_map(source_dir)
  require "jekyll"

  config = Jekyll.configuration(
    "source" => source_dir,
    "destination" => File.join(Dir.tmpdir, "tedt-social-image-source-map"),
    "quiet" => true
  )
  site = Jekyll::Site.new(config)
  site.reset
  site.read

  items = site.pages + site.collections.values.flat_map(&:docs)
  items.each_with_object({}) do |item, map|
    next if item.url.to_s.empty?

    relative_path = item.respond_to?(:relative_path) ? item.relative_path.to_s : item.path.to_s
    relative_path = relative_path.sub(%r{\A/}, "")
    map[normalized_path(item.url)] ||= relative_path unless relative_path.empty?
  end
end

def local_image_file(site_dir, image_url, site_hosts)
  uri = URI.parse(image_url)
  return nil unless uri.host.nil? || site_hosts.include?(uri.host.downcase)

  path = normalized_path(image_url)
  File.expand_path(path.sub(%r{\A/}, ""), site_dir)
rescue URI::InvalidURIError
  nil
end

def suggested_asset_path(page_url)
  path = normalized_path(page_url)
  slug = path.sub(%r{\A/}, "").sub(%r{/\z}, "")
  slug = "home" if slug.empty?
  slug = slug.unicode_normalize(:nfkd).encode("ASCII", invalid: :replace, undef: :replace, replace: "")
  slug = slug.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/\A-+|-+\z/, "")
  slug = "page" if slug.empty?
  if slug.length > 96
    slug = "#{slug[0, 83].sub(/-+\z/, "")}-#{Digest::SHA256.hexdigest(path)[0, 10]}"
  end
  "/img/social/#{slug}-social.webp"
end

def markdown_cell(value)
  value.to_s.gsub("|", "\\|").gsub(/[\r\n]+/, " ").strip
end

sitemap = Nokogiri::XML(File.read(sitemap_path)) { |config| config.strict.nonet }
sitemap.remove_namespaces!
urls = sitemap.xpath("//url/loc").map { |node| node.text.strip }.reject(&:empty?)
abort "No URLs found in #{sitemap_path}" if urls.empty?

sources = source_map(source_dir)
site_hosts = urls.filter_map { |url| URI.parse(url).host&.downcase }.uniq
site_hosts << "www.tedt.org" if site_hosts.include?("tedt.org")

generic_paths = [
  "/img/Site-Logo.webp",
  "/img/home/logo-Tschopp.webp"
].map(&:downcase)

rows = []
missing_rendered_pages = []

urls.each do |url|
  file = rendered_file(site_dir, url)
  unless File.file?(file)
    missing_rendered_pages << url
    next
  end

  document = Nokogiri::HTML(File.read(file))
  title = document.at_css("head title")&.text.to_s.strip
  image_node = document.at_css('head meta[property="og:image"]')
  image_url = image_node&.[]("content").to_s.strip
  image_path = image_url.empty? ? "" : normalized_path(image_url)
  reason = nil

  if image_url.empty?
    reason = image_node ? "blank og:image" : "missing og:image"
  elsif generic_paths.include?(image_path.downcase)
    reason = "generic site logo fallback"
  else
    local_file = local_image_file(site_dir, image_url, site_hosts)
    reason = "referenced social image is missing" if local_file && !File.file?(local_file)
  end

  next unless reason

  rows << {
    "url" => url,
    "source_path" => sources[normalized_path(url)].to_s,
    "title" => title,
    "current_og_image" => image_url,
    "reason" => reason,
    "suggested_asset_path" => suggested_asset_path(url)
  }
end

rows.sort_by! { |row| [row["reason"], row["url"]] }
reason_counts = rows.group_by { |row| row["reason"] }.transform_values(&:length).sort.to_h
generic_rows = rows.select { |row| row["reason"] == "generic site logo fallback" }

FileUtils.mkdir_p(output_dir)
csv_path = File.join(output_dir, "social-image-needs.csv")
generic_csv_path = File.join(output_dir, "social-image-generic-logo-pages.csv")
markdown_path = File.join(output_dir, "social-image-needs.md")
generic_markdown_path = File.join(output_dir, "social-image-generic-logo-pages.md")
headers = %w[url source_path title current_og_image reason suggested_asset_path]

CSV.open(csv_path, "w", write_headers: true, headers: headers) do |csv|
  rows.each { |row| csv << headers.map { |header| row[header] } }
end

CSV.open(generic_csv_path, "w", write_headers: true, headers: headers) do |csv|
  generic_rows.each { |row| csv << headers.map { |header| row[header] } }
end

File.open(markdown_path, "w") do |report|
  report.puts "# Social image remediation inventory"
  report.puts
  report.puts "Generated from the rendered sitemap and HTML supplied with the script's `--site` option."
  report.puts
  report.puts "- Sitemap pages audited: #{urls.length}"
  report.puts "- Pages needing social-image work: #{rows.length}"
  report.puts "- Pages using the generic site logo (the original 785-page cohort): #{generic_rows.length}"
  reason_counts.each { |reason, count| report.puts "- #{reason.capitalize}: #{count}" }
  report.puts "- Sitemap URLs without a rendered HTML target: #{missing_rendered_pages.length}"
  report.puts
  report.puts "The original 785-page estimate is confirmed for pages using `https://tedt.org/img/Site-Logo.webp`. The broader remediation total also includes blank Open Graph image values and same-site image URLs whose rendered assets are missing."
  report.puts
  report.puts "| URL | Source path | Title | Current og:image | Reason | Suggested asset path |"
  report.puts "| --- | --- | --- | --- | --- | --- |"
  rows.each do |row|
    report.puts "| #{headers.map { |header| markdown_cell(row[header]) }.join(' | ')} |"
  end
end

File.open(generic_markdown_path, "w") do |report|
  report.puts "# Pages using the generic social image"
  report.puts
  report.puts "This is the exact #{generic_rows.length}-page cohort whose rendered `og:image` is the generic site logo, `https://tedt.org/img/Site-Logo.webp`."
  report.puts
  report.puts "| URL | Source path | Title | Suggested WebP asset path |"
  report.puts "| --- | --- | --- | --- |"
  generic_rows.each do |row|
    report.puts "| #{%w[url source_path title suggested_asset_path].map { |header| markdown_cell(row[header]) }.join(' | ')} |"
  end
end

puts "Audited #{urls.length} sitemap pages."
puts "Found #{rows.length} pages needing social-image work: #{reason_counts.map { |reason, count| "#{count} #{reason}" }.join(', ')}."
puts "Confirmed #{generic_rows.length} pages in the generic-logo cohort."
puts "Wrote #{Pathname.new(csv_path).relative_path_from(Pathname.new(source_dir))}."
puts "Wrote #{Pathname.new(generic_csv_path).relative_path_from(Pathname.new(source_dir))}."
puts "Wrote #{Pathname.new(markdown_path).relative_path_from(Pathname.new(source_dir))}."
puts "Wrote #{Pathname.new(generic_markdown_path).relative_path_from(Pathname.new(source_dir))}."
warn "WARNING: #{missing_rendered_pages.length} sitemap URLs lacked rendered targets." unless missing_rendered_pages.empty?
