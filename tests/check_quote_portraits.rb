#!/usr/bin/env ruby
# frozen_string_literal: true

require 'nokogiri'
require 'pathname'
require 'uri'
require 'yaml'

ROOT = Pathname.new(__dir__).parent
QUOTES_DIR = ROOT.join('_posts/Quotes')
SITE_DIR = if ARGV[0]
             Pathname.new(ARGV[0])
           elsif ENV['JEKYLL_DESTINATION'] && !ENV['JEKYLL_DESTINATION'].empty?
             Pathname.new(ENV.fetch('JEKYLL_DESTINATION'))
           end

PORTRAIT_BY_AUTHOR = {
  'Al Swearengen' => 'al-swearengen',
  'Alfred A. Montapert' => 'alfred-a-montapert',
  'Anton Ego' => 'brad-bird',
  'Bill Gates' => 'bill-gates',
  'Blackberry PR' => 'blackberry-2014',
  'C.S. Lewis' => 'cs-lewis',
  'Charlie Brooker and Konnie Huq' => 'charlie-brooker-and-konnie-huq',
  'Clay Christensen' => 'clay-christensen',
  'Dorothy Sayers' => 'dorothy-sayers',
  'Edward Castronova' => 'edward-castronova',
  'Eric Hoffer' => 'eric-hoffer',
  'Eric Shinseki' => 'eric-shinseki',
  'G.K. Chesterton' => 'gk-chesterton',
  'Gandalf (character, written by J.R.R. Tolkien)' => 'jrr-tolkien',
  'Henry Ford' => 'henry-ford',
  'Hippocrates' => 'hippocrates',
  'Horace Dediu' => 'horace-dediu',
  'J.R.R. Tolkien' => 'jrr-tolkien',
  'Jack Welch' => 'jack-welch',
  'James Cameron' => 'james-cameron',
  'Jinsoo An' => 'jinsoo-an',
  'Jon Udell' => 'jon-udell',
  'Kevin Kelly' => 'kevin-kelly',
  'Marcus Aurelius' => 'marcus-aurelius',
  'Marie Curie' => 'marie-curie',
  'Martin Luther' => 'martin-luther',
  'Michael Jordan' => 'michael-jordan',
  'Oscar Tschopp' => 'oscar-tschopp',
  'Oscar Wilde' => 'oscar-wilde',
  'Paul Bowles' => 'paul-bowles',
  'Pericles' => 'pericles',
  'Rabindranath Tagore' => 'rabindranath-tagore',
  'Ray Bradbury' => 'ray-bradbury',
  'Robert Heinlein' => 'robert-heinlein',
  'Rudyard Kipling' => 'rudyard-kipling',
  'Stephen Vincent Benét' => 'stephen-vincent-benet',
  'Steve Jobs' => 'steve-jobs',
  'Stewart Brand' => 'stewart-brand',
  'Stuart Chase' => 'stuart-chase',
  'Søren Kierkegaard' => 'soren-kierkegaard',
  'Theodore Roosevelt' => 'theodore-roosevelt',
  'Tom Shippey' => 'tom-shippey',
  'Upton Sinclair' => 'upton-sinclair',
  'Warren Buffett' => 'warren-buffett',
  'William Ernest Henley' => 'william-ernest-henley',
  'William Gibson' => 'william-gibson'
}.freeze

EXPECTED_NON_TARGET_AUTHORS = ['Karl Kraus', 'Samuel Johnson', 'Sextus Empiricus'].freeze
EXPECTED_TARGET_FILES = 72
EXPECTED_PORTRAITS = 45
EXPECTED_WIDTH = 1456
EXPECTED_HEIGHT = 816
BLACKBERRY_IMAGE = '/img/quotes/authors/blackberry-2014.webp'
AI_DISCLOSURES = ['AI-generated editorial portrait', 'not a documentary photograph'].freeze
BLACKBERRY_DISCLOSURES = [
  'historical BlackBerry logo',
  'public-domain simple geometry',
  'trademark rights may apply'
].freeze

errors = []

def front_matter(path)
  source = path.read
  match = source.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)/m)
  raise "missing YAML front matter" unless match

  YAML.unsafe_load(match[1]) || {}
rescue StandardError => e
  raise "cannot parse front matter: #{e.message}"
end

def author_name(data)
  author = data['author']
  author.is_a?(Hash) ? author['name'].to_s.strip : author.to_s.strip
end

def image_metadata_text(data)
  data.each_with_object([]) do |(key, value), values|
    next unless key.to_s.match?(/\Aimage-(?:artist|credits|description|title)/i)

    if value.is_a?(Hash)
      values.concat(value.values.map(&:to_s))
    elsif value.is_a?(Array)
      values.concat(value.map(&:to_s))
    else
      values << value.to_s
    end
  end.join(' ')
end

def normalized_url_path(value)
  return '' if value.nil? || value.to_s.strip.empty?

  raw = value.to_s.strip
  path = if raw.match?(%r{\Ahttps?://}i)
           URI.parse(raw.gsub(' ', '%20')).path
         else
           raw.split(/[?#]/, 2).first
         end
  path = "/#{path}" unless path.start_with?('/')
  URI::DEFAULT_PARSER.unescape(path)
rescue URI::InvalidURIError
  raw
end

def rendered_path(site_dir, source_path)
  slug = source_path.basename('.md').to_s.sub(/\A\d{4}-\d{2}-\d{2}-/, '')
  slug = slug.gsub(':-', '-').tr(':', '-')
  site_dir.join(slug, 'index.html')
end

source_files = QUOTES_DIR.glob('*.md').sort
targets = []
non_target_authors = []

source_files.each do |path|
  begin
    data = front_matter(path)
  rescue StandardError => e
    errors << "#{path.relative_path_from(ROOT)}: #{e.message}"
    next
  end

  author = author_name(data)
  portrait_slug = PORTRAIT_BY_AUTHOR[author]
  unless portrait_slug
    non_target_authors << author
    next
  end

  expected_image = "/img/quotes/authors/#{portrait_slug}.webp"
  targets << { path: path, data: data, author: author, image: expected_image }
  label = path.relative_path_from(ROOT)

  errors << "#{label}: expected image #{expected_image.inspect}, found #{data['image'].inspect}" unless data['image'] == expected_image
  errors << "#{label}: image_width must be #{EXPECTED_WIDTH}" unless data['image_width'].to_i == EXPECTED_WIDTH
  errors << "#{label}: image_height must be #{EXPECTED_HEIGHT}" unless data['image_height'].to_i == EXPECTED_HEIGHT
  errors << "#{label}: image-alt must be nonblank" if data['image-alt'].to_s.strip.empty?

  metadata_text = image_metadata_text(data)
  if expected_image == BLACKBERRY_IMAGE
    commons_url = data.values.flatten.compact.map(&:to_s).find do |value|
      value == 'https://commons.wikimedia.org/wiki/File:Blackberry_Logo.svg'
    end
    errors << "#{label}: BlackBerry credit must reference the canonical Wikimedia Commons file" unless commons_url
    BLACKBERRY_DISCLOSURES.each do |phrase|
      errors << "#{label}: BlackBerry credit is missing #{phrase.inspect}" unless metadata_text.downcase.include?(phrase.downcase)
    end
  else
    AI_DISCLOSURES.each do |phrase|
      errors << "#{label}: portrait disclosure is missing #{phrase.inspect}" unless metadata_text.downcase.include?(phrase.downcase)
    end
  end

  original = ROOT.join(expected_image.delete_prefix('/'))
  errors << "#{label}: missing canonical portrait #{original.relative_path_from(ROOT)}" unless original.file?
end

if targets.length != EXPECTED_TARGET_FILES
  errors << "expected #{EXPECTED_TARGET_FILES} target quote files, found #{targets.length}"
end

portrait_paths = targets.map { |target| target[:image] }.uniq.sort
if portrait_paths.length != EXPECTED_PORTRAITS
  errors << "expected #{EXPECTED_PORTRAITS} canonical portrait paths, found #{portrait_paths.length}"
end

unless non_target_authors.sort == EXPECTED_NON_TARGET_AUTHORS.sort
  errors << "expected only non-target authors #{EXPECTED_NON_TARGET_AUTHORS.sort.inspect}, found #{non_target_authors.sort.inspect}"
end

if SITE_DIR
  errors << "built site directory does not exist: #{SITE_DIR}" unless SITE_DIR.directory?

  if SITE_DIR.directory?
    targets.each do |target|
      # Jekyll does not publish post files that lack a YYYY-MM-DD filename
      # prefix. They remain covered by the source/front-matter assertions.
      next unless target[:path].basename.to_s.match?(/\A\d{4}-\d{2}-\d{2}-/)

      page = rendered_path(SITE_DIR, target[:path])
      label = target[:path].relative_path_from(ROOT)
      unless page.file?
        errors << "#{label}: rendered page is missing at #{page}"
        next
      end

      document = Nokogiri::HTML(page.read)
      expected_image = target[:image]
      portrait_images = document.css('img[fetchpriority="high"]').select do |image|
        normalized_url_path(image['src']) == expected_image
      end

      if portrait_images.length != 1
        errors << "#{label}: expected one rendered portrait image for #{expected_image}, found #{portrait_images.length}"
        next if portrait_images.empty?
      end

      portrait = portrait_images.first
      errors << "#{label}: portrait width must be #{EXPECTED_WIDTH}" unless portrait['width'].to_i == EXPECTED_WIDTH
      errors << "#{label}: portrait height must be #{EXPECTED_HEIGHT}" unless portrait['height'].to_i == EXPECTED_HEIGHT
      errors << "#{label}: portrait is missing srcset" if portrait['srcset'].to_s.strip.empty?
      errors << "#{label}: portrait is missing sizes" if portrait['sizes'].to_s.strip.empty?
      errors << "#{label}: portrait must use fetchpriority=high" unless portrait['fetchpriority'] == 'high'
      errors << "#{label}: high-priority portrait must load eagerly" unless portrait['loading'] == 'eager'
      errors << "#{label}: portrait must use decoding=async" unless portrait['decoding'] == 'async'

      [480, 768, 1200, 1456].each do |width|
        unless portrait['srcset'].to_s.match?(/(?:\A|,\s*)\S+\s+#{width}w(?:,|\z)/)
          errors << "#{label}: portrait srcset is missing the #{width}w candidate"
        end
      end

      high_priority = document.css('img[fetchpriority="high"]')
      errors << "#{label}: expected exactly one high-priority image, found #{high_priority.length}" unless high_priority.length == 1

      og_images = document.css('meta[property="og:image"]').map { |node| normalized_url_path(node['content']) }
      errors << "#{label}: og:image does not match #{expected_image}" unless og_images == [expected_image]
    end
  end
end

if errors.any?
  warn "Quote portrait check failed with #{errors.length} error(s):"
  errors.first(100).each { |error| warn "- #{error}" }
  warn "- ... #{errors.length - 100} more" if errors.length > 100
  exit 1
end

rendered_summary = SITE_DIR ? " and rendered pages in #{SITE_DIR}" : ''
puts "Quote portrait check passed: #{targets.length} source pages, " \
     "#{portrait_paths.length} canonical portraits#{rendered_summary}."
