#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "digest"
require "yaml"

ROOT = File.expand_path("..", __dir__)
POST_GLOB = File.join(ROOT, "_posts", "Slides", "*")
FRONT_MATTER = /\A---\s*\n(?<yaml>.*?)\n---\s*(?:\n|\z)/m

def fail_check(message)
  warn "Slide deck check failed: #{message}"
  exit 1
end

def front_matter(path)
  source = File.read(path)
  match = FRONT_MATTER.match(source)
  fail_check("#{path.delete_prefix("#{ROOT}/")} has no YAML front matter") unless match

  YAML.safe_load(
    match[:yaml],
    permitted_classes: [Date, Time],
    aliases: true
  ) || {}
rescue Psych::Exception => e
  fail_check("#{path.delete_prefix("#{ROOT}/")} has invalid YAML: #{e.message}")
end

posts = Dir.glob(POST_GLOB).select { |path| File.file?(path) }.sort
fail_check("no posts found under _posts/Slides") if posts.empty?

published = 0
standalone = 0

posts.each do |post_path|
  metadata = front_matter(post_path)
  next if metadata["published"] == false

  published += 1
  relative_post = post_path.delete_prefix("#{ROOT}/")

  %w[layout title date description permalink].each do |key|
    value = metadata[key]
    fail_check("#{relative_post} is missing #{key}") if value.nil? || value.to_s.strip.empty?
  end

  permalink = metadata["permalink"].to_s
  unless permalink.match?(%r{\A/slides/[a-z0-9][a-z0-9-]*/\z})
    fail_check("#{relative_post} has invalid slides permalink #{permalink.inspect}")
  end

  next unless metadata["layout"] == "slide-deck"

  standalone += 1
  fail_check("#{relative_post} must set format: standalone-html") unless metadata["format"] == "standalone-html"

  %w[deck_url deck_sha256 slide_count image image-alt image_width image_height].each do |key|
    value = metadata[key]
    fail_check("#{relative_post} is missing #{key}") if value.nil? || value.to_s.strip.empty?
  end

  deck_url = metadata["deck_url"].to_s
  unless deck_url.match?(%r{\A/slides/decks/[a-z0-9][a-z0-9-]*/\z}) && !deck_url.include?("..")
    fail_check("#{relative_post} has unsafe or noncanonical deck_url #{deck_url.inspect}")
  end

  deck_path = File.join(ROOT, deck_url.delete_prefix("/"), "index.html")
  fail_check("#{relative_post} points to missing #{deck_path.delete_prefix("#{ROOT}/")}") unless File.file?(deck_path)

  image_url = metadata["image"].to_s
  expected_image_url = "#{deck_url}slide-preview.png"
  unless image_url == expected_image_url
    fail_check("#{relative_post} image must be #{expected_image_url.inspect}")
  end
  image_path = File.join(ROOT, image_url.delete_prefix("/"))
  fail_check("#{relative_post} points to missing #{image_path.delete_prefix("#{ROOT}/")}") unless File.file?(image_path)
  image = File.binread(image_path)
  unless image.start_with?("\x89PNG\r\n\x1A\n".b) && image.bytesize >= 24
    fail_check("#{image_path.delete_prefix("#{ROOT}/")} must be a PNG")
  end
  actual_width, actual_height = image.byteslice(16, 8).unpack("NN")
  declared_width = Integer(metadata["image_width"], exception: false)
  declared_height = Integer(metadata["image_height"], exception: false)
  unless [declared_width, declared_height] == [actual_width, actual_height]
    fail_check(
      "#{image_path.delete_prefix("#{ROOT}/")} is #{actual_width}x#{actual_height}, " \
      "metadata declares #{declared_width}x#{declared_height}"
    )
  end

  deck = File.binread(deck_path)
  relative_deck = deck_path.delete_prefix("#{ROOT}/")
  fail_check("#{relative_deck} must begin with an HTML doctype") unless deck.match?(/\A<!doctype html>/i)
  fail_check("#{relative_deck} must remain a static file without Jekyll front matter") if deck.start_with?("---\n")

  expected_sha = metadata["deck_sha256"].to_s.downcase
  actual_sha = Digest::SHA256.hexdigest(deck)
  unless expected_sha.match?(/\A[0-9a-f]{64}\z/) && expected_sha == actual_sha
    fail_check("#{relative_deck} checksum is #{actual_sha}, expected #{expected_sha}")
  end

  declared_count = Integer(metadata["slide_count"], exception: false)
  fail_check("#{relative_post} slide_count must be a positive integer") unless declared_count&.positive?

  actual_count = deck.scan(/<article class="web-slide\b/).size
  unless actual_count == declared_count
    fail_check("#{relative_deck} contains #{actual_count} slides, metadata declares #{declared_count}")
  end

  required_markers = {
    "document language" => /<html[^>]+\blang=/i,
    "responsive viewport" => /<meta[^>]+\bname="viewport"/i,
    "document title" => /<title>[^<]+<\/title>/i,
    "labeled presentation controls" => /aria-label="Presentation controls"/,
    "screen-reader announcements" => /aria-live="polite"/,
    "reduced-motion support" => /prefers-reduced-motion/,
    "keyboard navigation" => /addEventListener\('keydown'/,
    "touch navigation" => /addEventListener\('touchstart'/,
    "fullscreen support" => /requestFullscreen/,
    "print support" => /window\.print/,
    "speaker notes support" => /data-notes/
  }

  required_markers.each do |label, pattern|
    fail_check("#{relative_deck} is missing #{label}") unless deck.match?(pattern)
  end

  absolute_image_url = "https://tedt.org#{image_url}"
  social_image_markers = {
    "Open Graph preview" => /<meta property="og:image" content="#{Regexp.escape(absolute_image_url)}">/,
    "X preview" => /<meta name="twitter:image" content="#{Regexp.escape(absolute_image_url)}">/,
    "preview width" => /<meta property="og:image:width" content="#{actual_width}">/,
    "preview height" => /<meta property="og:image:height" content="#{actual_height}">/,
    "large social card" => /<meta name="twitter:card" content="summary_large_image">/
  }
  social_image_markers.each do |label, pattern|
    fail_check("#{relative_deck} is missing #{label}") unless deck.match?(pattern)
  end

  if deck.match?(/<script\b[^>]+src=["']https?:/i) ||
     deck.match?(/<link\b[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i)
    fail_check("#{relative_deck} has an external script or stylesheet dependency")
  end
end

fail_check("no published standalone HTML deck post found") if standalone.zero?

index = File.read(File.join(ROOT, "slides", "index.html"))
fail_check("slides/index.html must discover _posts/Slides posts") unless index.include?("_posts/Slides/")
fail_check("slides/index.html must not reference site.slides") if index.include?("site.slides")
fail_check("slides/index.html must expose searchable deck cards") unless index.include?("data-slides-grid")
fail_check("slides/index.html must render each deck image") unless index.include?("slide.image")

puts "Slide deck check passed: #{published} published posts, #{standalone} standalone HTML deck."
