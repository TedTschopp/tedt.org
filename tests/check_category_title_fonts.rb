#!/usr/bin/env ruby
# frozen_string_literal: true

require 'pathname'
require 'set'
require 'uri'
require 'yaml'

REPO_ROOT = Pathname.new(__dir__).parent
REGISTRY_PATH = REPO_ROOT.join('_data/category_registry.yml')

# Category pages use the non-homepage CSS branch from _includes/assets/all-css-includes.html.
CATEGORY_FONT_BUNDLES = [
  REPO_ROOT.join('css/shared-fonts.css'),
  REPO_ROOT.join('css/logo-and-company-fonts.css'),
  REPO_ROOT.join('css/content-decorative-fonts.css')
].freeze

SYSTEM_OR_GENERIC_FAMILIES = Set.new([
  'Arial',
  'Arial Black',
  'Book Antiqua',
  'Baskerville',
  'Chalkduster',
  'Comic Sans MS',
  'Georgia',
  'Helvetica',
  'Helvetica Neue',
  'Impact',
  'Optima',
  'Palatino',
  'Palatino Linotype',
  'Roboto',
  'Segoe UI',
  'Times',
  'Times New Roman',
  '-apple-system',
  'cursive',
  'fantasy',
  'monospace',
  'sans-serif',
  'serif',
  'system-ui'
]).freeze

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

def extract_imported_families(css_text)
  css_text.scan(/@import\s+url\((['"]?)([^'")]+)\1\)\s*;/i).each_with_object(Set.new) do |(_quote, url), families|
    query = URI.parse(url).query
    next if query.nil? || query.empty?

    URI.decode_www_form(query).each do |key, value|
      next unless key == 'family'

      family = value.split(':', 2).first.to_s.tr('+', ' ').strip
      families << family unless family.empty?
    end
  rescue URI::InvalidURIError
    next
  end
end

def extract_font_face_families(css_text)
  css_text.scan(/@font-face\s*\{[^}]*?font-family:\s*(?:"([^"]+)"|'([^']+)'|([^;\n}]+))/mi).each_with_object(Set.new) do |match, families|
    family = match.compact.first.to_s.strip
    families << family unless family.empty?
  end
end

def primary_font_family(font_stack)
  stack = font_stack.to_s.strip
  return nil if stack.empty?

  quoted = stack.match(/\A["']([^"']+)["']/)
  return quoted[1].strip if quoted

  stack.split(',', 2).first.to_s.strip
end

fail_with("Missing file: #{REGISTRY_PATH}") unless REGISTRY_PATH.file?

missing_bundles = CATEGORY_FONT_BUNDLES.reject(&:file?)
unless missing_bundles.empty?
  fail_with("Missing category font bundle(s): #{missing_bundles.join(', ')}")
end

available_families = CATEGORY_FONT_BUNDLES.each_with_object(Set.new) do |path, families|
  css_text = path.read
  families.merge(extract_imported_families(css_text))
  families.merge(extract_font_face_families(css_text))
end

registry = YAML.load_file(REGISTRY_PATH, aliases: true)

missing_registry_fonts = []

registry.each do |slug, entry|
  palette = entry.fetch('palette', {})
  font_stack = palette['fontTitle']
  next if font_stack.nil? || font_stack.strip.empty?

  primary_family = primary_font_family(font_stack)
  next if primary_family.nil? || SYSTEM_OR_GENERIC_FAMILIES.include?(primary_family)
  next if available_families.include?(primary_family)

  missing_registry_fonts << {
    slug: slug,
    title: entry['title'] || slug,
    family: primary_family,
    page: entry['category_home_page'] || "/category/#{slug}/"
  }
end

unless missing_registry_fonts.empty?
  warn 'ERROR: category_registry title fonts missing from category page bundles:'
  missing_registry_fonts.sort_by { |entry| [entry[:family], entry[:slug]] }.each do |entry|
    warn(" - #{entry[:slug]} (#{entry[:title]}): #{entry[:family]} -> #{entry[:page]}")
  end
  exit(1)
end

puts 'OK: category title fonts referenced in category_registry are available in category page CSS bundles.'