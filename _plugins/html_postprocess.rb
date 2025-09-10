# Placeholder html_postprocess plugin (no-op)
# Intentionally empty to satisfy Jekyll plugin loading. Original logic removed.
Jekyll::Hooks.register :documents, :post_render do |doc|
  # no operation
end
