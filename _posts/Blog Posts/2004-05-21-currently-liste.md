---
id: 231
title:  "Integrating iTunes with TypePad: A Simple Guide"
subtitle:  "Syncing Your Latest Tunes with Your TypePad List"
keywords: "iTunes, TypePad, Integration, Music, Syncing, Playlists, Latest Tunes, Guide, Tutorial"
date: 2004-05-21T09:43:20+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
layout: post

description: Learn how to integrate iTunes with TypePad using a program that updates your TypePad list with the songs you're currently listening to. This guide offers simple instructions and ensures your favorite tunes are always in sync

guid: 5a3cd62d-c94f-4f67-8504-7dead22e0a28
permalink: /2004/05/21/currently_liste/
categories:
  - Computers
---
Ok, So I have iTunes running here at work, and I have Typepad running. So now the two of them are working together. This program below will update TypePad list of songs with the latest tunes you are listening to. You will need to instert your List ID, Username, and Password instead of the ************'s.

Enjoy. 

{% highlight csharp linenumbers%}
using System;
using System.Text;
using System.Net;
using iTunesLib;
namespace tjtTypePad
{
class iTunesPlayedTracksUpdater
{
private static void handler_PlayEvent(object o)
{
// Get the track
IITTrack track = (IITTrack)o;
string linkTitle = track.TrackNumber + ". " + track.Name + " (" + track.Artist + ")";
Console.WriteLine("Updating most recent track: " + linkTitle);
int myRating = track.Rating / 20;
// create and fetch the url, which updates the links
string url = "https://www.typepad.com/t/app/lists?__mode=save_item&list_id=************&song=" + track.Name;
url = url +  "&artist=" + track.Artist + "&Album=" + track.Album + "&rating=" + myRating + "&username=************&password=************&remember=1";
// Console.WriteLine(url);
WebRequest wr = WebRequest.Create(url);
WebResponse r = wr.GetResponse();
// we don't care about the actual response, so close it.
r.Close();
}
[STAThread]
static void Main(string[] args)
{
// Create the object for interacting with iTunes
iTunesApp app = new iTunesAppClass();
// Binds our function to be called whenever a new track is played
app.OnPlayerPlayEvent += new iTunesLib._IiTunesEvents_OnPlayerPlayEventEventHandler(handler_PlayEvent);
while (true)
{  // loop endlessly
System.Threading.Thread.Sleep(1000); // sleep so we don't hog CPU
}
}
}
}
</pre>
{% endhighlight %}