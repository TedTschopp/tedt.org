#!/usr/bin/env ruby
# Ensures stray html_postprocess.rb is removed before Jekyll registers plugins.
target = File.join(__dir__, 'html_postprocess.rb')
if File.exist?(target)
  begin
    File.delete(target)
    puts '[guard] removed stray html_postprocess.rb before plugin load'
  rescue => e
    warn "[guard] failed to remove stray html_postprocess.rb: #{e.message}"
  end
end