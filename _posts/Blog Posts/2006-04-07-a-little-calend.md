---
layout: post
title: A Little Calendar App I'm building
title-url: null
subtitle: Crafting Time - Journey of Building a JavaScript Calendar
subtitle-url: null
quote: null
excerpt: null
source: null
source-url: null
call-to-action: null
date: 2006-04-07 17:57:34+00:00
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org
bullets: null
description: null
seo-description: null
categories:
- Computers
tags: null
keywords: null
location:
  name: Temple City, CA
coordinates:
  latitude: 34.099024
  longitude: -118.069288
image: /img/2006-04/calendar.png
image-alt: null
image-artist: null
image-artist-URL: null
image-credits: null
image-credits-URL: null
image-credits-artist: null
image-credits-artist-URL: null
image-credits-title: null
image-description: null
image-title: null
monster-or-magical-or-religious-ideas: null
year-the-event-took-place: null
mathjax: null
order: null
image_width: 708
image_height: 604
mastodon-post-id: '115017515959514808'
---
The following code is a calendar application I’m building in JavaScript. It needs a couple rounds of refactoring (to get rid of document.writes and to make it more object friendly).  The next step will be to make it handle iCal files (which will be a trick).  This is posted for all to enjoy. See the link at the end of this document.

<script src="https://gist.github.com/TedTschopp/b4000bbf3e6215d1a8c437a3f6658d73.js"></script>

EDIT: Ok, more stuff to post on my calendar [App](https://tedt.org/2006/04/07/a_little_calend/). I've gotten the ical file loaded into the webpage, now I need to convert the ical file into a usable data type. My current thoughts are to go from i-Cal -> XML. I need to spend some time looking at the practices of converting from i-Cal -> XML. I notice that Google is doing it. Also the Microformat guys seem to be doing it as well.
