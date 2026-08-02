#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'nokogiri'
require 'pathname'
require 'uri'

ROOT = Pathname.new(__dir__).parent
SITE_DIR = Pathname.new(ARGV[0] || ENV['JEKYLL_DESTINATION'] || ROOT.join('_site').to_s)
MANIFEST = JSON.parse(ROOT.join('_data/responsive_images.json').read)
IMAGES = MANIFEST.fetch('images')
SITE_HOST = URI.parse('https://tedt.org').host

errors = []
pages_checked = 0
images_checked = 0
priority_images = 0

def local_path(src)
  return nil if src.nil? || src.empty? || src.start_with?('data:')

  value = src.to_s
  if value.match?(%r{\Ahttps?://}i)
    uri = URI.parse(value.gsub(' ', '%20'))
    return nil if uri.host && uri.host != SITE_HOST
    path = uri.path.to_s
  else
    path = value.split(/[?#]/, 2).first.to_s
  end
  path = "/#{path}" unless path.start_with?('/')
  URI::DEFAULT_PARSER.unescape(path)
rescue URI::InvalidURIError
  nil
end

def escaped_url(value)
  unsafe = /[^#{URI::PATTERN::UNRESERVED}#{URI::PATTERN::RESERVED}%]/
  URI::DEFAULT_PARSER.escape(value.to_s, unsafe)
end

def rendered_file(site_dir, url)
  path = URI::DEFAULT_PARSER.unescape(URI.parse(url).path)
  relative = path.sub(%r{\A/}, '')
  return site_dir.join('index.html') if relative.empty?
  return site_dir.join(relative, 'index.html') if path.end_with?('/')

  direct = site_dir.join(relative)
  return direct if direct.file?

  site_dir.join(relative, 'index.html')
end

sitemap_path = SITE_DIR.join('sitemap.xml')
abort "ERROR: missing #{sitemap_path}" unless sitemap_path.file?
sitemap = Nokogiri::XML(sitemap_path.read) { |config| config.strict }
urls = sitemap.xpath('//*[local-name()="loc"]').map(&:text)

urls.each do |url|
  file = rendered_file(SITE_DIR, url)
  unless file.file?
    errors << "#{url}: rendered HTML is missing"
    next
  end
  next unless file.extname == '.html'

  pages_checked += 1
  document = Nokogiri::HTML(file.read)
  high_priority = document.css('img[fetchpriority="high"]')
  if high_priority.length > 1
    errors << "#{url}: #{high_priority.length} images use fetchpriority=high"
  end

  high_priority.each do |image|
    priority_images += 1
    errors << "#{url}: high-priority image must load eagerly" unless image['loading'] == 'eager'
  end

  document.css('img').each do |image|
    path = local_path(image['src'])
    next unless path&.downcase&.end_with?('.webp')
    metadata = IMAGES[path]
    unless metadata
      errors << "#{url}: unmanaged local WebP #{path}"
      next
    end

    images_checked += 1
    label = "#{url}: #{path}"
    errors << "#{label} src contains unescaped whitespace" if image['src'].match?(/\s/)
    errors << "#{label} missing width" if image['width'].to_s.empty?
    errors << "#{label} missing height" if image['height'].to_s.empty?
    errors << "#{label} has wrong intrinsic width" unless image['width'].to_i == metadata['width']
    errors << "#{label} has wrong intrinsic height" unless image['height'].to_i == metadata['height']
    errors << "#{label} missing srcset" if image['srcset'].to_s.empty?
    errors << "#{label} missing sizes" if image['sizes'].to_s.empty?
    errors << "#{label} missing loading" if image['loading'].to_s.empty?
    errors << "#{label} missing decoding=async" unless image['decoding'] == 'async'

    metadata.fetch('variants').each do |variant|
      candidate = "#{escaped_url(variant['path'])} #{variant['width']}w"
      errors << "#{label} srcset missing #{candidate}" unless image['srcset'].to_s.include?(candidate)
    end
    if image['fetchpriority'] == 'high'
      errors << "#{label} high-priority image must load eagerly" unless image['loading'] == 'eager'
    else
      errors << "#{label} non-LCP image must load lazily" unless image['loading'] == 'lazy'
    end
  end
end

if errors.any?
  warn "Responsive image check failed with #{errors.length} error(s):"
  errors.first(100).each { |error| warn "- #{error}" }
  warn "- ... #{errors.length - 100} more" if errors.length > 100
  exit 1
end

puts "Responsive image check passed: #{pages_checked} sitemap pages, " \
     "#{images_checked} managed WebP instances, #{priority_images} LCP-priority images."
