.PHONY: build normalize validate_mastodon feed_check legacy_check length_report proofer qa all clean

build:
	bundle exec jekyll build --quiet

normalize:
	ruby _code/normalize_dates.rb

validate_mastodon:
	ruby tests/validate_mastodon_feed.rb

feed_check:
	ruby tests/check_feed_integrity.rb

legacy_check:
	ruby tests/check_no_legacy_siteurl.rb

length_report:
	ruby tests/report_mastodon_feed_lengths.rb

proofer:
	bundle exec htmlproofer ./_site --check-html --allow-missing-href $(if $(SKIP_EXTERNAL),--disable-external,)

qa: normalize build legacy_check feed_check validate_mastodon length_report

all: qa proofer

clean:
	rm -rf _site
