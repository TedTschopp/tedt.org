#!/usr/bin/env ruby
# frozen_string_literal: true

require 'pathname'

REPO_ROOT = Pathname.new(__dir__).parent

GLOBAL_INCLUDE = REPO_ROOT.join('_includes/assets/all-css-includes.html')
TOOLS_ENTRYPOINT = REPO_ROOT.join('tools/lib/tedt-org-tools.css')

# Keep this list in sync with the *unconditional* global CSS includes in:
#   _includes/assets/all-css-includes.html
REQUIRED_CSS_PATHS = [
  '/css/bootstrap-build.css',
  '/css/shared-fonts.css',
  '/css/logo-and-company-fonts.css'
].freeze

def fail_with(message)
  warn("ERROR: #{message}")
  exit(1)
end

fail_with("Missing file: #{GLOBAL_INCLUDE}") unless GLOBAL_INCLUDE.file?
fail_with("Missing file: #{TOOLS_ENTRYPOINT}") unless TOOLS_ENTRYPOINT.file?

include_text = GLOBAL_INCLUDE.read
missing_in_include = REQUIRED_CSS_PATHS.reject { |path| include_text.include?(path) }
unless missing_in_include.empty?
  fail_with(
    "Global include is missing expected CSS href(s): #{missing_in_include.join(', ')}"
  )
end

tools_text = TOOLS_ENTRYPOINT.read
imports = tools_text.scan(/@import\s+url\(["']([^"']+)["']\)\s*;/).flatten
missing_in_tools = REQUIRED_CSS_PATHS.reject { |path| imports.include?(path) }
unless missing_in_tools.empty?
  fail_with(
    "Tools entrypoint is missing expected @import(s): #{missing_in_tools.join(', ')}"
  )
end

actual_order = imports.select { |path| REQUIRED_CSS_PATHS.include?(path) }
expected_order = REQUIRED_CSS_PATHS
if actual_order != expected_order
  fail_with(
    "Tools entrypoint import order mismatch. Expected #{expected_order.inspect}, got #{actual_order.inspect}"
  )
end

puts 'OK: tools/lib/tedt-org-tools.css matches global CSS base includes.'
