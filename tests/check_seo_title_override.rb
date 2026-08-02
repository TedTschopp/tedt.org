#!/usr/bin/env ruby
# frozen_string_literal: true

require 'liquid'
require 'pathname'

REPO_ROOT = Pathname.new(__dir__).parent
SEO_INCLUDE = REPO_ROOT.join('_includes/seo/meta-data-seo.html')

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

fail_with("Missing SEO include: #{SEO_INCLUDE}") unless SEO_INCLUDE.file?
source = SEO_INCLUDE.read

expected_override_assignment =
  "{% assign seo_title_override = this_page.seo_title | default: this_page['seo-title'] | to_s | strip %}"
expected_source_assignment =
  '{% assign seo_title_source = seo_title_override | default: this_page_title %}'

fail_with('SEO metadata does not support seo_title and seo-title with the documented precedence.') unless
  source.include?(expected_override_assignment)
fail_with('SEO metadata does not fall back from an override to the visible page title.') unless
  source.include?(expected_source_assignment)
fail_with('SEO title support must not replace the visible page-title variable.') unless
  source.include?('{% assign this_page_title = this_page.title %}')

# Exercise the same two assignments in isolation so changes to Liquid default
# semantics or key access cannot silently invert precedence.
template = Liquid::Template.parse(<<~LIQUID)
  {% assign seo_title_override = this_page.seo_title | default: this_page['seo-title'] | to_s | strip %}
  {% assign seo_title_source = seo_title_override | default: this_page_title %}
  {{ seo_title_source | strip }}
LIQUID

cases = [
  [{ 'seo_title' => 'Concise Search Title', 'seo-title' => 'Legacy Search Title' }, 'Visible H1', 'Concise Search Title'],
  [{ 'seo-title' => 'Legacy Search Title' }, 'Visible H1', 'Legacy Search Title'],
  [{}, 'Visible H1', 'Visible H1'],
  [{ 'seo_title' => '   ' }, 'Visible H1', 'Visible H1']
]

cases.each do |page, visible_title, expected|
  rendered = template.render('this_page' => page, 'this_page_title' => visible_title).strip
  fail_with("SEO title precedence failed: expected #{expected.inspect}, got #{rendered.inspect}") unless rendered == expected
end

puts 'SEO title override contract OK (seo_title, seo-title, visible-title fallback)'
