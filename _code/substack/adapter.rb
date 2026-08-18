# frozen_string_literal: true

module TedT
  module Substack
    class AdapterError < StandardError
      attr_reader :code

      def initialize(code, message)
        @code = code
        super(message)
      end
    end

    # Raised only when a delivery request may have reached Substack but no
    # authoritative response was received. Callers must persist `unknown` and
    # must not retry an email request automatically.
    class AmbiguousDeliveryError < AdapterError
      def initialize(message = "The delivery outcome is ambiguous")
        super("ambiguous_send", message)
      end
    end

    # Transport-neutral interface. A future official adapter must normalize
    # documented Publisher API responses into hashes consumed by Coordinator.
    class Adapter
      def assert_available!
        true
      end

      def upsert_draft(payload:, remote_draft_id:, expected_revision:, idempotency_key:)
        raise NotImplementedError
      end

      def publish_or_schedule(remote_draft_id:, delivery:, publish_at:, idempotency_key:)
        raise NotImplementedError
      end

      def get_post(remote_post_id: nil, remote_draft_id: nil)
        raise NotImplementedError
      end

      def update_web_post(remote_post_id:, payload:, expected_revision:, idempotency_key:)
        raise NotImplementedError
      end
    end

    # This is deliberately the only production adapter in the repository.
    # It performs no network access and fails before reading a credential.
    class UnavailableAdapter < Adapter
      OPERATIONS = %i[
        upsert_draft
        publish_or_schedule
        get_post
        update_web_post
      ].freeze

      def initialize(name: "artifact_only")
        @name = name
      end

      def assert_available!
        raise AdapterError.new(
          "official_adapter_unavailable",
          "Substack adapter '#{@name}' is disabled until documented write access and a capability canary are approved"
        )
      end

      OPERATIONS.each do |operation|
        define_method(operation) do |**_arguments|
          assert_available!
        end
      end
    end

    module AdapterRegistry
      module_function

      def build(name)
        normalized = name.to_s.strip
        normalized = "artifact_only" if normalized.empty?

        # `official` remains fail-closed on purpose. Replace this branch with a
        # documented adapter only after the capability contract and canary are
        # committed alongside tests.
        case normalized
        when "artifact_only", "official"
          UnavailableAdapter.new(name: normalized)
        else
          raise AdapterError.new("unknown_adapter", "Unknown Substack adapter '#{normalized}'")
        end
      end
    end

    # Coordinates normalized adapter operations without knowing an endpoint or
    # wire format. Tests inject a fake adapter; production is unavailable until
    # an official contract exists.
    class Coordinator
      def initialize(adapter:, clock: -> { Time.now })
        @adapter = adapter
        @clock = clock
      end

      def upsert_draft(payload:, entry:, persist:, candidate: nil)
        @adapter.assert_available!
        draft_id = entry.dig("remote", "draft_id")
        expected_revision = entry.dig("remote", "revision")
        if !blank?(draft_id)
          current = @adapter.get_post(remote_draft_id: draft_id)
          verify_existing_revision!(entry, current, expected_revision, persist, kind: "draft")
        end
        response = @adapter.upsert_draft(
          payload: payload,
          remote_draft_id: draft_id,
          expected_revision: expected_revision,
          idempotency_key: idempotency_key("draft", payload)
        )

        require_hash!(response)
        verify_content_hash!(response, payload, "draft response")
        entry["remote"] ||= {}
        entry["remote"]["draft_id"] = required_response(response, "draft_id")
        entry["remote"]["revision"] = required_response(response, "revision")
        refresh_entry!(entry, payload, candidate)
        entry["state"] = "drafted"
        entry["updated_at"] = timestamp
        persist.call
        response
      end

      def publish_or_schedule(payload:, entry:, persist:, candidate: nil)
        @adapter.assert_available!
        delivery = candidate&.fetch("effective_delivery", nil) || payload.fetch("delivery")
        draft_id = entry.dig("remote", "draft_id")
        request_returned = false
        raise AdapterError.new("missing_remote_draft", "A remote draft ID is required for release") if blank?(draft_id)

        if delivery.fetch("email")
          previous = entry.dig("email", "request_status")
          if %w[accepted unknown].include?(previous)
            raise AdapterError.new("email_retry_blocked", "Email was already accepted or has an unknown outcome")
          end
          unless entry["state"] == "publish_intent" && entry["intent_payload_hash"] == payload.fetch("payload_hash")
            raise AdapterError.new(
              "missing_durable_intent",
              "Email delivery requires a matching, durably persisted publish_intent"
            )
          end
        end

        response = @adapter.publish_or_schedule(
          remote_draft_id: draft_id,
          delivery: delivery,
          publish_at: payload["publish_at"],
          idempotency_key: idempotency_key("release", payload)
        )
        request_returned = true

        require_hash!(response)
        validate_release_response!(response, delivery, payload["publish_at"])
        remote_post_id = required_response(response, "post_id")
        current = @adapter.get_post(remote_post_id: remote_post_id)
        verify_remote_after_mutation!(current, payload, response)
        apply_release_response(entry, response, current, delivery, payload, candidate)
        persist.call
        response
      rescue AmbiguousDeliveryError
        record_unknown_email!(entry, persist) if delivery && delivery["email"]
        raise
      rescue AdapterError
        # Once a response came back, a malformed response or failed readback can
        # no longer prove that an email was not accepted. Persist unknown before
        # surfacing the adapter error so no later run retries automatically.
        record_unknown_email!(entry, persist) if request_returned && delivery && delivery["email"]
        raise
      end

      def update_web_post(payload:, entry:, persist:, candidate: nil)
        @adapter.assert_available!
        if payload.dig("delivery", "web") != true && entry.dig("email", "request_status") == "accepted"
          raise AdapterError.new(
            "email_only_correction_requires_manual",
            "An emailed post without an approved web copy cannot be corrected automatically"
          )
        end
        post_id = entry.dig("remote", "post_id")
        raise AdapterError.new("missing_remote_post", "A remote post ID is required for a correction") if blank?(post_id)

        current = @adapter.get_post(remote_post_id: post_id)
        expected_revision = entry.dig("remote", "revision")
        verify_existing_revision!(entry, current, expected_revision, persist, kind: "post")

        effective = candidate&.fetch("effective_delivery", nil) || { "web" => true, "email" => false }
        unless effective == { "web" => true, "email" => false }
          raise AdapterError.new("unsafe_correction_delivery", "Corrections must be web-only and must never resend email")
        end
        transport_payload = Util.deep_stringify(payload)
        transport_payload["delivery"] = effective
        transport_payload["publish_at"] = nil
        transport_payload = Util.add_payload_hash(transport_payload)

        response = @adapter.update_web_post(
          remote_post_id: post_id,
          payload: transport_payload,
          expected_revision: expected_revision,
          idempotency_key: idempotency_key("web-update", payload)
        )
        require_hash!(response)
        response_revision = required_response(response, "revision")
        verified = @adapter.get_post(remote_post_id: post_id)
        verify_remote_after_mutation!(verified, payload, response)
        entry["remote"]["revision"] = response_revision
        entry["remote"]["url"] = required_response(verified, "url")
        lock_slug!(entry, payload, response, verified)
        refresh_entry!(entry, payload, candidate, effective_delivery: effective)
        entry["state"] = "published_web"
        entry["web"] ||= {}
        entry["web"]["published"] = true
        entry["web"]["status"] = "published"
        entry["web"]["verified_at"] = timestamp
        entry["updated_at"] = timestamp
        persist.call
        response
      end

      private

      def idempotency_key(operation, payload)
        [operation, payload.fetch("source_id"), payload.fetch("payload_hash")].join(":")
      end

      def required_response(response, key)
        value = response[key]
        raise AdapterError.new("invalid_adapter_response", "Adapter response omitted #{key}") if blank?(value)

        value
      end

      def require_hash!(response)
        return if response.is_a?(Hash)

        raise AdapterError.new("invalid_adapter_response", "Adapter response must be a mapping")
      end

      def verify_content_hash!(response, payload, context)
        expected = payload["content_hash"] || Util.content_hash(payload)
        actual = required_response(response, "content_hash")
        return if actual == expected

        raise AdapterError.new("invalid_adapter_response", "#{context} content hash does not match the prepared article")
      end

      def verify_existing_revision!(entry, current, expected_revision, persist, kind:)
        require_hash!(current)
        if blank?(expected_revision) || blank?(current["revision"])
          record_conflict!(entry, persist)
          raise AdapterError.new("remote_revision_unavailable", "A remote revision is required before updating a #{kind}")
        end
        if current["revision"] != expected_revision
          record_conflict!(entry, persist)
          raise AdapterError.new("remote_drift", "The Substack #{kind} changed outside this bridge")
        end
        expected_content = entry["content_hash"]
        if !blank?(expected_content) && current["content_hash"] != expected_content
          record_conflict!(entry, persist)
          raise AdapterError.new("remote_drift", "The Substack #{kind} content changed outside this bridge")
        end
      end

      def record_conflict!(entry, persist)
        entry["state"] = "conflict"
        entry["conflict_detected_at"] = timestamp
        entry["updated_at"] = timestamp
        persist.call
      end

      def record_unknown_email!(entry, persist)
        entry["state"] = "unknown"
        entry["email"] ||= {}
        entry["email"]["request_status"] = "unknown"
        entry["email"]["delivery_evidence"] = "unknown"
        entry["updated_at"] = timestamp
        persist.call
      end

      def validate_release_response!(response, delivery, publish_at)
        %w[post_id url revision slug].each { |key| required_response(response, key) }
        unless response["web_published"] == true || response["web_published"] == false
          raise AdapterError.new("invalid_adapter_response", "Adapter response omitted explicit web_published status")
        end
        if publish_at
          unless response["scheduled"] == true
            raise AdapterError.new("invalid_adapter_response", "Scheduled release was not explicitly accepted")
          end
        elsif delivery["web"] && response["web_published"] != true
          raise AdapterError.new("invalid_adapter_response", "Immediate web publication was not confirmed")
        elsif !delivery["web"] && response["web_published"] != false
          raise AdapterError.new("invalid_adapter_response", "Adapter reported an unexpected web publication")
        end
        return unless delivery["email"]
        unless response["email_request_accepted"] == true || response["email_request_accepted"] == false
          raise AdapterError.new("invalid_adapter_response", "Adapter response omitted explicit email request status")
        end
        unless response["email_request_accepted"] == true
          raise AdapterError.new("email_not_accepted", "Substack did not accept the approved email request")
        end
      end

      def verify_remote_after_mutation!(current, payload, response)
        require_hash!(current)
        verify_content_hash!(current, payload, "remote readback")
        %w[revision url slug].each { |key| required_response(current, key) }
        if response["revision"] && current["revision"] != response["revision"]
          raise AdapterError.new("invalid_adapter_response", "Remote readback revision does not match the mutation response")
        end
        if response["url"] && current["url"] != response["url"]
          raise AdapterError.new("invalid_adapter_response", "Remote readback URL does not match the mutation response")
        end
      end

      def apply_release_response(entry, response, current, delivery, payload, candidate)
        entry["remote"] ||= {}
        entry["remote"]["post_id"] = required_response(response, "post_id")
        entry["remote"]["url"] = required_response(current, "url")
        entry["remote"]["revision"] = required_response(current, "revision")
        lock_slug!(entry, payload, response, current)
        refresh_entry!(entry, payload, candidate, effective_delivery: delivery)
        entry["web"] ||= {}
        web_status = current["web_status"] || (response["scheduled"] == true ? "scheduled" : (response["web_published"] ? "published" : "not_published"))
        unless %w[not_published scheduled published].include?(web_status)
          raise AdapterError.new("invalid_adapter_response", "Remote readback has an invalid web status")
        end
        entry["web"]["status"] = web_status
        entry["web"]["published"] = web_status == "published"
        if web_status == "published"
          entry["web"]["published_at"] ||= timestamp
          entry["web"]["verified_at"] = timestamp
        end
        entry["email"] ||= {}
        if delivery["email"]
          entry["email"]["request_status"] = "accepted"
          entry["email"]["requested_at"] = timestamp
          entry["email"]["delivery_evidence"] = response["email_delivery_evidence"] || "unknown"
        else
          entry["email"]["request_status"] ||= "not_requested"
          entry["email"]["delivery_evidence"] ||= "unknown"
        end
        entry["state"] = if entry.dig("email", "request_status") == "unknown"
                           "unknown"
                         elsif entry.dig("email", "request_status") == "accepted"
                           "email_accepted"
                         elsif entry.dig("web", "published")
                           "published_web"
                         else
                           "scheduled"
                         end
        entry.delete("intent_payload_hash")
        entry.delete("intent_created_at")
        entry["updated_at"] = timestamp
      end

      def refresh_entry!(entry, payload, candidate, effective_delivery: nil)
        if candidate
          paths = Array(entry["source_paths"]) | [entry["source_path"], candidate["source_path"]].compact
          entry["source_path"] = candidate["source_path"]
          entry["source_paths"] = paths
          entry["source_sha"] = candidate["source_sha"]
        end
        entry["payload_hash"] = payload.fetch("payload_hash")
        entry["content_hash"] = payload["content_hash"] || Util.content_hash(payload)
        entry["field_hashes"] = Util.field_hashes(payload)
        entry["canonical_url"] = payload["canonical_url"]
        entry["proposed_slug"] = payload["slug"]
        entry["audience"] = payload["audience"]
        entry["delivery"] = payload["delivery"]
        entry["last_effective_delivery"] = effective_delivery || candidate&.dig("effective_delivery") || payload["delivery"]
        entry["publish_at"] = payload["publish_at"]
      end

      def lock_slug!(entry, payload, response, current)
        assigned = current["slug"] || response["slug"]
        raise AdapterError.new("invalid_adapter_response", "Substack did not return an assigned slug") if blank?(assigned)
        if payload["slug"] && assigned != payload["slug"]
          raise AdapterError.new("invalid_adapter_response", "Substack assigned a different slug than the approved payload")
        end
        if entry["slug"] && entry["slug"] != assigned
          raise AdapterError.new("remote_drift", "Substack changed the locked slug")
        end
        entry["slug"] = assigned
      end

      def timestamp
        @clock.call.iso8601
      end

      def blank?(value)
        value.nil? || value.to_s.strip.empty?
      end
    end
  end
end
