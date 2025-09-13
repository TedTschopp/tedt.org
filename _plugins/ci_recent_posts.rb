#!/usr/bin/env ruby
# Recent posts pruning plugin (currently disabled).
# Previously trimmed posts older than CI_RECENT_DAYS (default 120) to reduce memory.
# User requested full post set restored in CI. To re-enable, set CI_RECENT_ENABLE=1.
return unless ENV['CI_RECENT_ENABLE'] == '1'
return if ENV['CI_DEBUG_FULL'] == '1'
days = (ENV['CI_RECENT_DAYS'] || '120').to_i
cutoff = Time.now - (days * 86400)
Jekyll::Hooks.register :site, :post_read do |site|
  orig_count = site.posts.docs.size
  site.posts.docs.select! do |d|
    t = d.data['update'] || d.data['date'] || d.date
    (t.is_a?(Time) ? t : Time.parse(t.to_s)) >= cutoff rescue true
  end
  filtered = site.posts.docs.size
  warn "[recent-posts] kept=#{filtered} dropped=#{orig_count - filtered} window_days=#{days} cutoff=#{cutoff.utc.iso8601}" if orig_count != filtered
end
