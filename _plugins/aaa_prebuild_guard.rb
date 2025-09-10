# Early guard to remove any resurrected html_postprocess plugin before Jekyll loads plugins.
# Loads first alphabetically. If you still see the log "[html_postprocess] post_render hook active" later,
# then regeneration is occurring even earlier (outside repo) and a build wrapper script must delete it.

warn '[early-guard] placeholder active; html_postprocess.rb retained intentionally'
