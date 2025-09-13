#!/usr/bin/env ruby
# Filters site.posts in CI to only include most recent N days (default 120) unless CI_DEBUG_FULL=1.
return if ENV['CI_DEBUG_FULL'] == '1'
days = (ENV['CI_RECENT_DAYS'] || '120').to_i
cutoff = Time.now - (days * 86400)
Jekyll::Hooks.register :site, :post_read do |site|
  orig_count = site.posts.docs.size
  site.posts.docs.select! do |d|
    t = d.data['date'] || d.date
    (t.is_a?(Time) ? t : Time.parse(t.to_s)) >= cutoff rescue true
  end
  filtered = site.posts.docs.size
  warn "[recent-posts] kept=#{filtered} dropped=#{orig_count - filtered} window_days=#{days} cutoff=#{cutoff.utc.iso8601}" if orig_count != filtered
end
