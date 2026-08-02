#!/usr/bin/env ruby
# frozen_string_literal: true

require "kramdown"
require "kramdown-parser-gfm"
require "nokogiri"
require "pathname"
require "sass-embedded"

ROOT = Pathname.new(__dir__).parent
BOOTSTRAP_ENTRYPOINT = ROOT.join("css", "bootstrap-build.scss")
ARTICLE = ROOT.join("_posts", "AI", "2026-08-01-How-Much-Work-Can-Your-AI-Safely-Own.md")
MINIMUM_CONTRAST = 4.5

def css_channels(color)
  if color.start_with?("#")
    return color.delete_prefix("#").scan(/../).map { |channel| channel.to_i(16) / 255.0 }
  end

  values = color[/rgba?\((.*?)\)/, 1]&.split(",")&.first(3)
  raise "unsupported CSS color #{color.inspect}" unless values&.length == 3

  values.map do |value|
    component = value.strip
    component.end_with?("%") ? component.to_f / 100.0 : component.to_f / 255.0
  end
end

def relative_luminance(color)
  channels = css_channels(color)
  linear = channels.map do |channel|
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055)**2.4
  end
  (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2])
end

def contrast_ratio(foreground, background)
  lighter, darker = [relative_luminance(foreground), relative_luminance(background)].sort.reverse
  (lighter + 0.05) / (darker + 0.05)
end

errors = []
source = BOOTSTRAP_ENTRYPOINT.read.sub(/\A---\s*\n---\s*\n/, "")
css = Sass.compile_string(
  source,
  load_paths: [ROOT.join("_sass").to_s],
  style: :expanded,
  silence_deprecations: %w[import global-builtin color-functions if-function]
).css

alert_match = css.match(/\.alert-call-to-action\s*\{(?<body>.*?)\}/m)
if alert_match
  declarations = alert_match[:body]
  {
    "--bs-alert-color" => "var(--bs-call-to-action-text-emphasis)",
    "--bs-alert-bg" => "var(--bs-call-to-action-bg-subtle)",
    "--bs-alert-border-color" => "var(--bs-call-to-action-border-subtle)",
    "--bs-alert-link-color" => "var(--bs-call-to-action-text-emphasis)"
  }.each do |property, expected|
    errors << ".alert-call-to-action must set #{property} to #{expected}" unless declarations.include?("#{property}: #{expected};")
  end
else
  errors << "compiled Bootstrap CSS is missing .alert-call-to-action"
end

errors << "CTA base color must be the brand action orange" unless css.include?("--bs-call-to-action: rgb(232, 96, 39);")

color_pattern = /(?:#[0-9a-f]{6}|rgba?\([^;]+\))/i
text_colors = css.scan(/--bs-call-to-action-text-emphasis:\s*(#{color_pattern});/).flatten
background_colors = css.scan(/--bs-call-to-action-bg-subtle:\s*(#{color_pattern});/).flatten
if text_colors.length < 2 || background_colors.length < 2
  errors << "CTA alert must expose light and dark text/background tokens"
else
  [["light", text_colors[0], background_colors[0]], ["dark", text_colors[1], background_colors[1]]].each do |mode, text, background|
    ratio = contrast_ratio(text, background)
    errors << "CTA alert #{mode} contrast is #{ratio.round(2)}; expected at least #{MINIMUM_CONTRAST}" if ratio < MINIMUM_CONTRAST
  end
end

article = ARTICLE.read
body = article.sub(/\A---\s*\n.*?\n---\s*\n/m, "")
document = Nokogiri::HTML.fragment(Kramdown::Document.new(body, input: "GFM").to_html)
cta = document.at_css("blockquote.alert.alert-call-to-action")
errors << "article CTA must render as blockquote.alert.alert-call-to-action" unless cta

makefile = ROOT.join("Makefile").read
errors << "Makefile must expose call_to_action_alert_check" unless makefile.include?("call_to_action_alert_check:")
errors << "make qa must run call_to_action_alert_check" unless makefile[/^qa:.*$/, 0]&.include?("call_to_action_alert_check")

workflow = ROOT.join(".github", "workflows", "deploy.yml").read
errors << "deploy workflow must run call_to_action_alert_check" unless workflow.include?("make call_to_action_alert_check")

if errors.any?
  warn "Call-to-action alert check failed:"
  errors.each { |error| warn "- #{error}" }
  exit 1
end

puts "Call-to-action alert check passed with light and dark WCAG AA contrast."