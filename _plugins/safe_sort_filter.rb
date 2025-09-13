# frozen_string_literal: true
# safe_sort_filter.rb
# Provides a defensive Liquid filter `safe_sort` that behaves like `sort` but:
# - Returns [] when input is nil or not an Enumerable.
# - Accepts optional key (string/symbol) like Liquid's native sort: {{ collection | safe_sort: 'title' }}
# - Rescues any comparison errors and falls back to stringified comparison.
# - Guarantees an Array result to avoid nil errors in chained filters.
#
# Usage examples:
#   {{ site.categories['Home'] | safe_sort: 'date' | reverse }}
#   {{ some_possibly_nil_array | safe_sort }}
#
# Implementation notes:
# We copy to an Array to avoid mutating original objects. We attempt the primary sort;
# if that raises, we fallback to a safe string conversion comparator.

module SafeSortFilter
  def safe_sort(input, property = nil)
    return [] if input.nil?
    unless input.respond_to?(:to_a)
      return []
    end
    arr = input.to_a.compact
    return arr if arr.length < 2

    begin
      if property
        arr.sort_by { |e| safe_key_extract(e, property) }
      else
        # If elements are directly comparable or already strings/numbers
        arr.sort
      end
    rescue StandardError
      # Fallback: compare by string representation; ensure stable order
      arr.sort_by { |e| safe_stringify(e, property) }
    end
  end

  private

  def safe_key_extract(obj, key)
    if obj.respond_to?(:[]) && obj[key]
      obj[key]
    elsif obj.respond_to?(key)
      obj.public_send(key)
    else
      nil
    end
  rescue StandardError
    nil
  end

  def safe_stringify(obj, key)
    v = key ? safe_key_extract(obj, key) : obj
    v.nil? ? '' : v.to_s
  rescue StandardError
    ''
  end
end

Liquid::Template.register_filter(SafeSortFilter)
