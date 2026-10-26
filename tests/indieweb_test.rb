#!/usr/bin/env ruby
# frozen_string_literal: true
require 'tmpdir'
require 'liquid'
require 'open3'
require_relative '../_code/indieweb'

module IndieWebTests
  def assert(value, message = 'Assertion failed')
    raise message unless value
  end

  def equal(expected, actual)
    assert(expected == actual, "Expected #{expected.inspect}; got #{actual.inspect}")
  end

  def raises
    yield
    raise 'Expected IndieWeb::Error'
  rescue IndieWeb::Error
    true
  end

  class FakeHTTP
    attr_reader :requests
    def initialize(&block)
      @block, @requests = block, []
    end
    def request(url, **options)
      @requests << [url, options]
      @block.call(url, options)
    end
  end

  def response(body = '', headers = {}, status = 200, url = 'https://example.org/posts/one')
    IndieWeb::Response.new(body: body, headers: headers, status: status, url: url)
  end

  def manifest
    IndieWeb::Manifest.new('version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/Article/', 'aliases' => ['/2018/04/Article.html', '/2018/04/Article/'] }])
  end

  def mention(**values)
    { 'wm-id' => 100, 'wm-source' => 'https://brid.gy/comment/mastodon/account/status/reply',
      'wm-target' => 'https://www.tedt.org/2018/04/Article/', 'wm-private' => false,
      'wm-property' => 'in-reply-to', 'wm-received' => '2026-10-25T00:00:00Z',
      'content' => { 'text' => '<script>alert(1)</script>', 'html' => '<script>alert(1)</script>' },
      'author' => { 'name' => 'A Reader', 'url' => 'javascript:alert(1)' }, 'url' => 'javascript:alert(1)' }.merge(values.transform_keys(&:to_s))
  end

  def test_legacy_aliases_are_explicit_and_preserve_case
    equal('https://tedt.org/Article/', manifest.canonical('http://www.tedt.org/2018/04/Article.html'))
    equal(nil, manifest.canonical('https://tedt.org/article/'))
    equal(nil, manifest.canonical('https://attacker.example/Article/'))
    equal('https://tedt.org/Article/', manifest.canonical('https://tedt.org/Article/#section'))
  end

  def test_conflicting_aliases_fail_closed
    raises { IndieWeb::Manifest.new('version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/a/', 'aliases' => ['/b/'] }, { 'url' => 'https://tedt.org/b/' }]) }
  end

  def test_unicode_aliases_match_encoded_urls
    m = IndieWeb::Manifest.new('version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/Café/', 'aliases' => [] }])
    equal('https://tedt.org/Caf%C3%A9/', m.canonical('http://www.tedt.org/Café/'))
  end

  def test_unsafe_urls_and_private_networks_are_rejected
    ['javascript:alert(1)', 'https://name:password@example.org/', "https://example.org/\nnext", 'https://example.org/"bad'].each { |u| raises { IndieWeb.url(u) } }
    %w[127.0.0.1 10.0.0.1 169.254.169.254 192.168.1.1 ::1 ::ffff:127.0.0.1 fc00::1 2001:db8::1].each { |ip| assert(!IndieWeb::HTTP.public_address?(ip), ip) }
    assert(IndieWeb::HTTP.public_address?('8.8.8.8'))
    assert(IndieWeb::HTTP.public_address?('2606:4700:4700::1111'))
    raises { IndieWeb::HTTP.new.request('http://127.0.0.1/') }
  end

  def test_public_cache_discards_html_private_content_and_unsafe_links
    sync = IndieWeb::Mentions.new(manifest, {})
    cache, pending = sync.normalize([mention, mention, mention('wm-id': 101, 'wm-private': true), mention('wm-id': 102, 'wm-private': 'true'), mention('wm-id': 103, 'wm-private': nil)])
    rows = cache['by_target']['https://tedt.org/Article/']['replies']
    equal(1, rows.length)
    equal('<script>alert(1)</script>', rows.first['content'])
    equal(nil, rows.first['author']['url'])
    equal(rows.first['source'], rows.first['url'])
    assert(!JSON.generate(cache).include?('"html"'))
    equal([], pending)
  end

  def test_unfamiliar_sources_wait_even_if_author_claims_a_trusted_identity
    sync = IndieWeb::Mentions.new(manifest, {})
    cache, pending = sync.normalize([mention('wm-source': 'https://other.example/reply', 'author': { 'url' => 'https://brid.gy/' })])
    equal({}, cache['by_target'])
    equal(['100'], pending)
  end

  def test_moderation_approval_block_and_edit_removal
    unknown = mention('wm-source': 'https://other.example/reply')
    cache, = IndieWeb::Mentions.new(manifest, { 'approved_ids' => ['100'] }).normalize([unknown])
    equal(1, cache['by_target']['https://tedt.org/Article/']['replies'].length)
    cache, = IndieWeb::Mentions.new(manifest, { 'approved_ids' => ['100'], 'blocked_ids' => ['100'] }).normalize([unknown])
    equal({}, cache['by_target'])
    cache, = IndieWeb::Mentions.new(manifest, {}).normalize([mention('content': { 'text' => 'edited' })])
    equal('edited', cache['by_target']['https://tedt.org/Article/']['replies'].first['content'])
    cache, = IndieWeb::Mentions.new(manifest, {}).normalize([])
    equal({}, cache['by_target'])
  end

  def test_every_response_type_has_a_distinct_group
    rows = IndieWeb::Mentions::GROUPS.keys.each_with_index.map { |t, i| mention('wm-id': i + 1, 'wm-property': t, 'rsvp': 'yes') }
    cache, = IndieWeb::Mentions.new(manifest, {}).normalize(rows)
    equal(7, cache['by_target']['https://tedt.org/Article/'].values.sum(&:length))
    assert(cache['by_target']['https://tedt.org/Article/'].values.all? { |v| v.length == 1 })
  end

  def test_pagination_fetches_every_page_and_does_not_drop_records_after_thirty
    http = FakeHTTP.new do |u, _|
      page = URI.decode_www_form(URI(u).query).to_h.fetch('page').to_i
      children = (0...40).map { |i| mention('wm-id': page * 40 + i) }
      response(JSON.generate('children' => children, 'paging' => { 'total-pages' => 2 }))
    end
    rows = IndieWeb::Mentions.new(manifest, {}, http: http).fetch_pages([['target', 'https://tedt.org/Article/']])
    equal(80, rows.length)
    equal(2, http.requests.length)
  end

  def test_failed_pagination_retains_previous_cache
    Dir.mktmpdir do |dir|
      path = File.join(dir, 'mentions.json')
      File.write(path, 'previous cache')
      http = FakeHTTP.new { |_, _| response('{}', {}, 503) }
      raises do
        sync = IndieWeb::Mentions.new(manifest, {}, http: http)
        IndieWeb.write_json(path, sync.normalize(sync.fetch_all).first)
      end
      equal('previous cache', File.read(path))
    end
  end

  def test_endpoint_header_precedence_and_relative_resolution
    http = FakeHTTP.new { |_, _| response('<link rel="webmention" href="/wrong">', { 'link' => ['</receiver?mode=webmention>; rel="alternate webmention"'], 'content-type' => ['text/html'] }) }
    equal('https://example.org/receiver?mode=webmention', IndieWeb::Sender.new(http: http).endpoint('https://example.org/posts/one'))
  end

  def test_header_quoted_commas_semicolons_and_multiple_fields
    http = FakeHTTP.new { |_, _| response('', { 'link' => ['</wrong>; title="a, <b>; rel=webmention", </right>; title="x,y"; REL=webmention'] }) }
    equal('https://example.org/right', IndieWeb::Sender.new(http: http).endpoint('https://example.org/posts/one'))
  end

  def test_html_discovery_document_order_ignores_comments_and_false_rel
    body = '<!-- <link rel="webmention" href="/comment"> --><link rel="not-webmention" href="/wrong"><a rel="webmention alternate" href="../first">wm</a><link rel="webmention" href="/second">'
    http = FakeHTTP.new { |_, _| response(body, { 'content-type' => ['text/html; charset=utf-8'] }) }
    equal('https://example.org/first', IndieWeb::Sender.new(http: http).endpoint('https://example.org/posts/one'))
  end

  def test_empty_href_is_valid_missing_href_is_skipped
    http = FakeHTTP.new { |_, _| response('<link rel="webmention"><a rel="webmention" href="">wm</a>', { 'content-type' => ['text/html'] }) }
    equal('https://example.org/posts/one', IndieWeb::Sender.new(http: http).endpoint('https://example.org/posts/one'))
  end

  def test_delivery_preserves_query_and_accepts_every_2xx_without_claiming_verified
    [200, 201, 202, 204, 299].each do |status|
      http = FakeHTTP.new do |_, options|
        options[:method] == 'POST' ? response('', {}, status) : response('', { 'link' => ['</receiver?key=abc>; rel=webmention'] })
      end
      result = IndieWeb::Sender.new(http: http).deliver('https://tedt.org/Article/', 'https://example.org/posts/one')
      equal('accepted', result['state'])
      equal('https://example.org/receiver?key=abc', http.requests.last[0])
      equal({ 'source' => 'https://tedt.org/Article/', 'target' => 'https://example.org/posts/one' }, http.requests.last[1][:form])
    end
  end

  def test_delivery_prefers_api_acknowledgements_over_browser_redirects
    http = FakeHTTP.new do |_, options|
      if options[:method] == 'POST'
        accepted_types = options.fetch(:headers, {}).fetch('Accept', 'text/html')
        accepted_types.include?('text/html') ? response('', { 'location' => ['/status'] }, 303) : response('', {}, 201)
      else
        response('', { 'link' => ['</receiver>; rel=webmention'] })
      end
    end
    result = IndieWeb::Sender.new(http: http).deliver('https://tedt.org/Article/', 'https://example.org/post')
    equal('accepted', result['state'])
    equal(201, result['status'])
    assert(!http.requests.first[1].key?(:headers), 'Discovery should retain its HTML preference')
  end

  def test_invalid_receipt_location_does_not_turn_acceptance_into_a_retry
    http = FakeHTTP.new do |_, options|
      options[:method] == 'POST' ? response('', { 'location' => ['javascript:alert(1)'] }, 201) : response('', { 'link' => ['</receiver>; rel=webmention'] })
    end
    result = IndieWeb::Sender.new(http: http).deliver('https://tedt.org/Article/', 'https://example.org/post')
    equal('accepted', result['state'])
    assert(!result.key?('receipt'))
  end

  def test_deleted_source_is_notified_only_after_a_410_and_then_remains_idempotent
    src, target = 'https://tedt.org/Article/', 'https://example.org/post'
    http = FakeHTTP.new do |u, options|
      if u == src then response('', {}, 410)
      elsif options[:method] == 'POST' then response('', {}, 202)
      else response('', { 'link' => ['</receiver>; rel=webmention'] })
      end
    end
    sender = IndieWeb::Sender.new(http: http)
    state = sender.reconcile({}, { src => { 'fingerprint' => 'old', 'targets' => [target] } })
    state = sender.run(state, {})
    equal('accepted', state['sources'][src]['deliveries'][target]['state'])
    equal({ 'source' => src, 'target' => target }, http.requests.last[1][:form])
    count = http.requests.length
    sender.run(state, {})
    equal(count, http.requests.length)
  end

  def test_static_pages_404_deletion_withdraws_the_previous_targets
    source, target = 'https://tedt.org/updates/deleted/', 'https://example.org/post'
    http = FakeHTTP.new do |url, options|
      if url == source then response('', {}, 404)
      elsif options[:method] == 'POST' then response('', {}, 202)
      else response('', { 'link' => ['</receiver>; rel=webmention'] })
      end
    end
    sender = IndieWeb::Sender.new(http: http)
    state = sender.reconcile({}, { source => { 'fingerprint' => 'old', 'targets' => [target] } })
    result = sender.run(state, {})
    equal('accepted', result['sources'][source]['deliveries'][target]['state'])
    equal({ 'source' => source, 'target' => target }, http.requests.last[1][:form])
  end

  def test_media_downloads_are_enclosures_and_interaction_links_remain_targets
    doc = Nokogiri::HTML('<main class="h-entry"><div class="e-content"><a class="u-in-reply-to" href="https://example.org/post">Reply</a><audio src="https://media.tedt.org/audio.wav"><a rel="enclosure" href="https://media.tedt.org/audio.wav">Download</a></audio></div></main>')
    state = IndieWeb::Sender.new.content_state(doc, 'https://tedt.org/updates/post/')
    equal(['https://example.org/post'], state['targets'])
  end

  def test_initial_activation_baselines_without_sending_history
    http = FakeHTTP.new { raise 'No network expected' }
    state = IndieWeb::Sender.new(http: http).run({}, { 'https://tedt.org/Article/' => { 'fingerprint' => 'one', 'targets' => ['https://example.org/'] } })
    equal({}, state['sources']['https://tedt.org/Article/']['deliveries'])
    equal([], http.requests)
  end

  def test_updates_retain_removed_targets_across_consecutive_edits
    sender = IndieWeb::Sender.new
    src = 'https://tedt.org/Article/'
    one = { src => { 'fingerprint' => '1', 'targets' => ['https://example.org/old'] } }
    state = sender.reconcile({}, one)
    state = sender.reconcile(state, { src => { 'fingerprint' => '2', 'targets' => ['https://example.org/new'] } })
    state = sender.reconcile(state, { src => { 'fingerprint' => '3', 'targets' => ['https://example.org/third'] } })
    equal(3, state['sources'][src]['deliveries'].length)
    state = sender.reconcile(state, {})
    equal('deleted', state['sources'][src]['fingerprint'])
    equal(3, state['sources'][src]['deliveries'].length)
  end

  def test_stale_deployment_does_not_send
    http = FakeHTTP.new { |_, _| response('<article class="h-entry"><div class="e-content">old</div></article>') }
    sender = IndieWeb::Sender.new(http: http)
    src = 'https://tedt.org/Article/'
    state = sender.reconcile({}, { src => { 'fingerprint' => 'old', 'targets' => [] } })
    sender.run(state, { src => { 'fingerprint' => 'new', 'targets' => ['https://example.org/'] } })
    equal(1, http.requests.length)
    assert(http.requests.none? { |_, o| o[:method] == 'POST' })
  end

  def test_retries_are_bounded_and_accepted_pairs_are_not_resent
    content = '<a href="https://example.org/">new</a>'
    body = '<article class="h-entry"><div class="e-content">' + content + '</div></article>'
    src = 'https://tedt.org/Article/'
    http = FakeHTTP.new do |url, options|
      if url == src then response(body)
      elsif options[:method] == 'POST' then response('', {}, 503)
      else response('', { 'link' => ['</receiver>; rel=webmention'] })
      end
    end
    sender = IndieWeb::Sender.new(http: http)
    state = sender.reconcile({}, { src => { 'fingerprint' => 'old', 'targets' => [] } })
    snapshot = { src => { 'fingerprint' => Digest::SHA256.hexdigest(content), 'targets' => ['https://example.org/'] } }
    now = Time.utc(2026, 10, 25)
    state = sender.run(state, snapshot, now: now)
    equal('retry', state['sources'][src]['deliveries'].values.first['state'])
    count = http.requests.length
    sender.run(state, snapshot, now: now + 10)
    equal(count, http.requests.length)
    state['sources'][src]['deliveries'].values.first['state'] = 'accepted'
    sender.run(state, snapshot, now: now + 7200)
    equal(count, http.requests.length)
  end
  def test_outgoing_targets_preserve_fragments_for_exact_receiver_verification
    doc = Nokogiri::HTML('<article class="h-entry"><div class="e-content"><a href="https://reader.example/post#comment">Reply</a><a href="/Article/#section">Self</a></div></article>')
    state = IndieWeb::Sender.new.content_state(doc, 'https://tedt.org/Article/')
    equal(['https://reader.example/post#comment'], state['targets'])
  end

  def test_trusted_origin_policy_includes_nondefault_ports
    sync = IndieWeb::Mentions.new(manifest, { 'trusted_origins' => ['https://friend.example'] })
    assert(sync.trusted?('https://friend.example/reply'))
    assert(!sync.trusted?('https://friend.example:8443/reply'))
    assert(!sync.trusted?('https://brid.gy:8443/comment/example/reply'))
  end

  def test_unicode_build_paths_and_encoded_traversal
    Dir.mktmpdir do |dir|
      FileUtils.mkdir_p(File.join(dir, 'Café'))
      File.write(File.join(dir, 'Café/index.html'), '<article class="h-entry"><div class="e-content">A café.</div></article>')
      equal(File.join(dir, 'Café/index.html'), IndieWeb.site_file(dir, 'https://tedt.org/Caf%C3%A9/'))
      m = IndieWeb::Manifest.new('version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/Caf%C3%A9/' }])
      equal('no-targets', IndieWeb::Sender.new.snapshot(dir, m).values.first['fingerprint'])
      raises { IndieWeb.site_file(dir, 'https://tedt.org/%2E%2E/private') }
      raises { IndieWeb.site_file(dir, 'https://tedt.org/%00') }
    end
  end

  def test_archive_snapshot_uses_only_complete_canonical_article_data
    Dir.mktmpdir do |dir|
      path = File.join(dir, 'pages.jsonl')
      header = { 'manifest' => { 'version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/Article/' }] } }
      content = '<article class="h-entry"><div class="e-content"><a href="https://reader.example/post#reply">Reply</a></div></article>'
      rows = [header, { 'path' => '../../_code/indieweb.rb', 'body' => ['hostile'].pack('m0') }, { 'path' => 'Article/index.html', 'body' => [content].pack('m0') }]
      File.write(path, rows.map { |row| JSON.generate(row) }.join("\n"))
      result = IndieWeb::Sender.new.snapshot_stream(path)
      equal(['https://tedt.org/Article/'], result.keys)
      equal(['https://reader.example/post#reply'], result.values.first['targets'])
      File.write(path, JSON.generate(header) + "\n")
      raises { IndieWeb::Sender.new.snapshot_stream(path) }
    end
  end

  def test_archive_snapshot_rejects_duplicate_article_entries
    Dir.mktmpdir do |dir|
      path = File.join(dir, 'pages.jsonl')
      header = { 'manifest' => { 'version' => 1, 'entries' => [{ 'url' => 'https://tedt.org/Article/' }] } }
      row = { 'path' => 'Article/index.html', 'body' => ['<article class="h-entry"><div class="e-content">Text</div></article>'].pack('m0') }
      File.write(path, [header, row, row].map { |r| JSON.generate(r) }.join("\n"))
      raises { IndieWeb::Sender.new.snapshot_stream(path) }
    end
  end

  def test_receipts_use_a_separate_branch_preserve_main_and_reject_concurrent_writers
    script = File.expand_path('../_code/webmention_state.sh', __dir__)
    Dir.mktmpdir do |dir|
      remote, checkout = File.join(dir, 'remote.git'), File.join(dir, 'checkout')
      FileUtils.mkdir_p(checkout)
      command = lambda do |*args|
        output, error, status = Open3.capture3(*args, chdir: checkout)
        raise "#{args.first} failed: #{error}" unless status.success?
        output.strip
      end
      command.call('git', 'init', '--bare', remote)
      command.call('git', 'init', '-b', 'main')
      command.call('git', 'config', 'user.name', 'Test')
      command.call('git', 'config', 'user.email', 'test@example.org')
      command.call('git', 'remote', 'add', 'origin', remote)
      File.write(File.join(checkout, 'README'), 'Website branch')
      command.call('git', 'add', 'README')
      command.call('git', 'commit', '-m', 'Website baseline')
      command.call('git', 'push', 'origin', 'main')
      main_head = command.call('git', 'rev-parse', 'HEAD')
      command.call('bash', script, 'load')
      state = File.join(checkout, 'cache/webmention-outbox.json')
      IndieWeb.write_json(state, { 'version' => 1, 'sources' => {} })
      command.call('bash', script, 'save')
      equal(main_head, command.call('git', 'rev-parse', 'HEAD'))
      equal(main_head, command.call('git', 'rev-parse', 'origin/main'))
      command.call('bash', script, 'load')
      saved = command.call('git', 'rev-parse', 'FETCH_HEAD')
      equal('webmention-outbox.json', command.call('git', 'ls-tree', '--name-only', saved))
      assert(command.call('bash', script, 'save').include?('unchanged'))
      # Simulate another writer after loading. The stale save must fail.
      tree = command.call('git', 'rev-parse', "#{saved}^{tree}")
      competing = command.call('git', 'commit-tree', tree, '-p', saved, '-m', 'Concurrent writer')
      command.call('git', 'push', 'origin', "#{competing}:refs/heads/indieweb-state")
      IndieWeb.write_json(state, { 'version' => 1, 'sources' => {}, 'changed' => true })
      _, _, status = Open3.capture3('bash', script, 'save', chdir: checkout)
      assert(!status.success?, 'Stale state must not overwrite another writer')
      equal(competing, command.call('git', 'ls-remote', 'origin', 'refs/heads/indieweb-state').split.first)
      # A failed fetch must preserve local state rather than resetting the baseline.
      previous = File.read(state)
      command.call('git', 'remote', 'set-url', 'origin', File.join(dir, 'missing.git'))
      _, _, status = Open3.capture3('bash', script, 'load', chdir: checkout)
      assert(!status.success?)
      equal(previous, File.read(state))
    end
  end

  def test_rendered_responses_escape_untrusted_html_in_names_and_text
    record = mention('author': { 'name' => '<img src=x onerror=alert(1)>' })
    cache, = IndieWeb::Mentions.new(manifest, {}).normalize([record])
    # Exercise the actual include. Absolute targets are supplied directly so
    # this test does not need a full Jekyll build or mock its URL filters.
    template = Liquid::Template.parse(File.read(File.expand_path('../_includes/social/comments-webmentions.html', __dir__)))
    html = template.render!('include' => { 'target_path' => 'https://tedt.org/Article/' }, 'page' => {}, 'site' => { 'data' => { 'webmentions' => cache } })
    doc = Nokogiri::HTML.fragment(html)
    assert(!doc.at_css('#webmention-100 script, #webmention-100 img'))
    equal('<script>alert(1)</script>', doc.at_css('#webmention-100 .webmention-text').text)
    equal('<img src=x onerror=alert(1)>', doc.at_css('#webmention-100 p a').text)
  end
end

runner = Object.new.extend(IndieWebTests)
failures = []
IndieWebTests.instance_methods(false).grep(/^test_/).sort.each do |name|
  begin
    runner.public_send(name)
    puts "PASS #{name}"
  rescue StandardError => e
    failures << name
    STDERR.puts "FAIL #{name}: #{e.message}\n#{e.backtrace.first(3).join("\n")}"
  end
end
abort "#{failures.length} IndieWeb tests failed" unless failures.empty?
puts 'All IndieWeb protocol, moderation, and lifecycle tests passed.'
