#!/usr/bin/env ruby
# frozen_string_literal: true

# Standalone build/CI tooling. This is not a Jekyll plugin.
require 'json'
require 'uri'
require 'net/http'
require 'openssl'
require 'resolv'
require 'ipaddr'
require 'digest'
require 'time'
require 'fileutils'
require 'optparse'
require 'nokogiri'

module IndieWeb
  class Error < StandardError; end

  def self.url(value, base = nil, fragment: false)
    text = value.to_s
    raise Error, 'Invalid URL' if text.empty? || text.match?(/[\x00-\x20\x7f<>"\\]/)
    text = URI::DEFAULT_PARSER.escape(text, /[^\x00-\x7f]/)
    u = base ? URI.join(base, text) : URI.parse(text)
    raise Error, 'Only public HTTP URLs are supported' unless %w[http https].include?(u.scheme) && u.host && !u.userinfo
    u.fragment = nil unless fragment
    u.to_s
  rescue URI::Error
    raise Error, 'Invalid URL'
  end

  def self.optional_url(value)
    url(value, fragment: true)
  rescue Error
    nil
  end

  # URL paths are percent encoded; Jekyll writes Unicode filenames on disk.
  def self.site_file(site, value)
    path = URI(url(value)).path
    path = URI::DEFAULT_PARSER.unescape(path).force_encoding(Encoding::UTF_8)
    raise Error, 'Invalid build path' unless path.valid_encoding? && !path.match?(/[\x00\\]/)
    path += 'index.html' if path.end_with?('/')
    file = File.expand_path(path.delete_prefix('/'), site)
    raise Error, 'Manifest path escapes build directory' unless file.start_with?(File.expand_path(site) + '/')
    file
  end

  def self.read_json(path)
    JSON.parse(File.read(path))
  end

  def self.write_json(path, data)
    body = JSON.pretty_generate(data) + "\n"
    return false if File.file?(path) && File.read(path) == body
    FileUtils.mkdir_p(File.dirname(path))
    temporary = "#{path}.tmp-#{Process.pid}"
    File.write(temporary, body)
    File.rename(temporary, path)
    true
  ensure
    FileUtils.rm_f(temporary) if temporary
  end

  Response = Struct.new(:status, :headers, :body, :url, keyword_init: true)

  class HTTP
    # Reject special-use networks and pin the checked address to the connection.
    BLOCKED = %w[0.0.0.0/8 10.0.0.0/8 100.64.0.0/10 127.0.0.0/8
                 169.254.0.0/16 172.16.0.0/12 192.0.0.0/24 192.0.2.0/24
                 192.168.0.0/16 198.18.0.0/15 198.51.100.0/24 203.0.113.0/24
                 224.0.0.0/3 ::/96 ::ffff:0:0/96 64:ff9b::/96 100::/64
                 2001::/23 2001:db8::/32 fc00::/7 fe80::/10 ff00::/8].map { |v| IPAddr.new(v) }.freeze

    def self.public_address?(value)
      ip = IPAddr.new(value)
      !BLOCKED.any? { |range| range.include?(ip) }
    rescue IPAddr::InvalidAddressError
      false
    end

    def request(value, method: 'GET', form: nil, headers: {}, redirects: 5)
      current = IndieWeb.url(value)
      original_origin = URI(current).then { |u| [u.scheme, u.host, u.port] }
      loop do
        u = URI(current)
        addresses = Resolv.getaddresses(u.hostname)
        raise Error, 'Destination does not resolve to public addresses' if addresses.empty? || !addresses.all? { |a| self.class.public_address?(a) }
        http = Net::HTTP.new(u.hostname, u.port, nil)
        http.ipaddr = addresses.first
        http.use_ssl = u.scheme == 'https'
        http.verify_mode = OpenSSL::SSL::VERIFY_PEER
        http.open_timeout = 10
        http.read_timeout = 20
        http.write_timeout = 20
        request = method == 'POST' ? Net::HTTP::Post.new(u.request_uri) : Net::HTTP::Get.new(u.request_uri)
        request['User-Agent'] = 'tedt.org Webmention/1.0 (+https://tedt.org/)'
        request['Accept'] = 'text/html, application/json;q=0.9, */*;q=0.1'
        request['Accept-Encoding'] = 'identity'
        headers.each { |key, val| request[key] = val }
        request.set_form_data(form) if form
        result = nil
        http.start do |connection|
          connection.request(request) do |response|
            body = +''
            response.read_body do |chunk|
              raise Error, 'Response exceeds 4 MiB' if body.bytesize + chunk.bytesize > 4 * 1024 * 1024
              body << chunk
            end
            result = Response.new(status: response.code.to_i, headers: response.to_hash, body: body, url: current)
          end
        end
        return result unless [301, 302, 303, 307, 308].include?(result.status)
        raise Error, 'Redirect limit exceeded' if redirects.zero?
        location = result.headers.fetch('location', []).first
        raise Error, 'Redirect has no Location' unless location
        next_url = IndieWeb.url(location, current)
        next_origin = URI(next_url).then { |v| [v.scheme, v.host, v.port] }
        # Do not forward service credentials or a POST body to another origin.
        raise Error, 'Cross-origin authenticated redirect refused' if !headers.empty? && original_origin != next_origin
        raise Error, 'POST redirects must preserve method and body' if method == 'POST' && ![307, 308].include?(result.status)
        current = next_url
        redirects -= 1
      end
    rescue Timeout::Error, SocketError, SystemCallError, EOFError, OpenSSL::SSL::SSLError, Net::HTTPBadResponse => e
      raise Error, "HTTP request failed (#{e.class})"
    end
  end

  class Manifest
    attr_reader :entries, :aliases
    def initialize(data)
      raise Error, 'Invalid manifest version' unless data['version'] == 1
      @entries = data.fetch('entries').map { |entry| entry.merge('url' => IndieWeb.url(entry.fetch('url'))) }
      @aliases = {}
      (@entries + [{ 'url' => 'https://tedt.org/', 'aliases' => [] }]).each do |entry|
        canonical = IndieWeb.url(entry.fetch('url'))
        raise Error, 'Foreign canonical in manifest' unless URI(canonical).host == 'tedt.org' && URI(canonical).scheme == 'https'
        ([canonical] + Array(entry['aliases']).reject { |a| a.to_s.empty? }.map { |a| IndieWeb.url(a, canonical) }).each do |value|
          u = URI(value)
          next unless %w[tedt.org www.tedt.org].include?(u.host)
          %w[http https].product(%w[tedt.org www.tedt.org]).each do |scheme, host|
            v = u.dup
            v.scheme = scheme
            v.host = host
            key = v.to_s
            raise Error, 'Conflicting legacy URL aliases' if @aliases[key] && @aliases[key] != canonical
            @aliases[key] = canonical
          end
        end
      end
    end

    def canonical(value)
      @aliases[IndieWeb.url(value)]
    rescue Error
      nil
    end
  end

  class Mentions
    GROUPS = { 'in-reply-to' => 'replies', 'mention-of' => 'mentions', 'like-of' => 'likes',
               'repost-of' => 'reposts', 'bookmark-of' => 'bookmarks', 'rsvp' => 'rsvps', 'follow-of' => 'follows' }.freeze
    BRIDGE_PATH = %r{\A/(?:comment|like|repost|post|bookmark|rsvp)/}

    def initialize(manifest, policy, http: HTTP.new)
      @manifest, @policy, @http = manifest, policy, http
    end

    def fetch_all(token: nil)
      records = []
      if token && !token.empty?
        %w[tedt.org www.tedt.org].each do |domain|
          records.concat(fetch_pages([['domain', domain]], { 'Authorization' => "Bearer #{token}" }))
        end
      else
        # Public target queries never include private mentions. Keep URL lengths
        # bounded and below the API's maximum of 50 targets per request.
        batch = []
        @manifest.aliases.keys.sort.each do |target|
          if batch.length >= 30 || URI.encode_www_form(batch.map { |v| ['target[]', v] }).bytesize + target.bytesize * 3 > 10_000
            records.concat(fetch_pages(batch.map { |v| ['target[]', v] }))
            batch = []
          end
          batch << target
        end
        records.concat(fetch_pages(batch.map { |v| ['target[]', v] })) unless batch.empty?
      end
      records
    end

    def fetch_pages(parameters, headers = {})
      rows, page = [], 0
      loop do
        query = URI.encode_www_form(parameters + [['per-page', '100'], ['page', page.to_s]])
        response = @http.request("https://webmention.io/api/mentions.jf2?#{query}", headers: headers.merge('Accept' => 'application/json'))
        raise Error, "Webmention API returned #{response.status}; cache retained" unless response.status == 200
        data = JSON.parse(response.body)
        raise Error, 'Malformed Webmention API response; cache retained' unless data['children'].is_a?(Array)
        rows.concat(data['children'])
        paging = data['paging']
        if paging
          total = Integer(paging.fetch('total-pages'))
          break if page + 1 >= total
        else
          break if data['children'].length < 100
        end
        page += 1
        raise Error, 'API pagination limit exceeded; cache retained' if page > 1000
      end
      rows
    rescue JSON::ParserError, KeyError, ArgumentError
      raise Error, 'Malformed Webmention API response; cache retained'
    end

    def trusted?(source)
      u = URI(source)
      origin = "#{u.scheme}://#{u.host}"
      origin += ":#{u.port}" unless u.port == (u.scheme == 'https' ? 443 : 80)
      return true if Array(@policy['trusted_origins']).include?(origin)
      return false unless u.scheme == 'https' && u.port == 443
      return BRIDGE_PATH.match?(u.path) if %w[brid.gy brid-gy.appspot.com].include?(u.host)
      %w[ap.brid.gy bsky.brid.gy web.brid.gy].include?(u.host) && u.path.start_with?('/convert/')
    end

    def normalize(records)
      result = { 'version' => 1, 'by_target' => {} }
      pending, seen = [], {}
      records.sort_by { |x| [x['wm-received'].to_s, x['wm-id'].to_s] }.each do |raw|
        next unless raw['wm-private'] == false
        id = raw['wm-id'].to_s
        next unless id.match?(/\A\d+\z/) && !seen[id]
        seen[id] = true
        next if Array(@policy['blocked_ids']).map(&:to_s).include?(id)
        canonical = @manifest.canonical(raw['wm-target'])
        source = IndieWeb.optional_url(raw['wm-source'])
        next unless canonical && source
        unless trusted?(source) || Array(@policy['approved_ids']).map(&:to_s).include?(id)
          pending << id
          next
        end
        type = raw['wm-property'] || 'mention-of'
        group = GROUPS[type] || 'mentions'
        author = raw['author'].is_a?(Hash) ? raw['author'] : {}
        text = raw.dig('content', 'text') if raw['content'].is_a?(Hash)
        published = [raw['published'], raw['wm-received']].filter_map do |value|
          Time.iso8601(value.to_s).iso8601 rescue nil
        end.first
        record = {
          'id' => id, 'source' => source,
          'url' => IndieWeb.optional_url(raw['url']) || source,
          'author' => { 'name' => author['name'].to_s.strip[0, 200], 'url' => IndieWeb.optional_url(author['url']) },
          'type' => type, 'published' => published,
          'name' => raw['name'].to_s[0, 500], 'content' => text.to_s[0, 10_000],
          'rsvp' => %w[yes no maybe interested].include?(raw['rsvp']) ? raw['rsvp'] : nil
        }
        result['by_target'][canonical] ||= GROUPS.values.uniq.to_h { |g| [g, []] }
        result['by_target'][canonical][group] << record
      end
      result['by_target'] = result['by_target'].sort.to_h
      [result, pending.sort]
    end
  end

  class Sender
    attr_reader :http
    def initialize(http: HTTP.new)
      @http = http
    end

    def content_html(doc)
      nodes = doc.css('.h-entry .e-content').reject { |node| node.ancestors.any? { |p| p['class'].to_s.split.include?('e-content') } }
      return nil if nodes.empty?
      nodes.map(&:inner_html).join("\n")
    end

    def content_state(doc, source)
      content = content_html(doc)
      raise Error, "Missing article content for #{source}" unless content
      targets = Nokogiri::HTML.fragment(content).css('a[href]').filter_map { |n| IndieWeb.url(n['href'], source, fragment: true) rescue nil }
      targets.reject! { |v| IndieWeb.url(v) == source }
      targets = targets.uniq.sort
      { 'fingerprint' => targets.empty? ? 'no-targets' : Digest::SHA256.hexdigest(content), 'targets' => targets }
    end

    def split_fields(value, separator)
      fields, field, quoted, escaped, bracketed = [], +'', false, false, false
      value.each_char do |char|
        if char == separator && !quoted && !bracketed
          fields << field
          field = +''
          next
        end
        field << char
        if escaped
          escaped = false
        elsif quoted && char == '\\'
          escaped = true
        elsif char == '"'
          quoted = !quoted
        elsif !quoted && char == '<'
          bracketed = true
        elsif !quoted && char == '>'
          bracketed = false
        end
      end
      fields << field
      fields
    end

    def endpoint(target)
      response = @http.request(target)
      raise Error, "Target returned #{response.status}" unless response.status.between?(200, 299)
      Array(response.headers['link']).each do |header|
        split_fields(header, ',').each do |field|
          match = field.match(/\A\s*<([^>]*)>(.*)\z/m)
          next unless match
          href, params = match.captures
          rel = split_fields(params, ';').filter_map { |p| p.match(/\A\s*rel\s*=\s*(?:"([^"]*)"|([^;\s,]+))\s*\z/i) }.first
          next unless rel && (rel[1] || rel[2]).split.any? { |v| v.downcase == 'webmention' }
          return IndieWeb.url(href.empty? ? response.url : href, response.url)
        end
      end
      return nil unless Array(response.headers['content-type']).any? { |v| v.match?(%r{(?:text/html|application/xhtml\+xml)}i) }
      doc = Nokogiri::HTML(response.body)
      doc.css('link[rel], a[rel]').each do |node|
        next unless node['rel'].split.any? { |v| v.downcase == 'webmention' } && node.key?('href')
        return IndieWeb.url(node['href'].empty? ? response.url : node['href'], response.url)
      end
      nil
    end

    def deliver(source, target)
      destination = endpoint(target)
      return { 'state' => 'unsupported' } unless destination
      # Prefer an API acknowledgement over an HTML form's redirect response.
      response = @http.request(destination, method: 'POST',
                               form: { 'source' => source, 'target' => target },
                               headers: { 'Accept' => 'application/json' })
      if response.status.between?(200, 299)
        result = { 'state' => 'accepted', 'status' => response.status }
        receipt = response.headers.fetch('location', []).first
        safe_receipt = IndieWeb.url(receipt, response.url) rescue nil
        result['receipt'] = safe_receipt if safe_receipt
        result
      elsif response.status == 429 || response.status >= 500
        raise Error, "Receiver returned #{response.status}"
      else
        { 'state' => 'rejected', 'status' => response.status }
      end
    end

    def snapshot(site, manifest)
      manifest.entries.to_h do |entry|
        source = entry.fetch('url')
        file = IndieWeb.site_file(site, source)
        doc = Nokogiri::HTML(File.read(file))
        [source, content_state(doc, source)]
      end
    end

    def snapshot_stream(path)
      File.open(path) do |stream|
        header = JSON.parse(stream.readline)
        manifest = Manifest.new(header.fetch('manifest'))
        expected = manifest.entries.to_h do |entry|
          [IndieWeb.site_file('/pages-data', entry.fetch('url')).delete_prefix('/pages-data/'), entry.fetch('url')]
        end
        raise Error, 'Duplicate article paths in Pages manifest' unless expected.length == manifest.entries.length
        result = {}
        stream.each_line do |line|
          row = JSON.parse(line)
          source = expected[row['path']]
          next unless source
          raise Error, 'Duplicate article in Pages archive' if result.key?(source)
          body = row.fetch('body').unpack1('m0')
          raise Error, 'Article exceeds 4 MiB' if body.bytesize > 4 * 1024 * 1024
          result[source] = content_state(Nokogiri::HTML(body), source)
        end
        raise Error, 'Pages archive is missing article data' unless result.keys.sort == expected.values.sort
        result
      end
    rescue EOFError, ArgumentError
      raise Error, 'Invalid Pages artifact data'
    end

    def reconcile(state, snapshot)
      if state.empty?
        return { 'version' => 1, 'sources' => snapshot.transform_values { |v| v.merge('deliveries' => {}) } }
      end
      raise Error, 'Invalid outbox version' unless state['version'] == 1 && state['sources'].is_a?(Hash)
      result = Marshal.load(Marshal.dump(state))
      (result['sources'].keys | snapshot.keys).each do |source|
        old = result['sources'][source]
        current = snapshot[source] || { 'fingerprint' => 'deleted', 'targets' => [] }
        next if old && old['fingerprint'] == current['fingerprint']
        targets = (Array(old && old['targets']) | Array(old && old['deliveries']&.keys) | current['targets'])
        deliveries = targets.to_h { |target| [target, { 'state' => 'pending', 'attempts' => 0 }] }
        result['sources'][source] = current.merge('deliveries' => deliveries)
      end
      result
    end

    def run(state, snapshot, limit: 50, now: Time.now)
      result = reconcile(state, snapshot)
      sent = 0
      result['sources'].each do |source, item|
        pending = item['deliveries'].select { |_, d| %w[pending retry].include?(d['state']) && (!d['next_attempt'] || Time.iso8601(d['next_attempt']) <= now) }
        next if pending.empty? || sent >= limit
        begin
          live = @http.request(source)
          if item['fingerprint'] == 'deleted'
            raise Error, 'Deleted source is still live' unless [404, 410].include?(live.status)
          else
            raise Error, 'Source deployment is not live' unless live.status == 200
            live_state = content_state(Nokogiri::HTML(live.body), source)
            raise Error, 'Source deployment is stale' unless live_state['fingerprint'] == item['fingerprint']
          end
        rescue Error
          next
        end
        pending.each do |target, delivery|
          break if sent >= limit
          attempts = delivery.fetch('attempts', 0) + 1
          begin
            item['deliveries'][target] = deliver(source, target).merge('attempts' => attempts)
          rescue Error
            item['deliveries'][target] = { 'state' => 'retry', 'attempts' => attempts,
                                           'next_attempt' => (now + [3600 * (2**[attempts - 1, 6].min), 86_400].min).iso8601 }
          end
          sent += 1
        end
      end
      result
    end
  end

  def self.cli(args)
    command = args.shift
    opts = { site: '_site', policy: '_data/webmention_policy.json', output: '_data/webmentions.json', state: 'cache/webmention-outbox.json' }
    OptionParser.new do |p|
      p.on('--site PATH') { |v| opts[:site] = v }
      p.on('--policy PATH') { |v| opts[:policy] = v }
      p.on('--output PATH') { |v| opts[:output] = v }
      p.on('--input PATH') { |v| opts[:input] = v }
      p.on('--state PATH') { |v| opts[:state] = v }
      p.on('--id ID') { |v| opts[:id] = v }
      p.on('--live') { opts[:live] = true }
      p.on('--retry') { opts[:retry] = true }
    end.parse!(args)
    case command
    when 'approve', 'block'
      raise Error, 'A numeric --id is required' unless opts[:id].to_s.match?(/\A\d+\z/)
      policy = read_json(opts[:policy])
      field = command == 'approve' ? 'approved_ids' : 'blocked_ids'
      other = command == 'approve' ? 'blocked_ids' : 'approved_ids'
      policy[field] = (Array(policy[field]).map(&:to_s) | [opts[:id]]).sort
      policy[other] = Array(policy[other]).map(&:to_s) - [opts[:id]]
      write_json(opts[:policy], policy)
    when 'sync'
      manifest = Manifest.new(read_json(File.join(opts[:site], 'indieweb-manifest.json')))
      sync = Mentions.new(manifest, read_json(opts[:policy]))
      rows = opts[:input] ? read_json(opts[:input]) : sync.fetch_all(token: ENV['WEBMENTION_IO_TOKEN'])
      cache, pending = sync.normalize(rows)
      write_json(opts[:output], cache)
      puts "Approved: #{cache['by_target'].values.sum { |groups| groups.values.sum(&:length) }}; pending IDs: #{pending.join(', ')}"
    when 'send'
      sender = Sender.new
      state = File.file?(opts[:state]) ? read_json(opts[:state]) : {}
      if opts[:retry]
        if state.empty?
          puts 'No outbox yet; waiting for the first successful deployment.'
          return
        end
        snapshot = state.fetch('sources').transform_values { |v| v.slice('fingerprint', 'targets') }
      elsif opts[:input]
        snapshot = sender.snapshot_stream(opts[:input])
      else
        manifest = Manifest.new(read_json(File.join(opts[:site], 'indieweb-manifest.json')))
        snapshot = sender.snapshot(opts[:site], manifest)
      end
      next_state = opts[:live] ? sender.run(state, snapshot) : sender.reconcile(state, snapshot)
      if opts[:live]
        write_json(opts[:state], next_state)
        counts = next_state['sources'].values.flat_map { |v| v['deliveries'].values }.group_by { |v| v['state'] }.transform_values(&:length)
        puts "Outbox sources: #{next_state['sources'].length}; deliveries: #{counts.sort.to_h.to_json}"
      else
        puts "Dry run: #{next_state['sources'].values.sum { |v| v['deliveries'].values.count { |d| d['state'] == 'pending' } }} pending deliveries; no requests sent or state written"
      end
    else
      raise Error, 'Usage: indieweb.rb sync|approve|block|send [options] (sending defaults to dry run)'
    end
  rescue Error, JSON::ParserError, KeyError, Errno::ENOENT => e
    STDERR.puts "IndieWeb: #{e.message}"
    exit 1
  end
end

IndieWeb.cli(ARGV) if $PROGRAM_NAME == __FILE__
