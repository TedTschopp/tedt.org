source 'https://rubygems.org'

gem 'jekyll', '~> 4.3.2'
gem 'jekyll-redirect-from'
# NOTE: Patched versions of nokogiri (>=1.18.9) and google-protobuf (>=3.25.5)
# require Ruby >= 3.1. Local dev Ruby is 2.6.10, so we let Dependabot/CI on Ruby 3.2
# raise & merge updates; do not pin here to avoid resolution failure locally.
# Security overrides for vulnerable transient dependencies
# NOTE: nokogiri & google-protobuf security upgrades require newer Ruby than local (2.6.10).
# CI (Ruby 3.2) will surface updated versions via Dependabot; local pin skipped to avoid resolution failure.
# Add any other plugins you need explicitly here
group :development do
	gem 'html-proofer', '~> 3.19'
	# Security auditing for Ruby gems (checks against Ruby Advisory DB)
	gem 'bundler-audit', '~> 0.9'
end