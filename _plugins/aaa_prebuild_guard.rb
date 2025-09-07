# Early guard to remove any resurrected html_postprocess plugin before Jekyll loads plugins.
# Loads first alphabetically. If you still see the log "[html_postprocess] post_render hook active" later,
# then regeneration is occurring even earlier (outside repo) and a build wrapper script must delete it.

begin
  target = File.join(__dir__, 'html_postprocess.rb')
  if File.exist?(target)
    File.delete(target)
    warn '[early-guard] removed stray html_postprocess.rb before plugin enumeration'
  end
rescue => e
  warn "[early-guard] failed to remove stray html_postprocess.rb: #{e.class}: #{e.message}"
end
