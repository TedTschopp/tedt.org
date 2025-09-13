# HTML Proofer Logs
Last update: 2025-09-13T21:07:53Z
\n## Latest Summary (tail 50 lines)\n
htmlproofer 3.19.4 | Error:  invalid attribute name `\n'
/home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/element.rb:19:in `attr_reader': invalid attribute name `\n' (NameError)

          (class << self; self; end).send(:attr_reader, name)
                                    ^^^^^
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/element.rb:19:in `block in initialize'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/element.rb:17:in `each_pair'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/element.rb:17:in `initialize'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/check.rb:22:in `new'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/check.rb:22:in `create_element'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/check/scripts.rb:12:in `block in run'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/nokogiri-1.18.9-x86_64-linux-gnu/lib/nokogiri/xml/node_set.rb:237:in `block in each'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/nokogiri-1.18.9-x86_64-linux-gnu/lib/nokogiri/xml/node_set.rb:236:in `upto'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/nokogiri-1.18.9-x86_64-linux-gnu/lib/nokogiri/xml/node_set.rb:236:in `each'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/check/scripts.rb:11:in `run'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:114:in `block (2 levels) in check_parsed'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:111:in `each'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:111:in `block in check_parsed'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:110:in `each'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:110:in `check_parsed'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:138:in `check_path'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:99:in `block in process_files'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:99:in `map'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:99:in `process_files'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:77:in `check_files'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/lib/html-proofer/runner.rb:48:in `run'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/bin/htmlproofer:112:in `block (2 levels) in <top (required)>'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `block in execute'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `each'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `execute'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/mercenary-0.4.0/lib/mercenary/program.rb:44:in `go'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/mercenary-0.4.0/lib/mercenary.rb:21:in `program'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/gems/html-proofer-3.19.4/bin/htmlproofer:11:in `<top (required)>'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/bin/htmlproofer:25:in `load'
	from /home/runner/work/tedt.org/tedt.org/vendor/bundle/ruby/3.2.0/bin/htmlproofer:25:in `<top (required)>'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli/exec.rb:58:in `load'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli/exec.rb:58:in `kernel_load'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli/exec.rb:23:in `run'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli.rb:492:in `exec'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/vendor/thor/lib/thor/command.rb:28:in `run'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/vendor/thor/lib/thor/invocation.rb:127:in `invoke_command'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/vendor/thor/lib/thor.rb:527:in `dispatch'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli.rb:34:in `dispatch'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/vendor/thor/lib/thor/base.rb:584:in `start'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/cli.rb:28:in `start'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/exe/bundle:37:in `block in <top (required)>'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/lib/bundler/friendly_errors.rb:117:in `with_friendly_errors'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/lib/ruby/gems/3.2.0/gems/bundler-2.4.22/exe/bundle:29:in `<top (required)>'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/bin/bundle:25:in `load'
	from /opt/hostedtoolcache/Ruby/3.2.9/x64/bin/bundle:25:in `<main>'
\n## Available Historical Logs\n
- 2025-09-13T21-07-47-HTML Logging.txt
- 2025-09-13T20-56-59-HTML Logging.txt
- 2025-09-08T13-40-50-HTML Logging.txt
- 2025-09-08T20-58-32-HTML Logging.txt
- 2025-09-09T15-54-20-HTML Logging.txt
- 2025-09-09T16-02-36-HTML Logging.txt
- 2025-09-09T21-07-52-HTML Logging.txt
- 2025-09-10T16-56-35-HTML Logging.txt
- 2025-09-10T17-14-30-HTML Logging.txt
- 2025-09-10T20-08-14-HTML Logging.txt
- 2025-09-10T20-16-52-HTML Logging.txt
- 2025-09-10T20-32-09-HTML Logging.txt
- 2025-09-10T20-53-59-HTML Logging.txt
- 2025-09-11T13-22-35-HTML Logging.txt
- 2025-09-11T15-35-04-HTML Logging.txt
- 2025-09-06T23-19-01-HTML Logging.txt
- 2025-09-06T23-06-54-HTML Logging.txt
- 2025-09-06T20-25-18-HTML Logging.txt
