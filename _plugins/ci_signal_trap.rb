#!/usr/bin/env ruby
# Trap TERM/INT in CI to emit a diagnostic footer so we can see where termination occurred.
return unless ENV['CI_MEM_PROFILE']

%w[TERM INT].each do |sig|
  Signal.trap(sig) do
    begin
      stamp = Time.now.utc.iso8601 rescue Time.now.to_s
      warn "[signal] caught=#{sig} time=#{stamp} dumping partial diagnostics"
      if defined?(Jekyll) && Jekyll.respond_to?(:logger)
        warn "[signal] site collections loaded: #{Jekyll.sites&.first&.collections&.keys&.size rescue 'n/a'}"
      end
      if File.readable?('/proc/self/status')
        rss = File.read('/proc/self/status')[/VmRSS:\s+(\d+) kB/,1]
        warn "[signal] VmRSS_kb=#{rss}"
      end
    rescue => e
      warn "[signal] trap error: #{e.class}: #{e.message}"
    ensure
      # Re-raise default to allow normal termination semantics
      raise SystemExit.new(143)
    end
  end
end
