#!/usr/bin/env ruby
# frozen_string_literal: true

require 'html-proofer'

root = File.expand_path(ARGV.fetch(0, '_site'))
abort "Build Jekyll first: missing output directory #{root}" unless Dir.exist?(root)
abort "Build Jekyll first: missing index.html in #{root}" unless File.file?(File.join(root, 'index.html'))

options = {
  root_dir: root,
  allow_missing_href: true,
  disable_external: ENV['SKIP_EXTERNAL'] == '1',
  # GitHub Pages serves /profile/ from /profile/index.html, even if the old
  # /profile.html forwarding file also exists. HTMLProofer otherwise prefers
  # the .html sibling and reports valid directory-page anchors as missing.
  swap_urls: { %r{\A(/(?!/)(?:[^?#]*/)?)(?=[?#]|\z)} => '\\1index.html' }
}

HTMLProofer.check_directory(root, options).run
