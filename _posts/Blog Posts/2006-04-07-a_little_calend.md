---
id: 160
title: A Little Calendar App I'm building
date: 2006-04-07T17:57:34+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
layout: post

guid: 6aa28676-c0d7-4f35-b348-4258ea3ce342
permalink: /2006/04/07/a_little_calend/
categories:
  - Computers
---
The following code is a calendar application I’m building in JavaScript. It needs a couple rounds of refactoring (to get rid of document.writes and to make it more object friendly).  The next step will be to make it handle iCal files (which will be a trick).  This is posted for all to enjoy. See the link at the end of this document.


~~~html
<style>
  body {
   font-family: Verdana, Geneva, Arial, Helvetica, sans-serif;
  }
  .calendar{
   background-color: #F5F5F5;
  }
  
  .EndOfMonth {
   background-color: #ADD8E6;
   padding: 0 .1em 0 .1em;
  }
  .EndOfYear {
   background-color: Green;
   padding: 0 .1em 0 .1em;
  }
  .NotEndOfMonth {
   padding: 0 .1em 0 .1em;
  }
  .NotEndOfYear {
   padding: 0 .1em 0 .1em;
  }
  .today {
   background-color: #E6E6FA;
  }
  .weekend {
   color: Silver;
   font-size: .75em;
  }
  .calendarDate {
   width: 30px;
   padding: .25em 0em .25em 0em;
   margin: .25em 0em .25em 0em;
   text-align: center;
  }
  .calendarheader {
   width: 30px;
   padding: .25em 0em .25em 0em;
   margin: .25em 0em .25em 0em;
   text-align: center;
   background-color: Gray;
   color: White;
   font-weight: bold;
   text-transform: uppercase;
  }
  .calendarheader .weekend {
   width: 30px;
   padding: .25em 0em .25em 0em;
   margin: .25em 0em .25em 0em;
   text-align: center;
   background-color: silver;
   color: White;
   font-weight: bold;
   text-transform: lowercase;
  }
  .Notes {
   text-align: left;
   font-weight: normal;
  }
  .NotesMonth {
   background-color: #ADD8E6;
  }
  
 </style>
<script>
 sunday = 0;
 monday = 1;
 tuesday = 2;
 wednesday = 3;
 thursday = 4;
 friday = 5;
 saturday = 6; 
 
 /* Convert to Date Properity */
 var Month = new Array();
 Month[0] = "Janurary";
 Month[1] = "Feburary";
 Month[2] = "March";
 Month[3] = "April";
 Month[4] = "May";
 Month[5] = "June";
 Month[6] = "July";
 Month[7] = "August";
 Month[8] = "September";
 Month[9] = "October";
 Month[10] = "November";
 Month[11] = "December";
 
 
 function startCalendar(date) {
  document.write('<table class="calendar" cellpadding="0" cellspacing="0"><tr class="calendarheader">');
  document.write('<td class="Notes">Month</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="weekend sunday weekend" id="sunday" title="Sunday" abbr="Sunday">s</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="monday" id="monday" title="Monday" abbr="Monday">m</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="tuesday" id="tuesday" title="Tuesday" abbr="Tuesday">t</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="wednesday" id="wednesday" title="Wednesday" abbr="Wednesday">w</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="thursday" id="thursday" title="Thursday" abbr="Thursday">&thorn;</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="friday" id="friday" title="Friday" abbr="Friday">f</td>');
  document.write('<td class="NotEndOfYear"></td><td class="NotEndOfMonth"></td>');
  document.write('<td class="weekend saturday weekend" title="Saturday" id="saturday" abbr="Saturday">s</td>');
 } 
 function finishCalendar(date) {
  document.write('</td></tr></table>');
 } 
 function output_calendar_day(date) {
  var outputclass = " calendarDate ";
  /* Output a day in a calendar */
  if(date.getDay()==sunday || date.getDay()==saturday ) {
   outputclass = outputclass + " weekend ";
  }
  if(date.getDay()==sunday) {
   outputclass = outputclass + " sunday ";
  }
  if(date.getDay()==monday) {
   outputclass = outputclass + " monday ";
  }
  if(date.getDay()==tuesday) {
   outputclass = outputclass + " tuesday ";
  }
  if(date.getDay()==wednesday) {
   outputclass = outputclass + " wednesday ";
  }
  if(date.getDay()==thursday) {
   outputclass = outputclass + " thursday ";
  }
  if(date.getDay()==friday) {
   outputclass = outputclass + " friday ";
  }
  if(date.getDay()==saturday) {
   outputclass = outputclass + " saturday ";
  }
  if (date.toDateString() == today.toDateString() ){
   outputclass = outputclass + " today ";
  }
  document.write('<td title="' + date.toLocaleDateString() +'" class="'+outputclass+'">'+date.getDate()+"</td>");
 }
 function output_end_of_week(date) {
  /* Handle the End of the week */
  document.write('</tr><tr><td class="Notes"></td>');
 }
 function output_end_of_month(date) {
  /* Handle the output for the end of the Month */
  document.write('<td class="EndOfMonth" id="'+date.getYear()+Month[date.getMonth()]+'" title="'+Month[date.getMonth()]+'"></td>');
  var thisMonth=date.getYear()+Month[date.getMonth()];
  d=document.getElementById(thisMonth);
  d.parentNode.childNodes[0].innerHTML = Month[date.getMonth()];
  d.parentNode.childNodes[0].className = d.parentNode.childNodes[0] + " NotesMonth ";
 }
 function output_not_end_of_month(date) {
  /* Handle the output for the end of the Month */
  document.write('<td class="NotEndOfMonth"></td>');
 }
 function output_end_of_year(date) {
  /* Handle the output for the end of the Month */
  document.write('<td class="EndOfYear" title="'+date.getYear()+'"></td>');
 }
 function output_not_end_of_year(date) {
  /* Handle the output for the end of the Month */
  document.write('<td class="NotEndOfYear"></td>');
 }
 var oneDay = (60 * 60 * 24 * 1000)
 today = new Date();
 start = new Date();
 finish = new Date();
 DateOutput = new Date();
 DateOutputYesterday = new Date();
 start.setMonth(today.getMonth()-3);
 finish.setMonth(today.getMonth()+9);
 start.setDate(start.getDate() - start.getDay());
 startCalendar(start);
 for(i = start.valueOf(); i < finish.valueOf(); i=i+oneDay) {
  DateOutput.setTime(i)
  DateOutputYesterday.setTime(i-oneDay);
  if (DateOutputYesterday.getDay()==6) {
   output_end_of_week(DateOutput);  
  }
  if (DateOutput.getYear() !== DateOutputYesterday.getYear()) {
   output_end_of_year(DateOutput);
  }else{
   output_not_end_of_year(DateOutput);
  }
  if (DateOutput.getMonth() !== DateOutputYesterday.getMonth()) {
   output_end_of_month(DateOutput);
  }else{
   output_not_end_of_month(DateOutput);
  }
  output_calendar_day(DateOutput);
 }
 finishCalendar(finish);
</script>
~~~


EDIT: Ok, more stuff to post on my calendar [App](https://tedt.org/2006/04/07/a_little_calend/).&#160; I've gotten the ical file loaded into the webpage, now I need to convert the ical file into a usable data type.&#160; My current thoughts are to go from i-Cal -> XML.&#160; I need to spend some time looking at the practices of converting from i-Cal -> XML.&#160; I notice that Google is doing it.&#160; Also the Microformat guys seem to be doing it as well.