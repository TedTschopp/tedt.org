#!/usr/bin/env ruby
# Fails the build if any backup post files (*.md.bak) exist under _posts.
# These previously produced duplicate URLs (/slug/ and /slug.md/). They are now excluded,
# but should be removed from the repository to avoid confusion and churn.

violations = Dir.glob('_posts/**/*.md.bak').sort

if violations.any?
  puts "ERROR: Detected #{violations.size} backup post file(s) (*.md.bak):"
  violations.each { |f| puts " - #{f}" }
  puts "\nAction: Remove (git rm) or rename these files. They are excluded from the build but should not remain in the repo."
  puts "Tip: After review, you can remove them with:\n  git rm #{violations.map { |f| "'#{f}'" }.join(' ')}"
  exit 1
else
  puts 'No backup .md.bak post files detected.'
end
