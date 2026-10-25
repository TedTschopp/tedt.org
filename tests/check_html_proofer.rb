#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'open3'
require 'tmpdir'

root = File.expand_path('..', __dir__)
count = 0
Dir.mktmpdir('tedt-htmlproofer-') do |site|
  FileUtils.mkdir_p(File.join(site, 'profile'))
  FileUtils.mkdir_p(File.join(site, 'assets'))
  File.write(File.join(site, 'profile', 'index.html'), '<h2 id="disclosure">Disclosure</h2>')
  File.write(File.join(site, 'profile.html'), '<meta http-equiv="refresh" content="0; url=/profile/">')
  File.write(File.join(site, 'assets', 'pixel.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>')
  File.write(File.join(site, 'assets', 'app.js'), '// Local script')

  cases = [
    ['directory anchor wins over old .html redirect', '<a href="/profile/#disclosure">Disclosure</a>', true, 'Ran on'],
    ['local assets and query strings', '<img src="/assets/pixel.svg?v=1" alt="Pixel"><script src="/assets/app.js"></script>', true, 'Ran on'],
    ['missing target is a failure', '<a href="/missing/">Missing</a>', false, 'does not exist'],
    ['missing anchor is a failure', '<a href="/profile/#absent">Missing anchor</a>', false, "hash 'absent'"],
    ['missing script is a failure', '<script src="/assets/missing.js"></script>', false, 'does not exist'],
    ['HTTP policy remains visible with network disabled', '<a href="http://example.invalid/">Historical link</a>', false, 'not an HTTPS link'],
    ['protocol-relative images are rejected', '<img src="//example.invalid/avatar.png" alt="Avatar">', false, 'protocol-relative URL']
  ]

  cases.each do |name, html, expected, evidence|
    File.write(File.join(site, 'index.html'), html)
    output, status = Open3.capture2e('make', '--no-print-directory', 'proofer', "SITE_DIR=#{site}", 'SKIP_EXTERNAL=1', chdir: root)
    abort "#{name}: unexpected exit/output:\n#{output}" unless status.success? == expected && output.include?(evidence)
    count += 1
  end

  File.write(File.join(site, 'index.html'), '<a href="/missing/">Missing</a>')
  output, status = Open3.capture2e('make', '--no-print-directory', 'proofer_advisory', "SITE_DIR=#{site}", 'SKIP_EXTERNAL=1', chdir: root)
  abort "Advisory mode hid its findings:\n#{output}" unless status.success? && output.include?('does not exist') && output.include?('[advisory] HTMLProofer reported findings')
  count += 1

  FileUtils.rm(File.join(site, 'index.html'))
  output, status = Open3.capture2e('make', '--no-print-directory', 'proofer', "SITE_DIR=#{site}", 'SKIP_EXTERNAL=1', chdir: root)
  abort "An empty build passed validation:\n#{output}" if status.success? || !output.include?('Build Jekyll first')
  count += 1
end

puts "HTMLProofer regression checks: PASS (#{count} scenarios)."
