#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "optparse"
require "time"

require_relative "bridge"

module TedT
  module Substack
    class CLI
      def initialize(argv, stdout: $stdout, stderr: $stderr, env: ENV)
        @argv = argv.dup
        @stdout = stdout
        @stderr = stderr
        @env = env
      end

      def run
        command = @argv.shift
        case command
        when "prepare" then prepare
        when "verify-package" then verify_package
        when "adapter-check" then adapter_check
        when "mark-intent" then mark_intent
        when "publish" then publish
        when "reconcile" then reconcile
        when "record-manual" then record_manual
        else
          raise BridgeError.new(
            "unknown_command",
            "Usage: cli.rb prepare|verify-package|adapter-check|mark-intent|publish|reconcile|record-manual"
          )
        end
        0
      rescue BridgeError, AdapterError => error
        body = if error.respond_to?(:to_h)
                 error.to_h
               else
                 { "code" => error.code, "message" => error.message }
               end
        @stderr.puts(JSON.generate("ok" => false, "error" => body))
        1
      rescue OptionParser::ParseError => error
        @stderr.puts(JSON.generate("ok" => false, "error" => { "code" => "invalid_arguments", "message" => error.message }))
        2
      end

      private

      def prepare
        options = {
          root: ".",
          output: "tmp/substack-package",
          ledger: "cache/substack-sync.json",
          source_sha: "local",
          publication_url: nil,
          repository: nil,
          source_id: nil,
          backfill: false,
          force_package: nil,
          validate_remote_assets: false,
          now: -> { Time.now },
          github_output: nil
        }
        parser = OptionParser.new do |value|
          value.on("--root PATH") { |argument| options[:root] = argument }
          value.on("--output PATH") { |argument| options[:output] = argument }
          value.on("--ledger PATH") { |argument| options[:ledger] = argument }
          value.on("--source-sha SHA") { |argument| options[:source_sha] = argument }
          value.on("--publication-url URL") { |argument| options[:publication_url] = blank_to_nil(argument) }
          value.on("--repository OWNER/REPO") { |argument| options[:repository] = blank_to_nil(argument) }
          value.on("--source-id ID") { |argument| options[:source_id] = argument }
          value.on("--backfill") { options[:backfill] = true }
          value.on("--force-package OPERATION") { |argument| options[:force_package] = argument }
          value.on("--validate-remote-assets") { options[:validate_remote_assets] = true }
          value.on("--now ISO8601") { |argument| options[:now] = fixed_clock(argument) }
          value.on("--github-output PATH") { |argument| options[:github_output] = argument }
        end
        parser.parse!(@argv)
        ensure_empty_arguments!

        ledger = Ledger.load(options.fetch(:ledger))
        manifest = PackageBuilder.new(
          root: options.fetch(:root),
          output: options.fetch(:output),
          ledger: ledger,
          source_sha: options.fetch(:source_sha),
          publication_url: options[:publication_url],
          repository: options[:repository],
          now: options.fetch(:now),
          backfill: options.fetch(:backfill),
          source_id: options[:source_id],
          force_package: options[:force_package],
          validate_remote_assets: options.fetch(:validate_remote_assets)
        ).build

        email_count = manifest.fetch("candidates").count { |candidate| candidate.dig("effective_delivery", "email") == true }
        output_values = {
          "candidate_count" => manifest.fetch("candidate_count"),
          "email_candidate_count" => email_count,
          "has_candidates" => manifest.fetch("candidate_count").positive?,
          "manifest_sha256" => Digest::SHA256.file(File.join(options.fetch(:output), "manifest.json")).hexdigest
        }
        append_github_output(options[:github_output], output_values) if options[:github_output]
        @stdout.puts(JSON.generate({ "ok" => true }.merge(output_values)))
      end

      def verify_package
        options = { package: nil, source_sha: nil, ledger: nil, publication_url: nil }
        OptionParser.new do |value|
          value.on("--package PATH") { |argument| options[:package] = argument }
          value.on("--source-sha SHA") { |argument| options[:source_sha] = argument }
          value.on("--ledger PATH") { |argument| options[:ledger] = argument }
          value.on("--publication-url URL") { |argument| options[:publication_url] = argument }
        end.parse!(@argv)
        ensure_empty_arguments!
        required_option!(options, :package)

        package = PackageReader.new(options.fetch(:package))
        if options[:source_sha] && package.manifest["source_sha"] != options[:source_sha]
          raise BridgeError.new("stale_package", "Prepared package source SHA does not match the approved deployment")
        end
        if options[:ledger] || options[:publication_url]
          required_option!(options, :ledger)
          required_option!(options, :publication_url)
          ledger = Ledger.load(options.fetch(:ledger))
          package.verify_context!(ledger: ledger, publication_url: options.fetch(:publication_url))
        end
        package.manifest.fetch("candidates").each { |candidate| package.candidate(candidate.fetch("id")) }
        @stdout.puts(JSON.generate("ok" => true, "candidate_count" => package.manifest.fetch("candidate_count")))
      end

      def adapter_check
        options = { adapter: @env.fetch("SUBSTACK_ADAPTER", "artifact_only") }
        OptionParser.new { |value| value.on("--adapter NAME") { |argument| options[:adapter] = argument } }.parse!(@argv)
        ensure_empty_arguments!
        AdapterRegistry.build(options.fetch(:adapter)).assert_available!
        @stdout.puts(JSON.generate("ok" => true, "adapter" => options.fetch(:adapter)))
      end

      def mark_intent
        options = mutation_options
        parser = OptionParser.new do |value|
          mutation_parser(value, options)
          value.on("--now ISO8601") { |argument| options[:now] = Time.iso8601(argument) }
        end
        parser.parse!(@argv)
        ensure_empty_arguments!
        require_mutation_options!(options)

        package = PackageReader.new(options.fetch(:package))
        candidate = package.candidate(options.fetch(:source_id))
        unless candidate.dig("effective_delivery", "email") == true
          raise BridgeError.new("email_intent_not_required", "Candidate does not request email delivery")
        end
        ledger = Ledger.load(options.fetch(:ledger))
        require_bound_publication!(package, ledger)
        ledger.mark_intent!(candidate, now: options.fetch(:now))
        ledger.save!
        @stdout.puts(JSON.generate("ok" => true, "state" => "publish_intent", "source_id" => options.fetch(:source_id)))
      end

      def publish
        options = mutation_options.merge(
          adapter: @env.fetch("SUBSTACK_ADAPTER", "artifact_only"),
          phase: nil,
          now: Time.now
        )
        parser = OptionParser.new do |value|
          mutation_parser(value, options)
          value.on("--adapter NAME") { |argument| options[:adapter] = argument }
          value.on("--phase PHASE", %w[upsert release correction]) { |argument| options[:phase] = argument }
          value.on("--now ISO8601") { |argument| options[:now] = Time.iso8601(argument) }
        end
        parser.parse!(@argv)
        ensure_empty_arguments!
        require_mutation_options!(options)
        required_option!(options, :phase)

        # Availability is asserted before opening or changing the ledger. The
        # repository ships no credential-reading adapter today.
        adapter = AdapterRegistry.build(options.fetch(:adapter))
        adapter.assert_available!

        package = PackageReader.new(options.fetch(:package))
        candidate = package.candidate(options.fetch(:source_id))
        ledger = Ledger.load(options.fetch(:ledger))
        require_bound_publication!(package, ledger, bind_empty: options.fetch(:phase) == "upsert")
        payload = candidate.fetch("payload")
        entry = ledger.entries[options.fetch(:source_id)]
        guard_publication_phase!(options.fetch(:phase), entry, payload, options.fetch(:now))
        entry ||= ledger.entries[options.fetch(:source_id)] = seed_entry(candidate, options.fetch(:now))
        coordinator = Coordinator.new(adapter: adapter, clock: -> { options.fetch(:now) })
        persist = -> { ledger.save! }

        case options.fetch(:phase)
        when "upsert"
          coordinator.upsert_draft(payload: payload, entry: entry, persist: persist, candidate: candidate)
        when "release"
          coordinator.publish_or_schedule(payload: payload, entry: entry, persist: persist, candidate: candidate)
        when "correction"
          coordinator.update_web_post(payload: payload, entry: entry, persist: persist, candidate: candidate)
        end
        @stdout.puts(JSON.generate("ok" => true, "state" => entry["state"], "source_id" => options.fetch(:source_id)))
      end

      def reconcile
        options = mutation_options.merge(adapter: @env.fetch("SUBSTACK_ADAPTER", "artifact_only"), now: Time.now)
        parser = OptionParser.new do |value|
          mutation_parser(value, options)
          value.on("--adapter NAME") { |argument| options[:adapter] = argument }
          value.on("--now ISO8601") { |argument| options[:now] = Time.iso8601(argument) }
        end
        parser.parse!(@argv)
        ensure_empty_arguments!
        require_mutation_options!(options)

        adapter = AdapterRegistry.build(options.fetch(:adapter))
        adapter.assert_available!
        package = PackageReader.new(options.fetch(:package))
        candidate = package.candidate(options.fetch(:source_id))
        ledger = Ledger.load(options.fetch(:ledger))
        require_bound_publication!(package, ledger)
        entry = ledger[options.fetch(:source_id)]
        raise BridgeError.new("missing_ledger_entry", "No ledger entry exists for reconciliation") unless entry
        remote_post_id = entry.dig("remote", "post_id")
        remote_draft_id = entry.dig("remote", "draft_id")
        if Util.blank?(remote_post_id) && Util.blank?(remote_draft_id)
          raise BridgeError.new("missing_remote_post", "Ledger has no remote post or draft ID")
        end

        remote = if Util.blank?(remote_post_id)
                   adapter.get_post(remote_draft_id: remote_draft_id)
                 else
                   adapter.get_post(remote_post_id: remote_post_id)
                 end
        unless remote.is_a?(Hash) && !Util.blank?(remote["content_hash"]) && !Util.blank?(remote["revision"])
          raise BridgeError.new("invalid_adapter_response", "Reconciliation requires normalized content and revision state")
        end
        if remote["content_hash"] != entry["content_hash"]
          entry["state"] = "conflict"
          entry["conflict_detected_at"] = options.fetch(:now).iso8601
          ledger.save!
          raise BridgeError.new("remote_drift", "Remote content differs from the last synchronized ledger version")
        end
        entry["last_verified_at"] = options.fetch(:now).iso8601
        entry["remote"] ||= {}
        entry["remote"]["revision"] = remote.fetch("revision")
        entry["remote"]["post_id"] ||= remote["post_id"] unless Util.blank?(remote["post_id"])
        entry["remote"]["url"] = remote["url"] unless Util.blank?(remote["url"])
        if entry["slug"] && remote["slug"] && entry["slug"] != remote["slug"]
          entry["state"] = "conflict"
          entry["conflict_detected_at"] = options.fetch(:now).iso8601
          ledger.save!
          raise BridgeError.new("remote_drift", "Remote slug differs from the locked ledger slug")
        end
        entry["slug"] ||= remote["slug"] unless Util.blank?(remote["slug"])
        reconcile_remote_state!(entry, remote, options.fetch(:now))
        ledger.save!
        @stdout.puts(JSON.generate("ok" => true, "state" => entry["state"], "verified" => true))
      end

      def record_manual
        options = mutation_options.merge(
          publication_url: @env["SUBSTACK_PUBLICATION_URL"],
          remote_url: nil,
          remote_post_id: nil,
          remote_draft_id: nil,
          web_status: "published",
          email_status: "not_requested",
          now: Time.now
        )
        parser = OptionParser.new do |value|
          mutation_parser(value, options)
          value.on("--publication-url URL") { |argument| options[:publication_url] = argument }
          value.on("--remote-url URL") { |argument| options[:remote_url] = argument }
          value.on("--remote-post-id ID") { |argument| options[:remote_post_id] = blank_to_nil(argument) }
          value.on("--remote-draft-id ID") { |argument| options[:remote_draft_id] = blank_to_nil(argument) }
          value.on("--web-status STATUS", %w[not_published scheduled published unknown]) { |argument| options[:web_status] = argument }
          value.on("--email-status STATUS", %w[not_requested accepted unknown]) { |argument| options[:email_status] = argument }
          value.on("--now ISO8601") { |argument| options[:now] = Time.iso8601(argument) }
        end
        parser.parse!(@argv)
        ensure_empty_arguments!
        require_mutation_options!(options)
        %i[publication_url remote_url].each { |key| required_option!(options, key) }

        package = PackageReader.new(options.fetch(:package))
        candidate = package.candidate(options.fetch(:source_id))
        packaged_publication = package.manifest["publication_url"]
        unless !Util.blank?(packaged_publication) &&
               Util.normalized_https_origin(packaged_publication) == Util.normalized_https_origin(options.fetch(:publication_url))
          raise BridgeError.new("publication_mismatch", "Manual record targets a different publication than the approved package")
        end
        ledger = Ledger.load(options.fetch(:ledger))
        ledger.record_manual!(
          candidate,
          publication_url: options.fetch(:publication_url),
          remote_url: options.fetch(:remote_url),
          remote_post_id: options[:remote_post_id],
          remote_draft_id: options[:remote_draft_id],
          web_status: options.fetch(:web_status),
          email_status: options.fetch(:email_status),
          now: options.fetch(:now)
        )
        ledger.save!
        @stdout.puts(JSON.generate("ok" => true, "state" => ledger[options.fetch(:source_id)]["state"]))
      end

      def mutation_options
        { package: nil, ledger: nil, source_id: nil, now: Time.now }
      end

      def mutation_parser(parser, options)
        parser.on("--package PATH") { |argument| options[:package] = argument }
        parser.on("--ledger PATH") { |argument| options[:ledger] = argument }
        parser.on("--source-id ID") { |argument| options[:source_id] = argument }
      end

      def require_mutation_options!(options)
        %i[package ledger source_id].each { |key| required_option!(options, key) }
      end

      def required_option!(options, key)
        return unless Util.blank?(options[key])

        raise BridgeError.new("missing_argument", "--#{key.to_s.tr('_', '-')} is required")
      end

      def ensure_empty_arguments!
        return if @argv.empty?

        raise OptionParser::InvalidArgument, "Unexpected arguments: #{@argv.join(' ')}"
      end

      def fixed_clock(value)
        parsed = Time.iso8601(value)
        -> { parsed }
      rescue ArgumentError
        raise OptionParser::InvalidArgument, "--now must be ISO-8601"
      end

      def blank_to_nil(value)
        value.nil? || value.strip.empty? ? nil : value.strip
      end

      def append_github_output(path, values)
        File.open(path, "a") do |file|
          values.each { |key, value| file.puts("#{key}=#{value}") }
        end
      end

      def seed_entry(candidate, now)
        payload = candidate.fetch("payload")
        {
          "source_path" => candidate.fetch("source_path"),
          "source_paths" => [candidate.fetch("source_path")],
          "source_sha" => candidate.fetch("source_sha"),
          "payload_hash" => payload.fetch("payload_hash"),
          "content_hash" => payload["content_hash"] || TedT::Substack::Util.content_hash(payload),
          "field_hashes" => TedT::Substack::Util.field_hashes(payload),
          "canonical_url" => payload["canonical_url"],
          "proposed_slug" => payload["slug"],
          "audience" => payload.fetch("audience"),
          "delivery" => payload.fetch("delivery"),
          "last_effective_delivery" => candidate.fetch("effective_delivery"),
          "publish_at" => payload["publish_at"],
          "state" => "prepared",
          "remote" => {},
          "web" => { "status" => "not_published", "published" => false },
          "email" => { "request_status" => "not_requested", "delivery_evidence" => "unknown" },
          "updated_at" => now.iso8601
        }
      end

      def guard_publication_phase!(phase, entry, payload, now)
        if entry && %w[publish_intent unknown conflict manual_review].include?(entry["state"]) && phase != "release"
          raise BridgeError.new(
            "blocked_ledger_state",
            "Ledger state '#{entry['state']}' requires reconciliation before another mutation"
          )
        end

        case phase
        when "upsert"
          return unless entry
          if entry["payload_hash"] == payload["payload_hash"] &&
             %w[scheduled published_web email_accepted].include?(entry["state"])
            raise BridgeError.new("already_synchronized", "The prepared payload is already recorded")
          end
          if %w[scheduled published_web email_accepted].include?(entry["state"])
            raise BridgeError.new("correction_required", "A published post must use the web-correction path")
          end
        when "correction"
          raise BridgeError.new("missing_ledger_entry", "A correction requires an existing ledger entry") unless entry
          if entry["payload_hash"] == payload["payload_hash"]
            raise BridgeError.new("already_synchronized", "The prepared payload is already recorded")
          end
        when "release"
          raise BridgeError.new("missing_ledger_entry", "A release requires a persisted draft") unless entry
          unless %w[drafted publish_intent].include?(entry["state"])
            raise BridgeError.new("release_not_ready", "Release requires drafted or publish_intent state")
          end
          unless entry["payload_hash"] == payload["payload_hash"]
            raise BridgeError.new("stale_package", "Prepared payload no longer matches the durable draft state")
          end
          if payload["publish_at"] && DateTime.iso8601(payload["publish_at"]) <= now.to_datetime
            raise BridgeError.new("schedule_expired", "The approved schedule passed while this job was waiting")
          end
        end
      end

      def require_bound_publication!(package, ledger, bind_empty: false)
        publication = package.manifest["publication_url"]
        if Util.blank?(publication)
          raise BridgeError.new("missing_publication_url", "Prepared package has no Substack publication URL")
        end
        if bind_empty && Util.blank?(ledger.publication_url) && ledger.entries.empty?
          ledger.bind_publication_url!(publication)
          ledger.save!
        else
          ledger.verify_publication_url!(publication)
        end
      end

      def reconcile_remote_state!(entry, remote, now)
        web_status = remote["web_status"]
        email_status = remote["email_request_status"]
        unless %w[not_published scheduled published unknown].include?(web_status)
          raise BridgeError.new("invalid_adapter_response", "Reconciliation returned an invalid web status")
        end
        unless %w[not_requested pending accepted unknown rejected].include?(email_status)
          raise BridgeError.new("invalid_adapter_response", "Reconciliation returned an invalid email request status")
        end
        if %w[scheduled published].include?(web_status) && Util.blank?(remote["url"])
          raise BridgeError.new("invalid_adapter_response", "Scheduled or published remote state requires a URL")
        end

        entry["web"] ||= {}
        entry["web"]["status"] = web_status
        entry["web"]["published"] = web_status == "published"
        entry["web"]["verified_at"] = now.iso8601 if web_status == "published"
        entry["email"] ||= {}
        prior_state = entry["state"]
        if email_status == "accepted"
          entry["email"]["request_status"] = "accepted"
          entry["email"]["delivery_evidence"] = remote["email_delivery_evidence"] || "unknown"
          entry["state"] = "email_accepted"
        elsif %w[publish_intent unknown].include?(prior_state)
          # A missing/rejected send after an ambiguous or intended email request
          # requires an operator decision; it is never reopened automatically.
          entry["email"]["request_status"] = "unknown"
          entry["email"]["delivery_evidence"] = remote["email_delivery_evidence"] || "unknown"
          entry["state"] = "manual_review"
        elsif web_status == "published"
          entry["state"] = "published_web"
        elsif web_status == "scheduled"
          entry["state"] = "scheduled"
        else
          entry["state"] = "drafted"
        end
        entry.delete("intent_payload_hash") unless entry["state"] == "manual_review"
        entry.delete("intent_created_at") unless entry["state"] == "manual_review"
        entry["updated_at"] = now.iso8601
      end
    end
  end
end

exit(TedT::Substack::CLI.new(ARGV).run) if $PROGRAM_NAME == __FILE__
