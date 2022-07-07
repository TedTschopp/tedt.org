---
id: 198
title: What's Playing on KROQ
date: 2005-04-15T09:42:50+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org/
  avatar: https://tedt.org/img/thumb3.jpg
layout: post

guid: 75ec84d5-052d-4f3d-aea1-60d3846ba921
permalink: /2005/04/15/whats_playing_o/
categories:
  - Web
---
Ever wonder what's playing on KROQ?&nbsp; Well, here is your chance to get an XML feed that has it all.

~~~html
<http://tmex.spun.com/tmexhistory.jsp?CampaignID=1253273&Events=10&EndTime=20050415-0930>
~~~

Now to write an XSLT to parse it and link to the iTunes and Amazon.com stores (oh and why not the SPUN store as well).

You will need to modify the EndTime= variable in the URL to match the following: YYYYMMDD-HHMM So April 1, 2008 at 9:30am would be EndTime=20080401-0930