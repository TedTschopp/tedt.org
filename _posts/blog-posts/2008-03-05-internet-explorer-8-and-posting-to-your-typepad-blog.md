---
id: 458
title: Internet Explorer 8 and posting to your Typepad Blog
date: 2008-03-05T23:55:06+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org/
  avatar: https://tedt.org/img/thumb3.jpg
layout: post

guid: 89326e70-d65a-4c85-8d88-3caa537e7f5c
permalink: /2008/03/05/internet-explorer-8-and-posting-to-your-typepad-blog/
categories:
  - Coding
  - Web
---
I downloaded IE8 today and noticed it had a new way to post to Microsoft’s blog by highlighting some text and sending it off to their blogging service.

Here is the code that will make it work in Typepad:

~~~xml
<?xml version="1.0" encoding="utf-8" ?>
<openServiceDescription xmlns="http://www.microsoft.com/schemas/openservicedescription/1.0>">
  <homepageUrl>http://www.typepad.com/t/app</homepageUrl>
  <display>
    <name>Blog in Typepad</name>
    <icon>http://www.tschopp.net/favicon.ico</icon>
    <description>Post this in my Blog</description>
  </display>
  <activity category="Blog">
    <activityAction context="selection">
      <execute method="get" action="http://www.typepad.com/t/app/weblog/post">
        <parameter name="title" value="{documentTitle}" />
        <parameter name="SourceURL" value="{documentUrl}" />
        <parameter name="blog_id" value="16627" />
        <parameter name="text" value="{selection}" />
        <parameter name="keywords" value="{keywords}" />
      </execute>
    </activityAction>
    <activityAction context="document">
      <execute method="get" action="http://www.typepad.com/t/app/weblog/post">
        <parameter name="title" value="{documentTitle}" />
        <parameter name="blog_id" value="16627" />
        <parameter name="SourceURL" value="{documentUrl}" />
      </execute>
    </activityAction>
    <activityAction context="link">
      <execute method="get" action="http://www.typepad.com/t/app/weblog/post">
        <parameter name="title" value="{linkTitle}" />
        <parameter name="blog_id" value="16627" />
        <parameter name="SourceURL" value="{link}" />
      </execute>
    </activityAction>
  </activity>
</openServiceDescription>
~~~   

  1. Copy and paste this into a Text file.
  2. Name it typepad.xml
  3. Replace blog_Id with your blog ID

  1. Browse to <http://www.typepad.com/t/app>
  2. Click on the blog you want to post to
  3. Observe the URL <http://www.typepad.com/t/app/weblog/manage?blog_id=16627>

  * Replace the <icon> with your favicon
  * Save the document
  * Upload file to your Typepad account
  * Create a new HTML file
  * Name it typepad.html
  * Put the following code in the html file:

~~~html
  <A href=”javascript:window.external.addService(‘http://www.tschopp.net/typepad.xml’);”>Click Here</a>
~~~

  * Replace my URL with the URL to the XML file you created above
  * Save file
  * Upload File to Typepad
  * Browse to HTML file
  * Click on link

Let me know how it goes. I will post updates later this week to get more than just selections working. I also want to expand this to other services. Let me know how this is working for you.