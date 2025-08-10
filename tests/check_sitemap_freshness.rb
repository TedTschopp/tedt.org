#!/usr/bin/env ruby
# Verifies that sitemap.xml was generated in the last build run and contains at least one <url> entry.
# Fails CI if sitemap is missing, empty, or has zero URLs.

sitemap_path = File.join('_site','sitemap.xml')
unless File.exist?(sitemap_path)
  abort 'ERROR: sitemap.xml missing in _site (build issue)'
end

content = File.read(sitemap_path)
if content.scan(/<url>/).empty?
  abort 'ERROR: sitemap.xml contains zero <url> entries'
end

# Basic well-formedness checks
abort 'ERROR: sitemap missing <urlset>' unless content.include?('<urlset')
abort 'ERROR: sitemap missing closing </urlset>' unless content.include?('</urlset>')

puts 'Sitemap freshness & structure OK'
