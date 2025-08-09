#!/usr/bin/env ruby
require 'json'

feed_path = File.expand_path('../_site/feed-mastodon.json', __dir__)
abort "Missing #{feed_path} (build first)" unless File.exist?(feed_path)

data = JSON.parse(File.read(feed_path))
items = data['items'] || []
lengths = items.map { |i| i['content_text'].to_s.length }
if lengths.empty?
  puts 'No items to report.'
  exit 0
end

sorted = lengths.sort
count = lengths.size
min = sorted.first
max = sorted.last
avg = (lengths.sum.to_f / count).round(2)
median = sorted[count / 2]
p95 = sorted[(count * 0.95).floor]

def bucket_for(len)
  (len / 50) * 50
end

buckets = Hash.new(0)
lengths.each { |l| buckets[bucket_for(l)] += 1 }
ordered = buckets.keys.sort

puts 'Mastodon toot length report:'
puts " Count : #{count}"
puts " Min   : #{min}"
puts " Max   : #{max}"
puts " Avg   : #{avg}"
puts " Median: #{median}"
puts " P95   : #{p95}"
puts ' Distribution (bucket start => count):'
ordered.each do |b|
  puts format('  %3d-%3d : %d', b, b + 49, buckets[b])
end
