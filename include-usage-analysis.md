# Jekyll Include Usage Analysis

This document provides a comprehensive analysis of how includes are used throughout the Jekyll site.

## Summary Statistics


### Layout Files

**_layouts/post.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-                             {% comment %}{% include content/publish-and-update-date-time-v2.html %}{% endcomment %}
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" >{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}} </a>
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>, 
-                             {% include content/progress-bar.html %}
-                 {% include social/comments-mastodon-tree.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include content/next-and-previous.html %}
-                                                 <p class="card-title h3" style="z-index: 2; position: relative;"><a class="text-decoration-none" href="{{ site.siteurl }}/category/{{category|slugize}}"><span class="p-category">{{category}}</span> {% include utility/category-emoji.html category=category %}</a></p>
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**_layouts/MCC-GW.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/top-nav-bar.html %}
-                     {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include social/comments.html %}
-                     {% include utility/google-search.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}

**_layouts/profile.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-   {% include assets/js-bottom-of-body.html %}

**_layouts/default.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**_layouts/gammaworld.html:**
-      {% include utility/calculate-variables.html %}
-      {% include seo/indieauth-webmentions-metadata.html %}
-      {% include seo/meta-data-seo.html %}
-      {% include pwa/pwa-header-includes.html %}
-      {% include feeds/feeds.html %}
-      {% include assets/all-css-includes.html %}
-      {% include assets/scripts.html %}
-                     {% include social/comments.html %}
-                     {% include social/comments-webmentions.html %}
-           {% include layout/footer.html %}
-      {% include assets/js-bottom-of-body.html %}

**_layouts/category.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-                     <h1 class="p-name">Category: {% include utility/category-emoji.html category=page.title %} {{ page.title }}</h1>
-                 {% include social/comments.html %}
-                 {% include social/comments-webmentions.html %}
-                                 {% include utility/full-category.html category=category-to-render render-number=true%}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**_layouts/prompt-details.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**_layouts/prompt-library.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**_layouts/quotes.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/top-nav-bar.html %}
-                     {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}

**_layouts/micropubpost.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/bootstrap4-navigation.html %}
-                   {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include social/comments.html %}
-                     {% include utility/google-search.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}


### Blog Posts

**_posts/RPG Posts/2023-09-10-What-Makes-the-Human.md:**
- {% include content/figure.html
- {% include content/figure.html

**_posts/RPG Posts/2023-07-22-The-Right-Set-of-Skills.md:**
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html


### Root Files (index.html, etc.)

**./_includes/layout/header.html:**
-         {% include navigation.html %}

**./_includes/content/publish-and-update-date-time.html:**
-                           on {{ dy }}, {{ m }} <sup>{% case d %}{% when '1' or '21' or '31' %}{{ d }}st{% when '2' or '22' %}{{ d }}nd{% when '3' or '23' %}{{ d }}rd{% else %}{{ d }}th{% endcase %}</sup> {% include fuzzy-date.html daysDiff=prevDateDiff label='ago' %}</time></br>

**./_includes/content/publish-and-update-date-time-v2.html:**
-                     <p><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;Posted <time datetime="{{page.date}}" class="aria-hidden hidden dt-publish">{{page.date}}</time><time class="dt-publish" datetime="{{page.date}}">{% capture time-output-temp %} {% include fuzzy-date.html daysDiff=prevDateDiff label='ago' %}, {% case hour %}{% when '01' or '02' or '03' or '04' or '23' or '24' %}during the night{% when '05' or '06' or '07' or '08' %}in the early morning{% when '09' or '10' or '11' %}late in the morning{% when '12' %}at noon{% when '13' or '14' or '15' %}early in the afternoon{% when '16' or '17' %}late in the afternoon{% when '18' or '19' %}early in the evening{% when '20' or '21' or '22' %}late in the evening{% endcase %}, {% endcapture %}{% assign time-output = time-output-temp | strip_newlines  | trim | replace: '  ', ' '%}{{ time-output }}on {{ dy }}, {{ m }} {% case d %}{% when '1' or '21' or '31' %}{{ d }}<sup>st</sup>{% when '2' or '22' %}{{ d }}<sup>nd</sup>{% when '3' or '23' %}{{ d }}<suup>rd</suup>{% else %}{{ d }}<sup>th</sup>{% endcase %}</time> in {{ year }}</br>

**./_includes/social/webmention-all-templates.html:**
- {% include webmention-io-bookmarks.html %}
- {% include webmention-io-count.html %}
- {% include webmention-io-likes.html %}
- {% include webmention-io-links.html %}
- {% include webmention-io-posts.html %}
- {% include webmention-io-replies.html %}
- {% include webmention-io-reposts.html %}
- {% include webmention-io-rsvps.html %}
- {% include webmention-io-webmentions.html %}

**./_includes/assets/js-bottom-of-body.html:**
-     {% include js-jquery.html %}
-     {% include js-bootstrap.html %}
-     {% include js-toggle-theme.html %}

**./_includes/assets/scripts.html:**
-   {% include js-fontawesome.html %}
-     {% include rough-notation.html %}
-     {% include js-clarity.html %}
-     {% include js-google-analytics.html %}

**./_includes/utility/full-category.html:**
- href="{{site.siteurl}}/category/{{category[0]}}">{% include category-emoji.html category=category-to-render %} {% if Text-to-Output=="" %}{{ category-to-render }}{%else%}{{Text-to-Output}}{%endif%}{% if include.render-number == true %} ({{ category[1].size }}){%endif %}</a>

**./tools/prompt-library.html:**
-     {% include top-nav-bar.html %}
-     {% include footer.html %}
-     {% include js-bottom-of-body.html %}

**./_posts/RPG Posts/2023-09-10-What-Makes-the-Human.md:**
- {% include content/figure.html
- {% include content/figure.html

**./_posts/RPG Posts/2023-07-22-The-Right-Set-of-Skills.md:**
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html
- {% include content/figure.html

**./_layouts/post.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-                             {% comment %}{% include content/publish-and-update-date-time-v2.html %}{% endcomment %}
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" >{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
-                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}} </a>
-                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>, 
-                             {% include content/progress-bar.html %}
-                 {% include social/comments-mastodon-tree.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include content/next-and-previous.html %}
-                                                 <p class="card-title h3" style="z-index: 2; position: relative;"><a class="text-decoration-none" href="{{ site.siteurl }}/category/{{category|slugize}}"><span class="p-category">{{category}}</span> {% include utility/category-emoji.html category=category %}</a></p>
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**./_layouts/MCC-GW.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/top-nav-bar.html %}
-                     {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include social/comments.html %}
-                     {% include utility/google-search.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}

**./_layouts/profile.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-   {% include assets/js-bottom-of-body.html %}

**./_layouts/default.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**./_layouts/gammaworld.html:**
-      {% include utility/calculate-variables.html %}
-      {% include seo/indieauth-webmentions-metadata.html %}
-      {% include seo/meta-data-seo.html %}
-      {% include pwa/pwa-header-includes.html %}
-      {% include feeds/feeds.html %}
-      {% include assets/all-css-includes.html %}
-      {% include assets/scripts.html %}
-                     {% include social/comments.html %}
-                     {% include social/comments-webmentions.html %}
-           {% include layout/footer.html %}
-      {% include assets/js-bottom-of-body.html %}

**./_layouts/category.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-                     <h1 class="p-name">Category: {% include utility/category-emoji.html category=page.title %} {{ page.title }}</h1>
-                 {% include social/comments.html %}
-                 {% include social/comments-webmentions.html %}
-                                 {% include utility/full-category.html category=category-to-render render-number=true%}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**./_layouts/prompt-details.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**./_layouts/prompt-library.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-nav-bar.html %}
-     {% include layout/footer.html %}
-     {% include assets/js-bottom-of-body.html %}

**./_layouts/quotes.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/top-nav-bar.html %}
-                     {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}

**./_layouts/micropubpost.html:**
-     {% include utility/calculate-variables.html %}
-     {% include seo/indieauth-webmentions-metadata.html %}
-     {% include seo/meta-data-seo.html %}
-     {% include pwa/pwa-header-includes.html %}
-     {% include feeds/feeds.html %}
-     {% include assets/all-css-includes.html %}
-     {% include assets/scripts.html %}
-     {% include layout/top-of-body.html %}
-     {% include layout/bootstrap4-navigation.html %}
-                   {% include content/publish-and-update-date-time-v2.html %}
-                 {% include content/next-and-previous.html %}
-                 {% include social/comments-webmentions.html %}
-                 {% include social/comments.html %}
-                     {% include utility/google-search.html %}
-   {% include layout/footer.html %}
-   {% include assets/js-bottom-of-body.html %}

**./README.md:**
- {% include layout/header.html %}
- {% include layout/footer.html %}
- {% include content/figure.html %}
- {% include content/post-preview.html %}
- {% include utility/category-emoji.html category="Technology" %}
- {% include utility/fuzzy-date.html %}
- {% include seo/meta-data-seo.html %}
- {% include seo/twitter-card-metadata.html %}
- The include system was refactored in July 2025 to improve organization. Old flat-structure references have been updated, but if you encounter any old-style includes like `{% include filename.html %}`, they should be updated to use the new directory structure.
- {% include layout/header.html %}
- {% include layout/footer.html %}
- {% include layout/top-nav-bar.html %}
- {% include assets/all-css-includes.html %}
- {% include assets/js-bottom-of-body.html %}
- {% include seo/meta-data-seo.html %}
- {% include seo/indieauth-webmentions-metadata.html %}
- {% include content/figure.html %}
- {% include content/progress-bar.html %}
- {% include content/next-and-previous.html %}
- {% include utility/category-emoji.html category="Technology" %}
- {% include utility/calculate-variables.html %}

**./issues/02-create-reusable-post-card-include.md:**
-   <!-- Usage: {% include post-card.html post=post layout="horizontal" %} -->

**./include-usage-analysis.md:**
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -                             {% comment %}{% include content/publish-and-update-date-time-v2.html %}{% endcomment %}
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" >{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}} </a>
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>, 
- -                             {% include content/progress-bar.html %}
- -                 {% include social/comments-mastodon-tree.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include content/next-and-previous.html %}
- -                                                 <p class="card-title h3" style="z-index: 2; position: relative;"><a class="text-decoration-none" href="{{ site.siteurl }}/category/{{category|slugize}}"><span class="p-category">{{category}}</span> {% include utility/category-emoji.html category=category %}</a></p>
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include social/comments.html %}
- -                     {% include utility/google-search.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -      {% include utility/calculate-variables.html %}
- -      {% include seo/indieauth-webmentions-metadata.html %}
- -      {% include seo/meta-data-seo.html %}
- -      {% include pwa/pwa-header-includes.html %}
- -      {% include feeds/feeds.html %}
- -      {% include assets/all-css-includes.html %}
- -      {% include assets/scripts.html %}
- -                     {% include social/comments.html %}
- -                     {% include social/comments-webmentions.html %}
- -           {% include layout/footer.html %}
- -      {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     <h1 class="p-name">Category: {% include utility/category-emoji.html category=page.title %} {{ page.title }}</h1>
- -                 {% include social/comments.html %}
- -                 {% include social/comments-webmentions.html %}
- -                                 {% include utility/full-category.html category=category-to-render render-number=true%}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/bootstrap4-navigation.html %}
- -                   {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include social/comments.html %}
- -                     {% include utility/google-search.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- -         {% include navigation.html %}
- -                           on {{ dy }}, {{ m }} <sup>{% case d %}{% when '1' or '21' or '31' %}{{ d }}st{% when '2' or '22' %}{{ d }}nd{% when '3' or '23' %}{{ d }}rd{% else %}{{ d }}th{% endcase %}</sup> {% include fuzzy-date.html daysDiff=prevDateDiff label='ago' %}</time></br>
- -                     <p><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;Posted <time datetime="{{page.date}}" class="aria-hidden hidden dt-publish">{{page.date}}</time><time class="dt-publish" datetime="{{page.date}}">{% capture time-output-temp %} {% include fuzzy-date.html daysDiff=prevDateDiff label='ago' %}, {% case hour %}{% when '01' or '02' or '03' or '04' or '23' or '24' %}during the night{% when '05' or '06' or '07' or '08' %}in the early morning{% when '09' or '10' or '11' %}late in the morning{% when '12' %}at noon{% when '13' or '14' or '15' %}early in the afternoon{% when '16' or '17' %}late in the afternoon{% when '18' or '19' %}early in the evening{% when '20' or '21' or '22' %}late in the evening{% endcase %}, {% endcapture %}{% assign time-output = time-output-temp | strip_newlines  | trim | replace: '  ', ' '%}{{ time-output }}on {{ dy }}, {{ m }} {% case d %}{% when '1' or '21' or '31' %}{{ d }}<sup>st</sup>{% when '2' or '22' %}{{ d }}<sup>nd</sup>{% when '3' or '23' %}{{ d }}<suup>rd</suup>{% else %}{{ d }}<sup>th</sup>{% endcase %}</time> in {{ year }}</br>
- - {% include webmention-io-bookmarks.html %}
- - {% include webmention-io-count.html %}
- - {% include webmention-io-likes.html %}
- - {% include webmention-io-links.html %}
- - {% include webmention-io-posts.html %}
- - {% include webmention-io-replies.html %}
- - {% include webmention-io-reposts.html %}
- - {% include webmention-io-rsvps.html %}
- - {% include webmention-io-webmentions.html %}
- -     {% include js-jquery.html %}
- -     {% include js-bootstrap.html %}
- -     {% include js-toggle-theme.html %}
- -   {% include js-fontawesome.html %}
- -     {% include rough-notation.html %}
- -     {% include js-clarity.html %}
- -     {% include js-google-analytics.html %}
- - href="{{site.siteurl}}/category/{{category[0]}}">{% include category-emoji.html category=category-to-render %} {% if Text-to-Output=="" %}{{ category-to-render }}{%else%}{{Text-to-Output}}{%endif%}{% if include.render-number == true %} ({{ category[1].size }}){%endif %}</a>
- -     {% include top-nav-bar.html %}
- -     {% include footer.html %}
- -     {% include js-bottom-of-body.html %}
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- - {% include content/figure.html
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -                             {% comment %}{% include content/publish-and-update-date-time-v2.html %}{% endcomment %}
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" >{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>
- -                                                 and <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}} </a>
- -                                                 <a href="/category/{{ thiscategory }}"><span class="text-decoration-none" ></span>{% include utility/category-emoji.html category=thiscategory %} </span>{{thiscategory}}</a>, 
- -                             {% include content/progress-bar.html %}
- -                 {% include social/comments-mastodon-tree.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include content/next-and-previous.html %}
- -                                                 <p class="card-title h3" style="z-index: 2; position: relative;"><a class="text-decoration-none" href="{{ site.siteurl }}/category/{{category|slugize}}"><span class="p-category">{{category}}</span> {% include utility/category-emoji.html category=category %}</a></p>
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include social/comments.html %}
- -                     {% include utility/google-search.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -      {% include utility/calculate-variables.html %}
- -      {% include seo/indieauth-webmentions-metadata.html %}
- -      {% include seo/meta-data-seo.html %}
- -      {% include pwa/pwa-header-includes.html %}
- -      {% include feeds/feeds.html %}
- -      {% include assets/all-css-includes.html %}
- -      {% include assets/scripts.html %}
- -                     {% include social/comments.html %}
- -                     {% include social/comments-webmentions.html %}
- -           {% include layout/footer.html %}
- -      {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     <h1 class="p-name">Category: {% include utility/category-emoji.html category=page.title %} {{ page.title }}</h1>
- -                 {% include social/comments.html %}
- -                 {% include social/comments-webmentions.html %}
- -                                 {% include utility/full-category.html category=category-to-render render-number=true%}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-nav-bar.html %}
- -     {% include layout/footer.html %}
- -     {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/top-nav-bar.html %}
- -                     {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- -     {% include utility/calculate-variables.html %}
- -     {% include seo/indieauth-webmentions-metadata.html %}
- -     {% include seo/meta-data-seo.html %}
- -     {% include pwa/pwa-header-includes.html %}
- -     {% include feeds/feeds.html %}
- -     {% include assets/all-css-includes.html %}
- -     {% include assets/scripts.html %}
- -     {% include layout/top-of-body.html %}
- -     {% include layout/bootstrap4-navigation.html %}
- -                   {% include content/publish-and-update-date-time-v2.html %}
- -                 {% include content/next-and-previous.html %}
- -                 {% include social/comments-webmentions.html %}
- -                 {% include social/comments.html %}
- -                     {% include utility/google-search.html %}
- -   {% include layout/footer.html %}
- -   {% include assets/js-bottom-of-body.html %}
- - {% include layout/header.html %}
- - {% include layout/footer.html %}
- - {% include content/figure.html %}
- - {% include content/post-preview.html %}
- - {% include utility/category-emoji.html category="Technology" %}
- - {% include utility/fuzzy-date.html %}
- - {% include seo/meta-data-seo.html %}
- - {% include seo/twitter-card-metadata.html %}
- - The include system was refactored in July 2025 to improve organization. Old flat-structure references have been updated, but if you encounter any old-style includes like `{% include filename.html %}`, they should be updated to use the new directory structure.
- - {% include layout/header.html %}
- - {% include layout/footer.html %}
- - {% include layout/top-nav-bar.html %}
- - {% include assets/all-css-includes.html %}
- - {% include assets/js-bottom-of-body.html %}
- - {% include seo/meta-data-seo.html %}
- - {% include seo/indieauth-webmentions-metadata.html %}
- - {% include content/figure.html %}
- - {% include content/progress-bar.html %}
- - {% include content/next-and-previous.html %}
- - {% include utility/category-emoji.html category="Technology" %}
- - {% include utility/calculate-variables.html %}
- -   <!-- Usage: {% include post-card.html post=post layout="horizontal" %} -->

**./_work-in-progress/template for image gallary.html:**
- 1. With a post object: {% include post-card.html post=post %}
- 2. With individual parameters: {% include post-card.html 
-     {% include post-card.html post=post %}


## Individual Include Usage Statistics

### assets/all-css-includes.html
**Usage count:** 63

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### assets/js-bottom-of-body.html
**Usage count:** 63

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### assets/scripts.html
**Usage count:** 60

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### content/figure.html
**Usage count:** 84

**Used in:**
- ./README.md
- ./_posts/RPG Posts/2023-07-22-The-Right-Set-of-Skills.md
- ./_posts/RPG Posts/2023-09-10-What-Makes-the-Human.md
- ./include-usage-analysis.md
- _posts/RPG Posts/2023-07-22-The-Right-Set-of-Skills.md
- _posts/RPG Posts/2023-09-10-What-Makes-the-Human.md

### content/next-and-previous.html
**Usage count:** 27

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/quotes.html

### content/post-preview.html
**Usage count:** 3

**Used in:**
- ./README.md
- ./include-usage-analysis.md

### content/progress-bar.html
**Usage count:** 9

**Used in:**
- ./README.md
- ./_layouts/post.html
- ./include-usage-analysis.md
- _layouts/post.html

### content/publish-and-update-date-time-v2.html
**Usage count:** 24

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/quotes.html

### feeds/feeds.html
**Usage count:** 60

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### layout/footer.html
**Usage count:** 60

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### layout/header.html
**Usage count:** 6

**Used in:**
- ./README.md
- ./include-usage-analysis.md

### layout/top-nav-bar.html
**Usage count:** 45

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/post.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/post.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### layout/top-of-body.html
**Usage count:** 18

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/micropubpost.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/micropubpost.html
- _layouts/quotes.html

### pwa/pwa-header-includes.html
**Usage count:** 60

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### seo/indieauth-webmentions-metadata.html
**Usage count:** 63

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### seo/meta-data-seo.html
**Usage count:** 66

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### seo/twitter-card-metadata.html
**Usage count:** 3

**Used in:**
- ./README.md
- ./include-usage-analysis.md

### social/comments-mastodon-tree.html
**Usage count:** 6

**Used in:**
- ./_layouts/post.html
- ./include-usage-analysis.md
- _layouts/post.html

### social/comments-webmentions.html
**Usage count:** 30

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html

### social/comments.html
**Usage count:** 24

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html

### utility/calculate-variables.html
**Usage count:** 63

**Used in:**
- ./README.md
- ./_layouts/MCC-GW.html
- ./_layouts/category.html
- ./_layouts/default.html
- ./_layouts/gammaworld.html
- ./_layouts/micropubpost.html
- ./_layouts/post.html
- ./_layouts/profile.html
- ./_layouts/prompt-details.html
- ./_layouts/prompt-library.html
- ./_layouts/quotes.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/category.html
- _layouts/default.html
- _layouts/gammaworld.html
- _layouts/micropubpost.html
- _layouts/post.html
- _layouts/profile.html
- _layouts/prompt-details.html
- _layouts/prompt-library.html
- _layouts/quotes.html

### utility/category-emoji.html
**Usage count:** 48

**Used in:**
- ./README.md
- ./_layouts/category.html
- ./_layouts/post.html
- ./include-usage-analysis.md
- _layouts/category.html
- _layouts/post.html

### utility/full-category.html
**Usage count:** 6

**Used in:**
- ./_layouts/category.html
- ./include-usage-analysis.md
- _layouts/category.html

### utility/fuzzy-date.html
**Usage count:** 3

**Used in:**
- ./README.md
- ./include-usage-analysis.md

### utility/google-search.html
**Usage count:** 12

**Used in:**
- ./_layouts/MCC-GW.html
- ./_layouts/micropubpost.html
- ./include-usage-analysis.md
- _layouts/MCC-GW.html
- _layouts/micropubpost.html


## Directory Usage Summary

### analytics/
- **Total files:** 5
- **Files in use:** 0
- **Total usage count:** 0

### assets/
- **Total files:** 8
- **Files in use:** 0
- **Total usage count:** 0

### content/
- **Total files:** 8
- **Files in use:** 0
- **Total usage count:** 0

### feeds/
- **Total files:** 2
- **Files in use:** 0
- **Total usage count:** 0

### gaming/
- **Total files:** 3
- **Files in use:** 0
- **Total usage count:** 0

### layout/
- **Total files:** 4
- **Files in use:** 0
- **Total usage count:** 0

### personal/
- **Total files:** 5
- **Files in use:** 0
- **Total usage count:** 0

### pwa/
- **Total files:** 1
- **Files in use:** 0
- **Total usage count:** 0

### seo/
- **Total files:** 3
- **Files in use:** 0
- **Total usage count:** 0

### social/
- **Total files:** 15
- **Files in use:** 0
- **Total usage count:** 0

### themes/
- **Total files:** 17
- **Files in use:** 0
- **Total usage count:** 0

### utility/
- **Total files:** 8
- **Files in use:** 0
- **Total usage count:** 0

