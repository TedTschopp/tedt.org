#!/usr/bin/env ruby
# Logs sizes of major collections & data payload after post_read to identify bulk memory consumers.
return unless ENV['CI_MEM_PROFILE']

Jekyll::Hooks.register :site, :post_read do |site|
  begin
    col_sizes = site.collections.transform_values { |c| c.docs.size }
    top_cols = col_sizes.sort_by { |_,v| -v }.first(8).map { |k,v| "#{k}=#{v}" }.join(',')
    data_keys = site.data.keys
    warn "[collections] top=#{top_cols} data_keys=#{data_keys.size}"
    if data_keys.size > 0
      big_data = data_keys.first(30).join(',')
      warn "[collections] sample_data_keys=#{big_data}"
    end
  rescue => e
    warn "[collections] error=#{e.class}: #{e.message}"
  end
end
