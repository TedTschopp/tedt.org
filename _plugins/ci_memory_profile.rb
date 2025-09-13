#!/usr/bin/env ruby
# Conditional lightweight memory profiling for CI diagnostics.
# Activated only when ENV['CI_MEM_PROFILE'] is set (e.g., '1').
# Logs resident set size (RSS kB) and object counts at key Jekyll lifecycle hooks.

return unless ENV['CI_MEM_PROFILE']

begin
  require 'objspace'
rescue LoadError
  # objspace may be unavailable in some restricted builds; proceed without detailed counts.
end

def ci_mem_rss_kb
  if File.readable?('/proc/self/status')
    status = File.read('/proc/self/status') rescue ''
    if (m = status.match(/VmRSS:\s+(\d+) kB/i))
      return m[1].to_i
    end
  end
  0
end

def ci_mem_log(stage)
  rss = ci_mem_rss_kb
  obj_counts = if defined?(ObjectSpace) && ObjectSpace.respond_to?(:count_objects)
                 ObjectSpace.count_objects rescue {}
               else
                 {}
               end
  total = obj_counts[:TOTAL] || obj_counts['TOTAL']
  str = "[mem] stage=#{stage} rss_kb=#{rss} total_objs=#{total}"
  warn str
end

Jekyll::Hooks.register :site, :after_init do |_site|
  ci_mem_log('after_init')
end

Jekyll::Hooks.register :site, :post_read do |_site|
  ci_mem_log('post_read')
end

Jekyll::Hooks.register :site, :post_write do |_site|
  ci_mem_log('post_write')
end
