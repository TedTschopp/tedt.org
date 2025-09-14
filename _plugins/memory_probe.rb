#!/usr/bin/env ruby
# Memory probe (now gated). Enable by setting MEM_PROBE=1.
return unless ENV['MEM_PROBE'] == '1'

def mem_probe(label)
  rss = `ps -o rss= -p #{Process.pid}`.to_i # in KB
  warn %[ [mem] #{label} rss=#{rss}KB ]
rescue => e
  warn "[mem] probe error at #{label}: #{e.class}: #{e.message}"
end

mem_probe 'process_start'

RENDER_SAMPLE_INTERVAL = (ENV['MEM_RENDER_INTERVAL'] || '50').to_i
$render_count = 0

Jekyll::Hooks.register :documents, :pre_render do |doc|
  $render_count += 1
  if ($render_count % RENDER_SAMPLE_INTERVAL).zero?
    mem_probe "doc_pre_render count=#{$render_count} path=#{doc.relative_path}"
  end
end

Jekyll::Hooks.register :documents, :post_render do |doc|
  if ($render_count % RENDER_SAMPLE_INTERVAL).zero?
    mem_probe "doc_post_render count=#{$render_count} path=#{doc.relative_path}"
  end
end

Jekyll::Hooks.register :site, :after_init do |_site|
  mem_probe 'after_init'
end

Jekyll::Hooks.register :site, :post_read do |site|
  docs = site.respond_to?(:documents) ? site.documents.size : 'n/a'
  posts = site.posts.respond_to?(:docs) ? site.posts.docs.size : site.posts.size rescue 'n/a'
  warn %[ [mem] post_read docs=#{docs} posts=#{posts} collections=#{site.collections.keys.size} ]
  mem_probe 'post_read'
end

Jekyll::Hooks.register :site, :pre_render do |_site, _payload|
  mem_probe 'pre_render'
end

Jekyll::Hooks.register :site, :post_render do |_site|
  mem_probe 'post_render'
end

Jekyll::Hooks.register :site, :post_write do |_site|
  mem_probe 'post_write'
end
