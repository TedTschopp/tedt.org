#!/usr/bin/env ruby
# Logs memory usage every N rendered documents to pinpoint growth phase.
# Enabled only when CI_MEM_PROFILE is set.
return unless ENV['CI_MEM_PROFILE']

N = (ENV['CI_MEM_DOC_INTERVAL'] || '200').to_i
COUNTER = { docs: 0 }

def ci_docs_rss
  if File.readable?('/proc/self/status')
    if (m = File.read('/proc/self/status').match(/VmRSS:\s+(\d+) kB/i))
      return m[1].to_i
    end
  end
  0
end

Jekyll::Hooks.register :documents, :post_render do |doc|
  COUNTER[:docs] += 1
  if (COUNTER[:docs] % N).zero?
    warn "[mem-docs] rendered=#{COUNTER[:docs]} rss_kb=#{ci_docs_rss} path=#{doc.relative_path}"
  end
end
