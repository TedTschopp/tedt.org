#!/usr/bin/env ruby
# frozen_string_literal: true

# Apply the curated quote-portrait metadata without reserializing YAML or
# disturbing unrelated front-matter/body edits.
#
# Usage:
#   ruby scripts/apply_quote_portrait_front_matter.rb
#   ruby scripts/apply_quote_portrait_front_matter.rb --check

require 'json'
require 'pathname'

ROOT = Pathname.new(__dir__).parent
QUOTE_DIR = ROOT.join('_posts/Quotes')
EXPECTED_TARGET_COUNT = 72

# The keys intentionally match the historical quote filenames. Several names
# in those filenames predate the corrected display names now used in the post
# front matter, so the mapping keeps selection stable while metadata uses the
# corrected portrait subject.
PORTRAITS = {
  'Al-Swearengen' => ['al-swearengen', 'Al Swearengen'],
  'Alfred-A.-Montapert' => ['alfred-a-montapert', 'Alfred A. Montapert'],
  'Bill-Gates' => ['bill-gates', 'Bill Gates'],
  'Brad-Bird' => ['brad-bird', 'Brad Bird'],
  'CS-Lewis' => ['cs-lewis', 'C. S. Lewis'],
  'Charlie-Brooker-and-Konnie-Huq' => ['charlie-brooker-and-konnie-huq', 'Charlie Brooker and Konnie Huq'],
  'Clay-Christensen' => ['clay-christensen', 'Clay Christensen'],
  'Dorthy-Sayers' => ['dorothy-sayers', 'Dorothy Sayers'],
  'Edward-Castronova' => ['edward-castronova', 'Edward Castronova'],
  'Eric-Hoffer' => ['eric-hoffer', 'Eric Hoffer'],
  'Eric-Shinseki' => ['eric-shinseki', 'Eric Shinseki'],
  'GK-Chesterton' => ['gk-chesterton', 'G. K. Chesterton'],
  'Henry-Ford' => ['henry-ford', 'Henry Ford'],
  'Hippocrates' => ['hippocrates', 'Hippocrates'],
  'Horace-Dediu' => ['horace-dediu', 'Horace Dediu'],
  'JRR-Tolkien' => ['jrr-tolkien', 'J. R. R. Tolkien'],
  'Jack-Welch' => ['jack-welch', 'Jack Welch'],
  'James-Cameron' => ['james-cameron', 'James Cameron'],
  'Jinsoo-An' => ['jinsoo-an', 'Jinsoo An'],
  'Jon-Udell' => ['jon-udell', 'Jon Udell'],
  'Kevin-Kelly' => ['kevin-kelly', 'Kevin Kelly'],
  'Marcus-Aurelius' => ['marcus-aurelius', 'Marcus Aurelius'],
  'Marie-Curie' => ['marie-curie', 'Marie Curie'],
  'Martin-Luther' => ['martin-luther', 'Martin Luther'],
  'Michael-Jordan' => ['michael-jordan', 'Michael Jordan'],
  'Oscar-Tschopp' => ['oscar-tschopp', 'Oscar Tschopp'],
  'Oscar-Wilde' => ['oscar-wilde', 'Oscar Wilde'],
  'Paul-Bowles' => ['paul-bowles', 'Paul Bowles'],
  'Pericles' => ['pericles', 'Pericles'],
  'Rabindranath-Tagore' => ['rabindranath-tagore', 'Rabindranath Tagore'],
  'Ray-Bradbury' => ['ray-bradbury', 'Ray Bradbury'],
  'Robert-Heinlein' => ['robert-heinlein', 'Robert Heinlein'],
  'Rudyard-Kipling' => ['rudyard-kipling', 'Rudyard Kipling'],
  'Søren-Kierkegaard' => ['soren-kierkegaard', 'Søren Kierkegaard'],
  'Stephen-Vincent-Benet' => ['stephen-vincent-benet', 'Stephen Vincent Benét'],
  'Steve-Jobs' => ['steve-jobs', 'Steve Jobs'],
  'Stewart-Brand' => ['stewart-brand', 'Stewart Brand'],
  'Stuart-Chase' => ['stuart-chase', 'Stuart Chase'],
  'Theodore-Roosevelt' => ['theodore-roosevelt', 'Theodore Roosevelt'],
  'Tom-Shippy' => ['tom-shippey', 'Tom Shippey'],
  'Upton-Sinclair' => ['upton-sinclair', 'Upton Sinclair'],
  'Warren-Buffet' => ['warren-buffett', 'Warren Buffett'],
  'William-Ernest-Henley' => ['william-ernest-henley', 'William Ernest Henley'],
  'William-Gibson' => ['william-gibson', 'William Gibson']
}.freeze

BLACKBERRY_FILENAME_TOKEN = 'Blackberry-PR'
BLACKBERRY_IMAGE = '/img/quotes/authors/blackberry-2014.webp'
BLACKBERRY_COMMONS_URL = 'https://commons.wikimedia.org/wiki/File:Blackberry_Logo.svg'

def yaml_string(value)
  JSON.generate(value)
end

def portrait_metadata(slug, subject)
  disclosure_url = 'https://tedt.org/profile/#ai-assistance-disclosure'
  {
    'image' => "/img/quotes/authors/#{slug}.webp",
    'image-alt' => "AI-generated photorealistic editorial portrait of #{subject}.",
    'image-artist' => 'Ted Tschopp with OpenAI image generation',
    'image-artist-URL' => disclosure_url,
    'image-credits' => 'AI-generated editorial portrait; not a documentary photograph.',
    'image-credits-URL' => disclosure_url,
    'image-credits-artist' => 'Ted Tschopp with OpenAI image generation',
    'image-credits-artist-URL' => disclosure_url,
    'image-credits-title' => "AI-generated editorial portrait of #{subject}; not a documentary photograph",
    'image-description' => "An AI-generated photorealistic editorial portrait of #{subject}; presented as an illustration rather than a documentary photograph.",
    'image-title' => "#{subject} — AI-generated editorial portrait",
    'image_width' => 1456,
    'image_height' => 816
  }
end

def blackberry_metadata
  {
    'image' => BLACKBERRY_IMAGE,
    'image-alt' => 'Historical BlackBerry wordmark and dotted-B logo in black on a white background.',
    'image-artist' => 'Research In Motion',
    'image-artist-URL' => 'https://www.blackberry.com/',
    'image-credits' => 'Historical BlackBerry logo, introduced in 2004 and in use during 2014. Public-domain simple geometry; trademark rights may apply.',
    'image-credits-URL' => BLACKBERRY_COMMONS_URL,
    'image-credits-artist' => 'Research In Motion',
    'image-credits-artist-URL' => BLACKBERRY_COMMONS_URL,
    'image-credits-title' => 'Historical BlackBerry logo used during 2014',
    'image-description' => 'The historical BlackBerry company wordmark and dotted-B symbol used during the period of the quoted press release.',
    'image-title' => 'BlackBerry wordmark used in 2014',
    'image_width' => 1456,
    'image_height' => 816
  }
end

def front_matter_match(content, path)
  match = content.match(/\A---\r?\n(?<front_matter>.*?)(?<before_close>\r?\n)---(?:\r?\n|\z)/m)
  raise "missing or malformed front matter: #{path.relative_path_from(ROOT)}" unless match

  match
end

def apply_metadata(content, path, metadata)
  match = front_matter_match(content, path)
  front_matter = match[:front_matter].dup
  newline = front_matter.include?("\r\n") ? "\r\n" : "\n"
  missing = []

  metadata.each do |key, value|
    rendered = value.is_a?(Integer) ? value.to_s : yaml_string(value)
    replacement = "#{key}: #{rendered}"
    pattern = /^#{Regexp.escape(key)}:[^\r\n]*$/
    if front_matter.match?(pattern)
      front_matter.sub!(pattern, replacement)
    else
      missing << replacement
    end
  end

  if missing.any?
    insertion = missing.join(newline)
    if front_matter.match?(/^image-title:[^\r\n]*$/)
      front_matter.sub!(/^image-title:[^\r\n]*$/) { |line| "#{line}#{newline}#{insertion}" }
    else
      front_matter = "#{front_matter}#{newline}#{insertion}"
    end
  end

  updated = content.dup
  updated[match.begin(:front_matter)...match.end(:front_matter)] = front_matter
  updated
end

targets = []

QUOTE_DIR.glob('*.md').sort.each do |path|
  matches = PORTRAITS.select { |token, _metadata| path.basename.to_s.include?(token) }
  is_blackberry = path.basename.to_s.include?(BLACKBERRY_FILENAME_TOKEN)
  next if matches.empty? && !is_blackberry

  if matches.length > 1 || (!matches.empty? && is_blackberry)
    abort "ERROR: ambiguous portrait mapping for #{path.relative_path_from(ROOT)}"
  end

  metadata = if is_blackberry
               blackberry_metadata
             else
               slug, subject = matches.values.first
               portrait_metadata(slug, subject)
             end
  targets << [path, metadata]
end

unless targets.length == EXPECTED_TARGET_COUNT
  abort "ERROR: selected #{targets.length} quote files; expected #{EXPECTED_TARGET_COUNT}"
end

missing_assets = targets.filter_map do |_path, metadata|
  asset = ROOT.join(metadata.fetch('image').delete_prefix('/'))
  metadata.fetch('image') unless asset.file?
end.uniq
unless missing_assets.empty?
  abort "ERROR: missing canonical image asset(s): #{missing_assets.join(', ')}"
end

pending = targets.filter_map do |path, metadata|
  content = path.read(encoding: 'UTF-8')
  updated = apply_metadata(content, path, metadata)
  [path, updated] unless updated == content
end

if ARGV.include?('--check')
  if pending.any?
    warn "ERROR: #{pending.length} quote portrait front matter file(s) are stale:"
    pending.each { |path, _updated| warn "- #{path.relative_path_from(ROOT)}" }
    exit 1
  end
  puts "OK: #{targets.length} quote portrait front matter files are current."
  exit 0
end

unknown_options = ARGV.reject { |argument| argument == '--check' }
abort "ERROR: unknown option(s): #{unknown_options.join(', ')}" unless unknown_options.empty?

pending.each { |path, updated| path.write(updated, mode: 'w', encoding: 'UTF-8') }
puts "Updated #{pending.length} of #{targets.length} targeted quote portrait front matter files."
