#!/usr/bin/env ruby
require 'pathname'
ROOT = Pathname.new(File.expand_path('..', __dir__))

bad = []
ROOT.glob('**/*.{html,md,xml,rb,js,scss,css,yml,yaml}').each do |f|
  next unless f.file?
  next if f.to_s.start_with?(ROOT.join('_site').to_s)
  content = f.read
  next if content =~ /legacy site\.siteurl removed/
  if content.include?('site.siteurl')
    # ignore this test file's own reference
    unless f.basename.to_s == 'check_no_legacy_siteurl.rb'
      bad << f.relative_path_from(ROOT).to_s
    end
  end
end

if bad.empty?
  puts 'Legacy site.siteurl usage: NONE'
else
  puts 'Legacy site.siteurl found in:'
  bad.each { |f| puts " - #{f}" }
  exit 1
end
