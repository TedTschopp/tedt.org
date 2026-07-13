#!/usr/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'fileutils'
require 'open3'
require 'tmpdir'

root = File.expand_path('..', __dir__)
script = File.join(root, 'scripts/analyze_search_console_performance.rb')
fixture = File.join(root, 'tests/fixtures/search-console-pages.csv')

Dir.mktmpdir('tedt-search-console-test') do |tmp|
  site = File.join(tmp, 'site')
  output = File.join(tmp, 'output')
  {
    'near-page-one' => ['A deliberately long visible title that benefits from a concise search title override | Ted Tschopp', 'A useful description for the near-page-one test page that clearly explains its subject.'],
    'page-two' => ['Page Two Opportunity | Ted Tschopp', 'A useful description for the page-two test page that clearly explains its subject.']
  }.each do |slug, (title, description)|
    directory = File.join(site, slug)
    FileUtils.mkdir_p(directory)
    File.write(File.join(directory, 'index.html'), <<~HTML)
      <!doctype html><html><head><title>#{title}</title><meta name="description" content="#{description}"></head><body><h1>#{title}</h1></body></html>
    HTML
  end

  command = [RbConfig.ruby, script, '--pages', fixture, '--site', site, '--output', output]
  stdout, stderr, status = Open3.capture3(*command)
  abort "Search Console analyzer failed:\n#{stdout}\n#{stderr}" unless status.success?

  rows = CSV.read(File.join(output, 'page-opportunities.csv'), headers: true)
  abort "Expected 2 analyzed rows, found #{rows.length}" unless rows.length == 2
  abort 'Expected the high-impression near-page-one URL to rank first' unless rows.first['url'].end_with?('/near-page-one/')
  abort 'Expected a near-page-one reason' unless rows.first['reasons'].include?('near-page-one')
  abort 'Expected the long title warning' unless rows.first['reasons'].include?('over 65 characters')
  abort 'Expected deterministic opportunity scoring' unless rows.first['opportunity_score'] == '1980.0'
  abort 'Expected percent CTR normalization' unless rows.first['ctr'] == '1.00%'
  abort 'Expected page-two URL normalization' unless rows[1]['url'] == 'https://tedt.org/page-two/'
  abort 'Expected a page-two reason' unless rows[1]['reasons'].include?('page-two')
  abort 'Expected contextual-link recommendation for page two' unless rows[1]['suggested_action'].include?('topic hub')
  abort 'Expected Markdown report' unless File.file?(File.join(output, 'page-opportunities.md'))

  malformed = File.join(tmp, 'missing-columns.csv')
  File.write(malformed, "Page,Clicks\n/near-page-one/,1\n")
  _bad_stdout, bad_stderr, bad_status = Open3.capture3(
    RbConfig.ruby, script, '--pages', malformed, '--site', site, '--output', File.join(tmp, 'bad-output')
  )
  abort 'Expected missing Search Console columns to fail' if bad_status.success?
  abort 'Expected a useful missing-column error' unless bad_stderr.include?('missing required Search Console column')
end

puts 'Search Console performance analyzer check passed.'
