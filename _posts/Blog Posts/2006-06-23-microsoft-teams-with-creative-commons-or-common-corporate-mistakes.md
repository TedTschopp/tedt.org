---
id: 501
title: Microsoft teams with Creative Commons or Common Corporate Mistakes
date: 2006-06-23T23:50:37+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org/
  avatar: https://tedt.org/img/thumb3.jpg
layout: post

guid: b0cd4204-75b3-40ef-b90f-b672c919e4a2
permalink: /2006/06/23/microsoft-teams-with-creative-commons-or-common-corporate-mistakes/
categories:
  - Computers
---
Microsoft tonight [announced a new partnership](http://www.microsoft.com/presspass/press/2006/jun06/06-20MSCreativeCommonsPR.mspx) with [Creative Commons](http://creativecommons.org/), the organization dedicated to providing content producers a legal alternative to “all rights reserved” copyright law, to offer a new tool for easy insertion of Creative Commons licenses into works created with Microsoft Office.

The only problem I have noticed with the tool is that it can not handle being behind a proxy server.&#160; It seems rather strange for someone like Microsoft not to support something as simple as a proxy server.&#160; I hope they update the tool at some point, I can’t use it until it gets that feature.

Which brings me to a pet peeve of mine, when corporations, like Microsoft in this case, fail to take into consideration the full extent of a problem.&#160; This happens many times with proxy servers.&#160; Perhaps this is a problem with the way that Microsoft has laid out the networking services in Windows.&#160; I know from experience that there is no real place to go to see if there is a proxy on a Microsoft Windows Machine.&#160; The place these settings are set is in the browser, which is not really all that well thought out.&#160; A proxy definition is something that should be at the operating system or networking level and definitely not at the application level.

Even if an application needs to define a separate local proxy, the application should be able to do so through standard OOP methods of inheritance and extension of the network proxy object.