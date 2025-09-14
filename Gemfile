source 'https://rubygems.org'

gem 'jekyll', '~> 4.3.2'
gem 'jekyll-redirect-from'
gem 'ffi', '= 1.16.3' # Downgraded: newer 1.17.x builds unavailable on CI; 1.16.3 widely present

# ---------------------------------------------------------------------------
# Security: enforce minimum patched versions for transitive dependencies
#   Vulnerabilities (bundler-audit):
#     - google-protobuf CVE-2024-7254 (update to >= 3.25.5)
#     - nokogiri multiple GHSA advisories (update to >= 1.18.9)
# These newer versions require a newer Ruby (>= 3.1). To avoid breaking local
# developers still on Ruby 2.6.x, only apply the hard constraints when running
# on a sufficiently new Ruby. CI (GitHub Actions) already uses Ruby >= 3.1 so
# the secure versions will be resolved and the lockfile updated there.
# Once local environments upgrade Ruby, this conditional can be removed and
# the constraints made unconditional.
# ---------------------------------------------------------------------------
if Gem::Version.new(RUBY_VERSION) >= Gem::Version.new('3.1.0')
	gem 'nokogiri', '>= 1.18.9'
	gem 'google-protobuf', '>= 3.25.5', '< 4.0'
	# sass-embedded pulls in google-protobuf (~> 3.x). Older versions (e.g. 1.58.x)
	# constrain protobuf to < 3.25.5. Requiring a newer sass-embedded ensures the
	# updated google-protobuf can be resolved.
	gem 'sass-embedded', '>= 1.77.0'
end

# NOTE: If you wish to force security even on older Ruby, upgrade Ruby locally
# first; modern nokogiri no longer supports EOL Ruby 2.6.

# Add any other plugins you need explicitly here
group :development do
	gem 'html-proofer', '~> 5.0'
	# Security auditing for Ruby gems (checks against Ruby Advisory DB)
	gem 'bundler-audit', '~> 0.9'
end