#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "digest"
require "find"
require "json"
require "stringio"
require "tmpdir"
require "yaml"

require_relative "../_code/substack/bridge"
require_relative "../_code/substack/cli"

class SubstackBridgeChecks
  NOW = Time.iso8601("2026-08-16T10:00:00-07:00")
  ACTIVATED_AT = "2026-08-01T00:00:00-07:00"

  class CapturingValidator
    attr_reader :urls

    def validate!(urls)
      @urls ||= []
      @urls.concat(urls)
      true
    end
  end

  class FakeAdapter < TedT::Substack::Adapter
    attr_reader :calls
    attr_accessor :ambiguous, :release_response, :remote_revision

    def initialize
      @calls = []
      @ambiguous = false
      @release_response = nil
      @remote_content_hash = nil
      @remote_revision = "r1"
      @remote_slug = "valid"
      @remote_url = "https://example.substack.com/p/valid"
      @remote_web_status = "not_published"
    end

    def upsert_draft(payload:, remote_draft_id:, expected_revision:, idempotency_key:)
      calls << ["upsert_draft", payload["source_id"], remote_draft_id, expected_revision, idempotency_key]
      @remote_content_hash = payload["content_hash"] || TedT::Substack::Util.content_hash(payload)
      @remote_revision = "r1"
      {
        "draft_id" => remote_draft_id || "draft-1",
        "revision" => remote_revision,
        "content_hash" => @remote_content_hash
      }
    end

    def publish_or_schedule(remote_draft_id:, delivery:, publish_at:, idempotency_key:)
      calls << ["publish_or_schedule", remote_draft_id, delivery, publish_at, idempotency_key]
      raise TedT::Substack::AmbiguousDeliveryError if ambiguous
      return release_response unless release_response.nil?

      @remote_revision = "r2"
      @remote_web_status = publish_at ? "scheduled" : (delivery["web"] ? "published" : "not_published")

      {
        "post_id" => "post-1",
        "url" => @remote_url,
        "revision" => remote_revision,
        "slug" => @remote_slug,
        "web_published" => delivery["web"],
        "email_request_accepted" => delivery["email"],
        "scheduled" => !publish_at.nil?
      }
    end

    def get_post(remote_post_id: nil, remote_draft_id: nil)
      remote_id = remote_post_id || remote_draft_id
      calls << ["get_post", remote_id]
      {
        "post_id" => remote_post_id,
        "draft_id" => remote_draft_id,
        "revision" => remote_revision,
        "content_hash" => @remote_content_hash,
        "url" => @remote_url,
        "slug" => @remote_slug,
        "web_status" => @remote_web_status
      }
    end

    def update_web_post(remote_post_id:, payload:, expected_revision:, idempotency_key:)
      calls << ["update_web_post", remote_post_id, payload, expected_revision, idempotency_key]
      @remote_content_hash = payload["content_hash"] || TedT::Substack::Util.content_hash(payload)
      @remote_revision = "r2"
      @remote_web_status = "published"
      { "post_id" => remote_post_id, "revision" => remote_revision, "content_hash" => @remote_content_hash }
    end
  end

  def initialize
    @passed = 0
    @failed = []
  end

  def run
    check("front matter is opt-in and defaults audience") { check_opt_in_defaults }
    check("required delivery fields use strict booleans") { check_delivery_validation }
    check("duplicate YAML keys fail closed") { check_duplicate_yaml_keys }
    check("legacy non-opted duplicate keys do not block preparation") { check_legacy_duplicate_keys }
    check("Substack YAML aliases fail closed") { check_substack_yaml_aliases }
    check("IDs are unique and URL-safe") { check_id_validation }
    check("paid audiences acknowledge the public source") { check_paid_acknowledgement }
    check("schedules require offsets and respect three calendar months") { check_schedules }
    check("unquoted YAML timestamps normalize to ISO-8601") { check_unquoted_schedule_timestamp }
    check("draft, unpublished, and future posts are excluded") { check_eligibility }
    check("rich Markdown renders without site-only modules") { check_rich_rendering }
    check("missing Liquid variables fail closed") { check_strict_liquid_variables }
    check("Liquid-looking code stays literal and Jekyll-only tags fail closed") { check_liquid_code_and_tags }
    check("Jekyll output extension tokens resolve canonically") { check_canonical_output_extension }
    check("URL encoding, query, and fragment survive rendering") { check_url_component_preservation }
    check("root-relative heroes remain rooted at the site origin") { check_root_relative_hero }
    check("only exact CTA class tokens are removed") { check_exact_cta_class_removal }
    check("scripts, embeds, and event handlers fail closed") { check_unsafe_markup }
    check("paywall markers split paid content deterministically") { check_paywall }
    check("missing image assets and alt text fail closed") { check_assets }
    check("payload hashes ignore source paths and SHAs") { check_hash_and_rename_idempotency }
    check("image-bearing path renames keep a stable payload hash") { check_image_rename_idempotency }
    check("simultaneous path and ID renames fail closed") { check_path_and_id_rename }
    check("durable drafts resume release after interruption") { check_drafted_resume }
    check("web corrections strip email from the adapter payload") { check_correction_transport_delivery }
    check("email-only corrections require manual disposition") { check_email_only_correction }
    check("historical posts require explicit web-only backfill") { check_backfill }
    check("backfill never republishes an already tracked post") { check_tracked_backfill }
    check("ledger versions and JSON are validated") { check_ledger_validation }
    check("ledger entry schemas fail closed") { check_strict_ledger_entries }
    check("remote IDs are unique across ledger entries") { check_duplicate_remote_ids }
    check("email intent is durable and cannot be retried") { check_email_intent }
    check("manual records validate publication host and state") { check_manual_record }
    check("manual email evidence cannot regress") { check_manual_email_monotonicity }
    check("the production adapter is unavailable before network access") { check_unavailable_adapter }
    check("ambiguous email outcomes become unknown") { check_ambiguous_delivery }
    check("malformed post-send responses also become unknown") { check_malformed_email_response }
    check("incomplete adapter responses fail closed") { check_incomplete_adapter_response }
    check("draft drift blocks overwriting a manually edited draft") { check_draft_drift }
    check("remote drift blocks a web correction") { check_remote_drift }
    check("packages contain verified artifacts and checksums") { check_package_artifacts }
    check("package output cannot replace the source repository") { check_package_output_safety }
    check("package metadata matches its normalized payload") { check_package_cross_fields }
    check("package verification accepts its bound ledger and publication") { check_package_binding_success }
    check("package verification rejects a changed current ledger") { check_package_current_ledger_binding }
    check("package verification rejects another publication") { check_package_publication_binding }
    check("prepare needs no credential and publish fails without mutation") { check_cli_fail_closed }
    check("disabled or deleted sources produce disposition alerts") { check_deleted_source_alert }
    check("repository wiring keeps state private and credentials isolated") { check_repository_wiring }

    if @failed.empty?
      puts "PASS: #{@passed} Substack bridge checks"
      return 0
    end

    warn "FAIL: #{@failed.length} of #{@passed + @failed.length} Substack bridge checks"
    @failed.each { |failure| warn "- #{failure}" }
    1
  end

  private

  def check(name)
    yield
    @passed += 1
    puts "PASS: #{name}"
  rescue StandardError => error
    @failed << "#{name}: #{error.class}: #{error.message}"
  end

  def assert(value, message = "assertion failed")
    raise message unless value
  end

  def assert_equal(expected, actual, message = nil)
    return if expected == actual

    raise(message || "expected #{expected.inspect}, got #{actual.inspect}")
  end

  def assert_includes(value, expected, message = nil)
    return if value.include?(expected)

    raise(message || "expected #{value.inspect} to include #{expected.inspect}")
  end

  def assert_error(code)
    yield
    raise "expected error #{code}"
  rescue TedT::Substack::BridgeError, TedT::Substack::AdapterError => error
    assert_equal(code, error.code)
    error
  end

  def with_repo(activated_at: ACTIVATED_AT)
    Dir.mktmpdir("substack-bridge-test") do |root|
      FileUtils.mkdir_p(File.join(root, "_posts", "AI"))
      FileUtils.mkdir_p(File.join(root, "cache"))
      File.write(
        File.join(root, "_config.yml"),
        <<~YAML
          url: https://tedt.org
          permalink: /:title/
          markdown: kramdown
          kramdown:
            input: GFM
            parse_block_html: true
        YAML
      )
      ledger_data = {
        "schema_version" => 1,
        "activated_at" => activated_at,
        "publication_url" => nil,
        "entries" => {}
      }
      File.write(File.join(root, "cache", "substack-sync.json"), "#{JSON.pretty_generate(ledger_data)}\n")
      yield root
    end
  end

  def base_substack(id: "valid-post", web: true, email: false, audience: nil)
    value = {
      "enabled" => true,
      "id" => id,
      "delivery" => { "web" => web, "email" => email }
    }
    value["audience"] = audience if audience
    value
  end

  def write_post(root, name: "2026-08-10-Valid.md", substack: base_substack, body: "A substantive article body.\n",
                 extra: {})
    data = {
      "layout" => "post",
      "title" => "Valid article",
      "date" => "2026-08-10T08:00:00-07:00",
      "substack" => substack
    }.merge(extra)
    path = File.join(root, "_posts", "AI", name)
    FileUtils.mkdir_p(File.dirname(path))
    File.write(path, "#{YAML.dump(data)}---\n#{body}")
    path
  end

  def write_raw_post(root, front_matter, name: "2026-08-10-Raw.md", body: "A substantive article body.\n")
    path = File.join(root, "_posts", "AI", name)
    FileUtils.mkdir_p(File.dirname(path))
    File.write(path, "---\n#{front_matter.rstrip}\n---\n#{body}")
    path
  end

  def write_test_png(root, relative = "img/hero.png")
    path = File.join(root, relative)
    FileUtils.mkdir_p(File.dirname(path))
    File.binwrite(
      path,
      [
        "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489" \
        "0000000d49444154789c6360606060000000050001a5f645400000000049454e44ae426082"
      ].pack("H*")
    )
    path
  end

  def scanner(root)
    TedT::Substack::Scanner.new(root: root, now: -> { NOW })
  end

  def render_one(root)
    scan = scanner(root).scan
    assert_equal([], scan.errors)
    assert_equal(1, scan.posts.length)
    TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(scan.posts.first)
  end

  def error_codes(scan)
    scan.errors.map { |error| error["code"] }
  end

  def package(root, output:, source_id: nil, backfill: false, force_package: nil, validator: CapturingValidator.new)
    ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
    TedT::Substack::PackageBuilder.new(
      root: root,
      output: output,
      ledger: ledger,
      source_sha: "abc123",
      publication_url: "https://example.substack.com",
      repository: "TedTschopp/tedt.org",
      now: -> { NOW },
      source_id: source_id,
      backfill: backfill,
      force_package: force_package,
      validate_remote_assets: true,
      remote_validator: validator,
      canonical_validator: validator
    ).build
  end

  def ledger_entry(post, payload, state: "published_web", source_path: nil, email_status: "not_requested")
    recorded_path = source_path || post.relative_path
    remote = if state == "drafted"
               { "draft_id" => "draft-#{post.id}", "revision" => "r1" }
             else
               {
                 "draft_id" => "draft-#{post.id}",
                 "post_id" => "post-#{post.id}",
                 "url" => "https://example.substack.com/p/#{post.id}",
                 "revision" => "r1"
               }
             end
    {
      "source_path" => recorded_path,
      "source_paths" => [recorded_path],
      "source_sha" => "old-sha",
      "payload_hash" => payload.fetch("payload_hash"),
      "content_hash" => payload["content_hash"] || TedT::Substack::Util.content_hash(payload),
      "field_hashes" => TedT::Substack::Util.field_hashes(payload),
      "canonical_url" => payload["canonical_url"],
      "proposed_slug" => payload["slug"],
      "slug" => payload["slug"],
      "audience" => payload.fetch("audience"),
      "delivery" => payload.fetch("delivery"),
      "last_effective_delivery" => payload.fetch("delivery"),
      "publish_at" => payload["publish_at"],
      "state" => state,
      "remote" => remote,
      "web" => {
        "status" => state == "drafted" ? "not_published" : "published",
        "published" => state != "drafted"
      },
      "email" => {
        "request_status" => email_status,
        "delivery_evidence" => "unknown"
      },
      "updated_at" => NOW.iso8601
    }
  end

  def bind_ledger_publication(root, publication_url = "https://example.substack.com")
    ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
    ledger.data["publication_url"] = publication_url
    ledger.save!
    ledger
  end

  def refresh_checksums(directory)
    entries = []
    Find.find(directory) do |path|
      next if File.directory?(path)

      relative = Pathname.new(path).relative_path_from(Pathname.new(directory)).to_s
      next if relative == "checksums.sha256"

      entries << [relative, Digest::SHA256.file(path).hexdigest]
    end
    content = entries.sort.map { |relative, digest| "#{digest}  #{relative}" }.join("\n")
    File.write(File.join(directory, "checksums.sha256"), "#{content}\n")
  end

  def verify_package_cli(package_path:, ledger_path:, publication_url:)
    stdout = StringIO.new
    stderr = StringIO.new
    status = TedT::Substack::CLI.new(
      [
        "verify-package",
        "--package", package_path,
        "--ledger", ledger_path,
        "--publication-url", publication_url
      ],
      stdout: stdout,
      stderr: stderr,
      env: {}
    ).run
    error_code = if stderr.string.strip.empty?
                   nil
                 else
                   JSON.parse(stderr.string.lines.last).dig("error", "code")
                 end
    [status, error_code]
  end

  def check_opt_in_defaults
    with_repo do |root|
      write_post(root, name: "2026-08-10-No-Substack.md", substack: nil)
      write_post(root, name: "2026-08-11-Disabled.md", substack: { "enabled" => false })
      write_post(root)
      scan = scanner(root).scan
      assert_equal([], scan.errors)
      assert_equal(1, scan.posts.length)
      assert_equal("everyone", scan.posts.first.settings["audience"])
      assert_equal(false, scan.posts.first.settings.dig("delivery", "email"))
      assert(scan.excluded.any? { |item| item["reason"] == "not_enabled" })
    end
  end

  def check_delivery_validation
    with_repo do |root|
      settings = base_substack
      settings["delivery"].delete("email")
      write_post(root, substack: settings)
      assert_includes(error_codes(scanner(root).scan), "missing_delivery_field")
    end
    with_repo do |root|
      settings = base_substack
      settings["delivery"]["email"] = "false"
      write_post(root, substack: settings)
      assert_includes(error_codes(scanner(root).scan), "invalid_boolean")
    end
    with_repo do |root|
      write_post(root, substack: base_substack(web: false, email: false))
      assert_includes(error_codes(scanner(root).scan), "empty_delivery")
    end
  end

  def check_duplicate_yaml_keys
    with_repo do |root|
      write_raw_post(
        root,
        <<~YAML
          layout: post
          title: Duplicate delivery key
          date: 2026-08-10T08:00:00-07:00
          substack:
            enabled: true
            id: duplicate-yaml-key
            delivery:
              web: true
              email: false
              email: true
        YAML
      )
      assert_includes(error_codes(scanner(root).scan), "duplicate_yaml_key")
    end
  end

  def check_legacy_duplicate_keys
    with_repo do |root|
      write_raw_post(
        root,
        <<~YAML,
          layout: post
          title: Legacy duplicate
          date: 2026-08-10T08:00:00-07:00
          mastodon-post-id: first
          mastodon-post-id: second
        YAML
        name: "2026-08-10-Legacy-Duplicate.md"
      )
      write_post(root, name: "2026-08-11-No-Substack.md", substack: nil)
      scan = scanner(root).scan
      assert_equal([], scan.errors)
      assert_equal([], scan.posts)
    end
  end

  def check_substack_yaml_aliases
    with_repo do |root|
      write_raw_post(
        root,
        <<~YAML
          layout: post
          title: Aliased delivery
          date: 2026-08-10T08:00:00-07:00
          substack:
            enabled: true
            id: aliased-delivery
            delivery: &delivery
              web: true
              email: false
            copied: *delivery
        YAML
      )
      assert_includes(error_codes(scanner(root).scan), "unsupported_yaml_alias")
    end
  end

  def check_id_validation
    with_repo do |root|
      write_post(root, name: "2026-08-10-One.md", substack: base_substack(id: "same-id"))
      write_post(root, name: "2026-08-11-Two.md", substack: base_substack(id: "same-id"))
      assert_includes(error_codes(scanner(root).scan), "duplicate_id")
    end
    with_repo do |root|
      write_post(root, substack: base_substack(id: "Not Safe"))
      assert_includes(error_codes(scanner(root).scan), "invalid_id")
    end
  end

  def check_paid_acknowledgement
    with_repo do |root|
      write_post(root, substack: base_substack(audience: "paid"))
      assert_includes(error_codes(scanner(root).scan), "public_source_not_acknowledged")
    end
    with_repo do |root|
      settings = base_substack(audience: "paid")
      settings["public_source_acknowledged"] = true
      write_post(root, substack: settings)
      scan = scanner(root).scan
      assert_equal([], scan.errors)
      assert_includes(scan.warnings.map { |warning| warning["code"] }, "public_source_remains_available")
    end
    with_repo do |root|
      settings = base_substack
      settings["paywall_after"] = "Members"
      write_post(root, substack: settings)
      assert_includes(error_codes(scanner(root).scan), "invalid_paywall_audience")
    end
  end

  def check_schedules
    with_repo do |root|
      settings = base_substack
      settings["publish_at"] = "2026-11-16T10:00:00-07:00"
      write_post(root, substack: settings)
      assert_equal([], scanner(root).scan.errors)
    end
    with_repo do |root|
      settings = base_substack
      settings["publish_at"] = "2026-11-16T10:00:01-07:00"
      write_post(root, substack: settings)
      assert_includes(error_codes(scanner(root).scan), "schedule_too_far")
    end
    with_repo do |root|
      settings = base_substack
      settings["publish_at"] = "2026-08-20T10:00:00"
      write_post(root, substack: settings)
      assert_includes(error_codes(scanner(root).scan), "invalid_schedule")
    end
  end

  def check_unquoted_schedule_timestamp
    with_repo do |root|
      write_raw_post(
        root,
        <<~YAML
          layout: post
          title: Unquoted schedule
          date: 2026-08-10T08:00:00-07:00
          substack:
            enabled: true
            id: unquoted-schedule
            delivery:
              web: true
              email: false
            publish_at: 2026-09-01T08:00:00-07:00
        YAML
      )
      scan = scanner(root).scan
      assert_equal([], scan.errors)
      assert_equal("2026-09-01T08:00:00-07:00", scan.posts.first.settings["publish_at"])
    end
  end

  def check_eligibility
    with_repo do |root|
      write_post(root, name: "2026-08-10-Unpublished.md", substack: base_substack(id: "unpublished"), extra: { "published" => false })
      write_post(root, name: "2026-08-11-Draft.md", substack: base_substack(id: "draft-post"), extra: { "draft" => true })
      write_post(
        root,
        name: "2026-08-20-Future.md",
        substack: base_substack(id: "future-post"),
        extra: { "date" => "2026-08-20T08:00:00-07:00" }
      )
      scan = scanner(root).scan
      assert_equal([], scan.errors)
      assert_equal([], scan.posts)
      assert_equal(%w[draft future_post published_false], scan.excluded.map { |item| item["reason"] }.sort)
    end
  end

  def check_rich_rendering
    with_repo do |root|
      write_test_png(root, "img/hero source.webp")
      write_test_png(root, "img/inline source.webp")
      body = <<~MARKDOWN
        Intro from {{ site.url }}.

        > A quoted idea.

        | Name | Value |
        |---|---:|
        | One | 1 |
        {. well .table .table-striped}

        ```ruby
        puts "hello"
        ```

        [A local link](/another-post/)

        ![Inline alt](/img/inline source.webp)

        <div class="call-to-action">Do not copy this module.</div>
      MARKDOWN
      write_post(
        root,
        body: body,
        extra: {
          "image" => "/img/hero source.webp",
          "image-alt" => "Hero alt",
          "subtitle" => "A subtitle",
          "description" => "A description",
          "tags" => %w[AI Architecture]
        }
      )
      payload = render_one(root)
      assert_includes(payload["content_html"], "<blockquote>")
      assert_includes(payload["content_html"], "<table>")
      assert_includes(payload["content_html"], "<pre")
      assert_includes(payload["content_html"], "https://tedt.org/another-post/")
      assert_includes(payload["content_html"], "https://tedt.org/img/inline%20source.webp")
      assert(!payload["content_html"].include?("call-to-action"))
      assert(!payload["content_html"].include?("{. well"))
      assert_equal("https://tedt.org/img/hero%20source.webp", payload.dig("hero", "url"))
      assert_equal(2, payload["assets"].length)
    end
  end

  def check_strict_liquid_variables
    with_repo do |root|
      write_post(root, body: "Before {{ site.missing_value }} after.\n")
      assert_error("unsupported_liquid") { render_one(root) }
    end
  end

  def check_liquid_code_and_tags
    with_repo do |root|
      write_post(
        root,
        body: <<~MARKDOWN
          Literal example:

          ```liquid
          {{ customer.name }}
          {% if customer.active %}active{% endif %}
          ```

          Inline `{{ request.value }}` stays literal.
        MARKDOWN
      )
      html = render_one(root)["content_html"]
      text = Nokogiri::HTML::DocumentFragment.parse(html).text
      assert_includes(text, "{{ customer.name }}")
      assert_includes(text, "{% if customer.active %}")
      assert_includes(text, "{{ request.value }}")
    end
    with_repo do |root|
      write_post(root, body: "{% include components/example.html %}\n")
      assert_error("unsupported_liquid") { render_one(root) }
    end
  end

  def check_canonical_output_extension
    with_repo do |root|
      write_post(root, extra: { "permalink" => "/Swiss-Folklore/:title:output_ext" })
      payload = render_one(root)
      assert_equal("https://tedt.org/Swiss-Folklore/valid.html", payload["canonical_url"])
      assert(!payload["canonical_url"].include?(":output_ext"), "canonical URL retained an unresolved Jekyll token")
    end
  end

  def check_url_component_preservation
    with_repo do |root|
      expected = "https://tedt.org/docs/already%20encoded/?next=%2Fvalue#part%202"
      write_post(root, body: "[Encoded link](/docs/already%20encoded/?next=%2Fvalue#part%202)\n")
      payload = render_one(root)
      link = Nokogiri::HTML::DocumentFragment.parse(payload["content_html"]).at_css("a")
      assert_equal(expected, link["href"])
      assert(!link["href"].include?("%25"), "existing percent escapes were encoded a second time")
    end
  end

  def check_root_relative_hero
    with_repo do |root|
      write_test_png(root, "img/root hero.png")
      write_post(
        root,
        extra: {
          "permalink" => "/articles/valid/",
          "image" => "/img/root hero.png",
          "image-alt" => "Root-relative hero"
        }
      )
      payload = render_one(root)
      assert_equal("https://tedt.org/img/root%20hero.png", payload.dig("hero", "url"))
    end
  end

  def check_exact_cta_class_removal
    with_repo do |root|
      write_post(
        root,
        body: <<~MARKDOWN
          Editorial introduction that must remain.

          > Remove the exact CTA module.
          {: .cta}

          > Keep this editorial note.
          {: .cta-note}
        MARKDOWN
      )
      html = render_one(root)["content_html"]
      assert(!html.include?("Remove the exact CTA module"))
      assert_includes(html, "Keep this editorial note")
    end
  end

  def check_unsafe_markup
    {
      "<script>alert(1)</script>" => "unsupported_html",
      "<iframe src=\"https://example.com\"></iframe>" => "unsupported_html",
      "<p onclick=\"alert(1)\">Unsafe</p>" => "unsafe_html_attribute",
      "<p style=\"color:red\">Unsafe</p>" => "unsafe_html_attribute"
    }.each do |body, code|
      with_repo do |root|
        write_post(root, body: body)
        error = assert_error(code) { render_one(root) }
        assert(!error.message.include?("alert(1)"))
      end
    end
  end

  def check_paywall
    with_repo do |root|
      settings = base_substack(audience: "paid")
      settings["public_source_acknowledged"] = true
      settings["paywall_after"] = "marker:members"
      write_post(
        root,
        substack: settings,
        body: "Public introduction.\n\n<!-- substack-paywall:members -->\n\nPaid continuation.\n"
      )
      payload = render_one(root)
      assert_includes(payload["preview_html"], "Public introduction")
      assert(!payload["preview_html"].include?("Paid continuation"))
      assert_includes(payload["paid_html"], "Paid continuation")
      assert(!payload["content_html"].include?("substack-paywall"))
    end
    with_repo do |root|
      settings = base_substack(audience: "founding")
      settings["public_source_acknowledged"] = true
      settings["paywall_after"] = "Member section"
      write_post(root, substack: settings, body: "Intro.\n\n## Member section\n\nPrivate detail.\n")
      payload = render_one(root)
      assert_includes(payload["preview_html"], "Member section")
      assert_includes(payload["paid_html"], "Private detail")
    end
  end

  def check_assets
    with_repo do |root|
      write_post(root, extra: { "image" => "/img/missing.webp", "image-alt" => "Missing" })
      assert_error("missing_asset") { render_one(root) }
    end
    with_repo do |root|
      FileUtils.mkdir_p(File.join(root, "img"))
      File.write(File.join(root, "img", "hero.webp"), "hero")
      write_post(root, extra: { "image" => "/img/hero.webp" })
      assert_error("missing_image_alt") { render_one(root) }
    end
  end

  def check_hash_and_rename_idempotency
    with_repo do |root|
      original_path = write_post(root, extra: { "permalink" => "/stable/" })
      first_payload = render_one(root)
      ledger_path = File.join(root, "cache", "substack-sync.json")
      ledger = TedT::Substack::Ledger.load(ledger_path)
      first_post = scanner(root).scan.posts.first
      ledger.entries["valid-post"] = ledger_entry(
        first_post,
        first_payload,
        source_path: "_posts/AI/2026-08-01-Old-Name.md"
      )
      ledger.save!

      renamed = File.join(File.dirname(original_path), "2026-08-10-New-Name.md")
      File.rename(original_path, renamed)
      scan = scanner(root).scan
      second_payload = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(scan.posts.first)
      assert_equal(first_payload["payload_hash"], second_payload["payload_hash"])
      rendered = [TedT::Substack::RenderedPost.new(post: scan.posts.first, payload: second_payload)]
      plan = TedT::Substack::Planner.new(ledger: ledger, source_sha: "new-sha").plan(rendered)
      assert_equal([], plan["candidates"])
      assert_includes(plan["alerts"].map { |item| item["code"] }, "source_path_changed")
    end
  end

  def check_image_rename_idempotency
    with_repo do |root|
      write_test_png(root)
      original_path = write_post(
        root,
        extra: {
          "permalink" => "/stable-image-post/",
          "image" => "/img/hero.png",
          "image-alt" => "Stable hero"
        }
      )
      first_scan = scanner(root).scan
      first_post = first_scan.posts.first
      renderer = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org")
      first_payload = renderer.render(first_post)
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.entries[first_post.id] = ledger_entry(first_post, first_payload)

      renamed = File.join(File.dirname(original_path), "2026-08-10-Renamed-With-Hero.md")
      File.rename(original_path, renamed)
      second_scan = scanner(root).scan
      second_payload = renderer.render(second_scan.posts.first)
      assert_equal(first_payload["payload_hash"], second_payload["payload_hash"])

      rendered = [TedT::Substack::RenderedPost.new(post: second_scan.posts.first, payload: second_payload)]
      plan = TedT::Substack::Planner.new(ledger: ledger, source_sha: "new-sha").plan(rendered)
      assert_equal([], plan["candidates"])
    end
  end

  def check_path_and_id_rename
    with_repo do |root|
      write_post(
        root,
        name: "2026-08-10-New-Path.md",
        substack: base_substack(id: "new-source-id", email: true),
        extra: { "permalink" => "/stable-identity/" }
      )
      scan = scanner(root).scan
      post = scan.posts.first
      payload = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(post)
      old_payload = Marshal.load(Marshal.dump(payload))
      old_payload["source_id"] = "old-source-id"
      old_payload["content_hash"] = TedT::Substack::Util.content_hash(old_payload)
      old_payload = TedT::Substack::Util.add_payload_hash(old_payload)
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.entries["old-source-id"] = ledger_entry(
        post,
        old_payload,
        state: "email_accepted",
        source_path: "_posts/AI/2026-08-01-Old-Path.md",
        email_status: "accepted"
      )
      rendered = [TedT::Substack::RenderedPost.new(post: post, payload: payload)]

      assert_error("ambiguous_source_identity") do
        TedT::Substack::Planner.new(ledger: ledger, source_sha: "new-sha").plan(rendered)
      end
    end
  end

  def check_drafted_resume
    with_repo do |root|
      write_post(root, substack: base_substack(email: true))
      scan = scanner(root).scan
      post = scan.posts.first
      payload = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(post)
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.entries[post.id] = ledger_entry(post, payload, state: "drafted")
      rendered = [TedT::Substack::RenderedPost.new(post: post, payload: payload)]

      plan = TedT::Substack::Planner.new(ledger: ledger, source_sha: "new-sha").plan(rendered)
      assert_equal(1, plan["candidates"].length)
      assert_equal("resume_release", plan["candidates"].first["operation"])
      assert_equal(true, plan["candidates"].first.dig("effective_delivery", "email"))
    end
  end

  def check_correction_transport_delivery
    adapter = FakeAdapter.new
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "title" => "Corrected post",
      "delivery" => { "web" => true, "email" => true }
    )
    entry = {
      "state" => "email_accepted",
      "payload_hash" => "prior-hash",
      "remote" => { "post_id" => "post-1", "revision" => "r1" },
      "email" => { "request_status" => "accepted" }
    }
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })
    coordinator.update_web_post(payload: payload, entry: entry, persist: -> {})

    call = adapter.calls.find { |value| value.first == "update_web_post" }
    assert_equal(false, call[2].dig("delivery", "email"))
    assert_equal(true, call[2].dig("delivery", "web"))
    assert_equal(true, payload.dig("delivery", "email"), "correction mutated the normalized source payload")
    assert_equal(payload["payload_hash"], entry["payload_hash"])
  end

  def check_email_only_correction
    adapter = FakeAdapter.new
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "title" => "Email-only correction",
      "delivery" => { "web" => false, "email" => true }
    )
    entry = {
      "state" => "email_accepted",
      "payload_hash" => "prior-hash",
      "remote" => { "post_id" => "post-1", "revision" => "r1" },
      "email" => { "request_status" => "accepted" }
    }
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })

    assert_error("email_only_correction_requires_manual") do
      coordinator.update_web_post(payload: payload, entry: entry, persist: -> {})
    end
    assert_equal(0, adapter.calls.count { |call| call.first == "update_web_post" })
  end

  def check_backfill
    with_repo(activated_at: "2026-08-15T00:00:00-07:00") do |root|
      settings = base_substack(web: true, email: true)
      settings["publish_at"] = "2026-09-01T08:00:00-07:00"
      write_post(root, substack: settings)
      output = File.join(root, "prepared")
      automatic = package(root, output: output)
      assert_equal(0, automatic["candidate_count"])
      assert_includes(JSON.parse(File.read(File.join(output, "validation-report.json")))["skipped"].map { |item| item["reason"] }, "historical_requires_backfill")

      backfill_output = File.join(root, "backfill")
      backfill = package(root, output: backfill_output, source_id: "valid-post", backfill: true)
      assert_equal(1, backfill["candidate_count"])
      candidate = TedT::Substack::PackageReader.new(backfill_output).candidate("valid-post")
      assert_equal({ "web" => true, "email" => false }, candidate.dig("payload", "delivery"))
      assert_equal(nil, candidate.dig("payload", "publish_at"))
    end
  end

  def check_tracked_backfill
    with_repo(activated_at: "2026-08-15T00:00:00-07:00") do |root|
      write_post(root)
      scan = scanner(root).scan
      post = scan.posts.first
      payload = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(post)
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.entries[post.id] = ledger_entry(post, payload)
      ledger.save!

      output = File.join(root, "tracked-backfill")
      manifest = package(root, output: output, source_id: post.id, backfill: true)
      assert_equal(0, manifest["candidate_count"])
      report = JSON.parse(File.read(File.join(output, "validation-report.json")))
      assert_includes(report["skipped"].map { |item| item["reason"] }, "tracked_post_not_backfilled")
      assert_includes(report["alerts"].map { |item| item["code"] }, "backfill_already_tracked")
    end
  end

  def check_ledger_validation
    with_repo do |root|
      path = File.join(root, "cache", "substack-sync.json")
      File.write(path, "{truncated")
      assert_error("malformed_ledger") { TedT::Substack::Ledger.load(path) }
      File.write(path, JSON.generate("schema_version" => 99, "activated_at" => ACTIVATED_AT, "entries" => {}))
      assert_error("unsupported_ledger_version") { TedT::Substack::Ledger.load(path) }
    end
  end

  def check_strict_ledger_entries
    with_repo do |root|
      path = File.join(root, "cache", "substack-sync.json")
      malformed = {
        "schema_version" => 1,
        "activated_at" => ACTIVATED_AT,
        "publication_url" => "https://example.substack.com",
        "entries" => {
          "valid-post" => {
            "source_path" => "_posts/AI/2026-08-10-Valid.md",
            "payload_hash" => 42,
            "state" => "email_accepted",
            "delivery" => { "web" => true, "email" => true },
            "email" => nil
          }
        }
      }
      File.write(path, "#{JSON.pretty_generate(malformed)}\n")
      assert_error("invalid_ledger") { TedT::Substack::Ledger.load(path) }
    end
  end

  def check_duplicate_remote_ids
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root)
      output = File.join(root, "prepared")
      package(root, output: output, force_package: "record_manual")
      first = TedT::Substack::PackageReader.new(output).candidate("valid-post")
      second = Marshal.load(Marshal.dump(first))
      second["id"] = "second-post"
      second["source_path"] = "_posts/AI/2026-08-11-Second.md"
      second_payload = Marshal.load(Marshal.dump(second.fetch("payload")))
      second_payload["source_id"] = "second-post"
      second_payload = TedT::Substack::Util.add_payload_hash(second_payload)
      second["payload"] = second_payload
      second["payload_hash"] = second_payload.fetch("payload_hash")

      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.record_manual!(
        first,
        publication_url: "https://example.substack.com",
        remote_url: "https://example.substack.com/p/shared",
        remote_post_id: "shared-post-id",
        now: NOW
      )
      assert_error("remote_id_conflict") do
        ledger.record_manual!(
          second,
          publication_url: "https://example.substack.com",
          remote_url: "https://example.substack.com/p/shared",
          remote_post_id: "shared-post-id",
          now: NOW
        )
      end
    end
  end

  def check_email_intent
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root, substack: base_substack(email: true))
      output = File.join(root, "prepared")
      package(root, output: output)
      candidate = TedT::Substack::PackageReader.new(output).candidate("valid-post")
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      post = scanner(root).scan.posts.first
      ledger.entries[post.id] = ledger_entry(post, candidate.fetch("payload"), state: "drafted")
      ledger.save!
      ledger.mark_intent!(candidate, now: NOW)
      ledger.save!
      reloaded = TedT::Substack::Ledger.load(ledger.path)
      assert_equal("publish_intent", reloaded["valid-post"]["state"])
      assert_equal("pending", reloaded["valid-post"].dig("email", "request_status"))
      assert_error("email_retry_blocked") { reloaded.mark_intent!(candidate, now: NOW) }
    end
  end

  def check_manual_record
    with_repo do |root|
      write_post(root, substack: base_substack(email: true))
      output = File.join(root, "prepared")
      package(root, output: output, force_package: "record_manual")
      candidate = TedT::Substack::PackageReader.new(output).candidate("valid-post")
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      assert_error("invalid_remote_url") do
        ledger.record_manual!(
          candidate,
          publication_url: "https://example.substack.com",
          remote_url: "https://evil.example/p/valid",
          remote_post_id: "post-1",
          now: NOW
        )
      end
      ledger.record_manual!(
        candidate,
        publication_url: "https://example.substack.com",
        remote_url: "https://example.substack.com/p/valid",
        remote_post_id: "post-1",
        email_status: "accepted",
        now: NOW
      )
      assert_equal("email_accepted", ledger["valid-post"]["state"])
      assert_equal("unknown", ledger["valid-post"].dig("email", "delivery_evidence"))
    end
  end

  def check_manual_email_monotonicity
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root, substack: base_substack(email: true))
      output = File.join(root, "prepared")
      package(root, output: output, force_package: "record_manual")
      candidate = TedT::Substack::PackageReader.new(output).candidate("valid-post")
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.record_manual!(
        candidate,
        publication_url: "https://example.substack.com",
        remote_url: "https://example.substack.com/p/valid",
        remote_post_id: "post-1",
        email_status: "accepted",
        now: NOW
      )

      assert_error("email_state_regression") do
        ledger.record_manual!(
          candidate,
          publication_url: "https://example.substack.com",
          remote_url: "https://example.substack.com/p/valid",
          remote_post_id: "post-1",
          email_status: "not_requested",
          now: NOW + 60
        )
      end
      assert_equal("accepted", ledger["valid-post"].dig("email", "request_status"))
      assert_equal("email_accepted", ledger["valid-post"]["state"])
    end
  end

  def check_unavailable_adapter
    secret = "never-print-this-secret"
    adapter = TedT::Substack::UnavailableAdapter.new(name: "official")
    error = assert_error("official_adapter_unavailable") { adapter.assert_available! }
    assert(!error.message.include?(secret))
    %i[upsert_draft publish_or_schedule get_post update_web_post].each do |operation|
      assert_error("official_adapter_unavailable") { adapter.public_send(operation, ignored: secret) }
    end
  end

  def check_ambiguous_delivery
    adapter = FakeAdapter.new
    adapter.ambiguous = true
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "delivery" => { "web" => true, "email" => true },
      "publish_at" => nil
    )
    entry = {
      "state" => "publish_intent",
      "intent_payload_hash" => payload["payload_hash"],
      "remote" => { "draft_id" => "draft-1" },
      "email" => { "request_status" => "pending" }
    }
    persists = 0
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })
    assert_error("ambiguous_send") do
      coordinator.publish_or_schedule(payload: payload, entry: entry, persist: -> { persists += 1 })
    end
    assert_equal("unknown", entry["state"])
    assert_equal("unknown", entry.dig("email", "request_status"))
    assert_equal(1, persists)
    assert_error("email_retry_blocked") do
      coordinator.publish_or_schedule(payload: payload, entry: entry, persist: -> { persists += 1 })
    end
    assert_equal(1, adapter.calls.count { |call| call.first == "publish_or_schedule" })
  end

  def check_incomplete_adapter_response
    adapter = FakeAdapter.new
    adapter.release_response = {}
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "delivery" => { "web" => true, "email" => false },
      "publish_at" => nil
    )
    entry = {
      "state" => "drafted",
      "payload_hash" => payload.fetch("payload_hash"),
      "remote" => { "draft_id" => "draft-1", "revision" => "r1" },
      "email" => { "request_status" => "not_requested" }
    }
    persists = 0
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })

    assert_error("invalid_adapter_response") do
      coordinator.publish_or_schedule(payload: payload, entry: entry, persist: -> { persists += 1 })
    end
    assert_equal("drafted", entry["state"])
    assert_equal(0, persists)
  end

  def check_malformed_email_response
    adapter = FakeAdapter.new
    adapter.release_response = {}
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "delivery" => { "web" => true, "email" => true },
      "publish_at" => nil
    )
    entry = {
      "state" => "publish_intent",
      "intent_payload_hash" => payload.fetch("payload_hash"),
      "remote" => { "draft_id" => "draft-1", "revision" => "r1" },
      "email" => { "request_status" => "pending" }
    }
    persists = 0
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })
    assert_error("invalid_adapter_response") do
      coordinator.publish_or_schedule(payload: payload, entry: entry, persist: -> { persists += 1 })
    end
    assert_equal("unknown", entry["state"])
    assert_equal("unknown", entry.dig("email", "request_status"))
    assert_equal(1, persists)
  end

  def check_draft_drift
    adapter = FakeAdapter.new
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "title" => "Updated draft",
      "delivery" => { "web" => true, "email" => false }
    )
    entry = {
      "state" => "drafted",
      "content_hash" => "0" * 64,
      "remote" => { "draft_id" => "draft-1", "revision" => "recorded-r0" },
      "email" => { "request_status" => "not_requested" }
    }
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })
    assert_error("remote_drift") do
      coordinator.upsert_draft(payload: payload, entry: entry, persist: -> {})
    end
    assert_equal("conflict", entry["state"])
    assert_equal(0, adapter.calls.count { |call| call.first == "upsert_draft" })
  end

  def check_remote_drift
    adapter = FakeAdapter.new
    adapter.remote_revision = "manual-r2"
    payload = TedT::Substack::Util.add_payload_hash(
      "source_id" => "valid-post",
      "delivery" => { "web" => true, "email" => false }
    )
    entry = {
      "state" => "email_accepted",
      "remote" => { "post_id" => "post-1", "revision" => "r1" },
      "email" => { "request_status" => "accepted" }
    }
    coordinator = TedT::Substack::Coordinator.new(adapter: adapter, clock: -> { NOW })
    assert_error("remote_drift") do
      coordinator.update_web_post(payload: payload, entry: entry, persist: -> {})
    end
    assert_equal("conflict", entry["state"])
    assert_equal(0, adapter.calls.count { |call| call.first == "update_web_post" })
  end

  def check_package_artifacts
    with_repo do |root|
      write_test_png(root, "img/hero.webp")
      write_post(root, extra: { "image" => "/img/hero.webp", "image-alt" => "Hero" })
      output = File.join(root, "prepared")
      validator = CapturingValidator.new
      manifest = package(root, output: output, validator: validator)
      assert_equal(1, manifest["candidate_count"])
      %w[manifest.json validation-report.json summary.md checksums.sha256].each do |name|
        assert(File.file?(File.join(output, name)), "missing #{name}")
      end
      %w[payload.json assets.json article.html preview.html].each do |name|
        assert(File.file?(File.join(output, "posts", "valid-post", name)), "missing #{name}")
      end
      assert_equal(["https://tedt.org/img/hero.webp", "https://tedt.org/valid/"].sort, validator.urls.sort)
      reader = TedT::Substack::PackageReader.new(output)
      assert_equal("valid-post", reader.candidate("valid-post").dig("payload", "source_id"))

      File.open(File.join(output, "posts", "valid-post", "payload.json"), "a") { |file| file.write(" ") }
      assert_error("checksum_mismatch") { TedT::Substack::PackageReader.new(output) }
    end
  end

  def check_package_output_safety
    with_repo do |root|
      write_post(root)
      sentinel = File.join(root, "source-sentinel.txt")
      File.write(sentinel, "must survive")

      assert_error("unsafe_output_path") { package(root, output: root) }
      assert_equal("must survive", File.read(sentinel))
    end
  end

  def check_package_cross_fields
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root)
      output = File.join(root, "prepared")
      package(root, output: output)
      manifest_path = File.join(output, "manifest.json")
      manifest = JSON.parse(File.read(manifest_path))
      manifest.fetch("candidates").first["audience"] = "paid"
      File.write(manifest_path, "#{JSON.pretty_generate(manifest)}\n")
      refresh_checksums(output)

      assert_error("package_metadata_mismatch") do
        TedT::Substack::PackageReader.new(output).candidate("valid-post")
      end
    end
  end

  def check_package_binding_success
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root)
      output = File.join(root, "prepared")
      package(root, output: output)
      status, error_code = verify_package_cli(
        package_path: output,
        ledger_path: File.join(root, "cache", "substack-sync.json"),
        publication_url: "https://example.substack.com"
      )
      assert_equal(0, status)
      assert_equal(nil, error_code)
    end
  end

  def check_package_current_ledger_binding
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root)
      output = File.join(root, "prepared")
      package(root, output: output)
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.data["activated_at"] = "2026-08-01T00:00:01-07:00"
      ledger.save!

      status, error_code = verify_package_cli(
        package_path: output,
        ledger_path: ledger.path,
        publication_url: "https://example.substack.com"
      )
      assert_equal(1, status)
      assert_equal("stale_ledger", error_code)
    end
  end

  def check_package_publication_binding
    with_repo do |root|
      bind_ledger_publication(root)
      write_post(root)
      output = File.join(root, "prepared")
      package(root, output: output)

      status, error_code = verify_package_cli(
        package_path: output,
        ledger_path: File.join(root, "cache", "substack-sync.json"),
        publication_url: "https://another-publication.substack.com"
      )
      assert_equal(1, status)
      assert_equal("publication_mismatch", error_code)
    end
  end

  def check_cli_fail_closed
    with_repo do |root|
      write_post(root)
      output = File.join(root, "prepared")
      stdout = StringIO.new
      stderr = StringIO.new
      cli = TedT::Substack::CLI.new(
        [
          "prepare",
          "--root", root,
          "--output", output,
          "--ledger", File.join(root, "cache", "substack-sync.json"),
          "--source-sha", "abc123"
        ],
        stdout: stdout,
        stderr: stderr,
        env: {}
      )
      assert_equal(0, cli.run)
      assert(File.file?(File.join(output, "manifest.json")))

      ledger_path = File.join(root, "cache", "substack-sync.json")
      before = File.binread(ledger_path)
      secret = "super-secret-token"
      publish_stdout = StringIO.new
      publish_stderr = StringIO.new
      publish_cli = TedT::Substack::CLI.new(
        [
          "publish",
          "--package", output,
          "--ledger", ledger_path,
          "--source-id", "valid-post",
          "--adapter", "official",
          "--phase", "upsert"
        ],
        stdout: publish_stdout,
        stderr: publish_stderr,
        env: { "SUBSTACK_API_TOKEN" => secret }
      )
      assert_equal(1, publish_cli.run)
      assert_equal(before, File.binread(ledger_path))
      assert(!publish_stderr.string.include?(secret))
    end
  end

  def check_deleted_source_alert
    with_repo do |root|
      write_post(root)
      scan = scanner(root).scan
      payload = TedT::Substack::Renderer.new(root: root, site_url: "https://tedt.org").render(scan.posts.first)
      rendered = [TedT::Substack::RenderedPost.new(post: scan.posts.first, payload: payload)]
      ledger = TedT::Substack::Ledger.load(File.join(root, "cache", "substack-sync.json"))
      ledger.entries["deleted-post"] = {
        "source_path" => "_posts/AI/2026-08-01-Deleted.md",
        "payload_hash" => "old",
        "state" => "published_web"
      }
      plan = TedT::Substack::Planner.new(ledger: ledger, source_sha: "abc123").plan(rendered)
      alert = plan["alerts"].find { |value| value["id"] == "deleted-post" }
      assert_equal("source_disabled_or_deleted", alert["code"])
      assert_equal(0, FakeAdapter.new.calls.length)
    end
  end

  def check_repository_wiring
    root = File.expand_path("..", __dir__)
    config = YAML.safe_load(File.read(File.join(root, "_config.yml")), aliases: true)
    assert_includes(Array(config["exclude"]), "cache/substack-sync.json")

    workflow_path = File.join(root, ".github", "workflows", "substack-publish.yml")
    workflow = File.read(workflow_path)
    deploy_workflow = File.read(File.join(root, ".github", "workflows", "deploy.yml"))
    assert_includes(workflow, 'workflows: ["Site Quality + Deploy"]')
    assert_includes(workflow, "github.event.workflow_run.head_sha")
    assert_includes(workflow, "name: substack-production")
    assert_includes(workflow, "refs/heads/substack-state")
    assert_includes(workflow, "vars.SUBSTACK_PUBLICATION_URL != ''")
    assert_includes(workflow, "Enforce one email request per approved run")
    assert_includes(deploy_workflow, "make substack_check")

    stage_position = workflow.index("  stage:")
    mutate_position = workflow.index("  mutate:")
    secret_position = workflow.index("secrets.SUBSTACK_API_TOKEN")
    assert(stage_position && mutate_position && secret_position)
    assert(stage_position < mutate_position)
    assert(secret_position > mutate_position, "Substack credential escaped the protected mutation job")
    assert(!workflow.match?(/session.cookie|playwright|password/i), "unsupported transport appeared in workflow")
  end
end

exit(SubstackBridgeChecks.new.run) if $PROGRAM_NAME == __FILE__
