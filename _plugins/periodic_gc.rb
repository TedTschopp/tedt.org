#!/usr/bin/env ruby
# Periodic GC trigger (env gated). Enable with FORCE_PERIODIC_GC=1
# Optional: GC_INTERVAL (default 120 documents)
return unless ENV['FORCE_PERIODIC_GC'] == '1'

interval = (ENV['GC_INTERVAL'] || '120').to_i
interval = 50 if interval <= 0
$gc_render_count = 0

Jekyll::Hooks.register :documents, :post_render do |_doc|
  $gc_render_count += 1
  if ($gc_render_count % interval).zero?
    before = `ps -o rss= -p #{Process.pid}`.to_i
    GC.start
    after = `ps -o rss= -p #{Process.pid}`.to_i
    freed = before - after
    warn "[periodic_gc] GC.run count=#{$gc_render_count} interval=#{interval} rss_before=#{before}KB rss_after=#{after}KB delta=#{freed >= 0 ? '-' : '+'}#{freed.abs}KB"
  end
end
