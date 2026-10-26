# frozen_string_literal: true
require_relative '../_code/micropub_serialize'
class MicropubPublicationTest
  def assert(value, message = 'Assertion failed'); raise message unless value; end
  def assert_equal(expected, actual); assert(expected == actual, "Expected #{expected.inspect}; got #{actual.inspect}"); end
  def assert_empty(value); assert(value.empty?, 'Expected empty value'); end
  def assert_nil(value); assert(value.nil?, 'Expected nil'); end
  def assert_includes(value, member); assert(value.include?(member), "Missing #{member}"); end
  def refute_includes(value, member); assert(!value.include?(member), "Unexpected #{member}"); end
  def assert_raises(klass)
    begin; yield; rescue klass; return true; end
    raise "Expected #{klass}"
  end
  def record(properties = {})
    { 'id' => 'a2607c7e-6bee-48c2-937f-2f8261ec085a', 'url' => 'https://tedt.org/updates/2026/10/25/a2607c7e-6bee-48c2-937f-2f8261ec085a/', 'created' => '2026-10-25T10:00:00Z', 'type' => 'h-entry', 'revision' => 1, 'publish' => true, 'properties' => { 'published' => ['2026-10-25T10:00:00Z'], 'post-status' => ['published'] }.merge(properties) }
  end
  def test_html_is_sanitized_and_liquid_is_literal
    result=MicropubPublication.render(record('content'=>[{'html'=>'<script>bad()</script><p onclick="bad()">Hi {{ site.secret }} {% include bad %}</p><img src="javascript:bad()" onerror="bad()"><a href="javascript:bad()">link</a><iframe src="https://example.com"></iframe>'}]))
    html=Nokogiri::HTML5.fragment(result['content'].split("---\n",3).last)
    assert_empty html.css('script,iframe,[onclick],[onerror]')
    assert_empty html.css('a[href],img[src]')
    refute_includes result['content'].split("---\n",3).last, '{{'
    assert_includes html.text, '{{ site.secret }}'
    assert_includes html.text, '{% include bad %}'
  end
  def test_removed_html_cannot_release_private_media
    secret = 'https://media.tedt.org/files/' + ('a' * 64) + '.png'
    result=MicropubPublication.render(record('content'=>[{'html'=>"<script>#{secret}</script><!-- #{secret} --><p>A public note</p>"}]))
    assert_empty result['media']
    refute_includes result['content'],secret
    visible=MicropubPublication.render(record('content'=>[{'html'=>"<img src=\"#{secret}\" alt=\"Public photo\">"}]))
    assert_equal [secret],visible['media']
    code=MicropubPublication.render(record('content'=>["```\n#{secret}\n```"]))
    assert_empty code['media']
  end
  def test_markdown_output_is_sanitized_and_not_parsed_twice
    input='[unsafe](javascript:alert(1)) <img src=x onerror=bad()> {{ site.secret }}'
    result=MicropubPublication.render(record('content'=>[input]))
    body=result['content'].split("---\n",3).last
    converter=Jekyll::Converters::Markdown.new(Jekyll.configuration('quiet'=>true))
    doc=Nokogiri::HTML5.fragment(converter.convert(body))
    assert_empty doc.css('a[href^="javascript:"],img,[onerror]')
    assert_includes doc.text,'<img src=x onerror=bad()>'
    assert_includes doc.text,'{{ site.secret }}'
    html=MicropubPublication.render(record('content'=>[{'html'=>'<p>[unsafe](javascript:alert(1))</p>'}]))
    doc=Nokogiri::HTML5.fragment(converter.convert(html['content'].split("---\n",3).last))
    assert_empty doc.css('a')
  end
  def test_plain_text_cannot_become_html
    result=MicropubPublication.render(record('content'=>['<img src=x onerror=bad()>']))
    body=result['content'].split("---\n",3).last
    assert_empty Nokogiri::HTML5.fragment(body).css('img')
    assert_includes body, '&lt;img'
  end
  def test_drafts_and_deleted_entries_never_export_content
    r=record('content'=>['private draft'],'post-status'=>['draft']);r['publish']=false
    result=MicropubPublication.render(r)
    assert_nil result['content']
    refute_includes JSON.generate(result), 'private draft'
    r['publish']=true
    assert_raises(ArgumentError) { MicropubPublication.render(r) }
  end
  def test_managed_paths_cannot_escape_post_directory
    r=record;r['id']='../../secrets'
    assert_raises(ArgumentError) { MicropubPublication.render(r) }
    r=record;r['url']='https://evil.example/updates/post/'
    assert_raises(ArgumentError) { MicropubPublication.render(r) }
  end
  def test_all_media_types_and_interactions_are_retained
    %w[photo audio video in-reply-to like-of repost-of bookmark-of].each do |key|
      r=record(key=>['https://example.com/resource'])
      output=MicropubPublication.render(r)
      front=YAML.safe_load(output['content'].split("---\n",3)[1])
      assert_equal ['https://example.com/resource'],front["mf-#{key}"]
      assert_equal false,front['mastodon-syndicate']
    end
  end
  def test_photos_keep_descriptive_alternative_text
    photo={'value'=>'https://media.tedt.org/files/photo.png','alt'=>'Alpine trail at dawn'}
    output=MicropubPublication.render(record('photo'=>[photo]))
    front=YAML.safe_load(output['content'].split("---\n",3)[1])
    assert_equal [photo],front['mf-photo']
    assert_equal [photo['value']],output['media']
  end
  def test_event_and_checkin_properties_survive_serialization
    r=record('name'=>['Meetup'],'start'=>['2026-11-01T12:00:00Z'],'end'=>['2026-11-01T14:00:00Z'],'location'=>[{'type'=>['h-card'],'properties'=>{'name'=>['Library'],'latitude'=>['34.1'],'longitude'=>['-117.8']}}]);r['type']='h-event'
    front=YAML.safe_load(MicropubPublication.render(r)['content'].split("---\n",3)[1])
    assert_equal 'h-event',front.dig('micropub','type')
    assert_equal 'Library',front.dig('mf-location',0,'properties','name',0)
  end
  def test_media_gate_uses_head_and_preserves_waiting_entries
    client=Object.new
    calls=[]
    client.define_singleton_method(:request) { |url,method:| calls << [url,method]; IndieWeb::Response.new(status:404) }
    assert_raises(IndieWeb::Error) { MicropubPublication.check_media(['https://media.tedt.org/files/new.png'],http:client) }
    assert_equal [['https://media.tedt.org/files/new.png','HEAD']],calls
  end
end

runner = MicropubPublicationTest.new
checks = runner.public_methods.grep(/^test_/).sort
checks.each { |name| runner.public_send(name); puts "PASS: #{name}" }
puts "#{checks.length} Micropub publication tests passed."
