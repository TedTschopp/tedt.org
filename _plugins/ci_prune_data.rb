#!/usr/bin/env ruby
# Remove large data sets in CI lite builds to reduce memory and avoid accidental config / env scanning.
# Skips when full builds explicitly requested.
return if ENV['CI_DEBUG_FULL'] == '1'

TARGET_KEYS = %w[Swiss-Folklore-Work-in-Progress Checkins].freeze

Jekyll::Hooks.register :site, :post_read do |site|
  TARGET_KEYS.each do |k|
    next unless site.data.key?(k)
    site.data.delete(k)
    warn "[ci-prune-data] removed data key=#{k}"
  end
end
