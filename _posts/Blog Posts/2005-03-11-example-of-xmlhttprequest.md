---
id: 536
title: Example of XMLHttpRequest
date: 2005-03-11T01:49:55+00:00
author:
  name: Ted Tschopp
  url: https://tedt.org
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
layout: post

guid: 4bf037e2-35de-43dc-b271-67c0fa10951f
permalink: /2005/03/11/example-of-xmlhttprequest/
categories:
  - Computers
---
I'm working on this at work, and I'd like to use some of the ideas on my personal sites as well.  I thought I'd post this, as it doesn't yet contain anything to amazing or too specific to my work's environment.

{% highlight html linenos %}
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <title></title>
</head>
<script>
    // global flag
    var isIE = false;

    function searchforEmployee(SearchTerm) {
        var url = "http://ednat.sce.com/edn/cgi-bin/empsearch32XML.pl?EmployeeName=" + SearchTerm
        var XMLRequest = false;
        var Response;
        /*@cc_on @*/
        /*@if (@_jscript_version >= 5)
          // JScript gives us Conditional compilation, we can cope with old IE versions.
          // and security blocked creation of the objects.
          try {
           XMLRequest = new ActiveXObject("Msxml2.XMLHTTP");
           isIE = true;
          } 
          catch (e) {
           try {
            XMLRequest = new ActiveXObject("Microsoft.XMLHTTP");
            isIE = true;
           } 
           catch (E) {
              XMLRequest = false;
           }
          }
        @end @*/
        if (!XMLRequest && typeof XMLHttpRequest != 'undefined') {
            XMLRequest = new XMLHttpRequest();
        }
        XMLRequest.open("GET", url, true);
        XMLRequest.onreadystatechange = function() {
            if (XMLRequest.readyState == 4) {
                Response = XMLRequest.responseXML;

                var employees = Response.getElementsByTagName("EMPLOYEE");
                //Clear the previous results
                SearchResultsDiv.innerHTML = "";

                // Add a table to the div
                var table = document.createElement("table");
                table.setAttribute("border", "1");
                table.setAttribute("width", "100%");
                SearchResultsDiv.appendChild(table);

                // Add a caption
                var caption = "Employee Search Results for '" + SearchTerm + "'";
                table.createCaption().appendChild(document.createTextNode(caption));
                // Add a Header
                var header = table.createTHead();
                var headerrow = header.insertRow(0);
                headerrow.insertCell(0).appendChild(document.createTextNode("Name"));
                headerrow.insertCell(0).appendChild(document.createTextNode("Last Name"));
                headerrow.insertCell(1).appendChild(document.createTextNode("PAX"));
                headerrow.insertCell(2).appendChild(document.createTextNode("Title"));
                headerrow.insertCell(3).appendChild(document.createTextNode("Pager"));
                headerrow.insertCell(4).appendChild(document.createTextNode("Email"));

                for (var i = 0; i < employees.length; i++) {
                    thisEmployee = employees[i];
                    // Parse the XML Document Node
                    var thisEmp_last = thisEmployee.getElementsByTagName("emp_last")[0].firstChild.data;
                    var thisEmp_first = thisEmployee.getElementsByTagName("emp_first")[0].firstChild.data;
                    var thisPax_num = thisEmployee.getElementsByTagName("pax_num")[0].firstChild.data;
                    var thisPin = thisEmployee.getElementsByTagName("pin")[0].firstChild.data;
                    var thisTitle = thisEmployee.getElementsByTagName("title")[0].firstChild.data;
                    var thisPagernum = thisEmployee.getElementsByTagName("pagernum")[0].firstChild.data;
                    var thisPre_name_flag = thisEmployee.getElementsByTagName("pre_name_flag")[0].firstChild.data;
                    var thisLegal_last = thisEmployee.getElementsByTagName("legal_last")[0].firstChild.data;
                    var thisShortname = thisEmployee.getElementsByTagName("shortname")[0].firstChild.data;
                    var thisDominoserver = thisEmployee.getElementsByTagName("dominoserver")[0].firstChild.data;
                    var thisMfpd = thisEmployee.getElementsByTagName("mfpd")[0].firstChild.data;
                    var thisPager_checked = thisEmployee.getElementsByTagName("pager_checked")[0].firstChild.data;
                    var thisCell_checked = thisEmployee.getElementsByTagName("cell_checked")[0].firstChild.data;
                    var thisBlackberry_checked = thisEmployee.getElementsByTagName("blackberry_checked")[0].firstChild.data;
                    var thisMail_checked = thisEmployee.getElementsByTagName("mail_checked")[0].firstChild.data;
                    var thisPager_publish = thisEmployee.getElementsByTagName("pager_publish")[0].firstChild.data;
                    var thisCell_publish = thisEmployee.getElementsByTagName("cell_publish")[0].firstChild.data;
                    var thisMfpd_publish = thisEmployee.getElementsByTagName("mfpd_publish")[0].firstChild.data;
                    var thisCell_area = thisEmployee.getElementsByTagName("cell_publish")[0].firstChild.data;
                    var thisCell_phone = thisEmployee.getElementsByTagName("cell_phone")[0].firstChild.data;
                    // Process
                    // Step 1. Create a new Search Results Set of divs to add to the page
                    var row = table.insertRow(i + 1);
                    row.insertCell(0).appendChild(document.createTextNode(thisEmp_first + " " + thisEmp_last));
                    row.insertCell(1).appendChild(document.createTextNode(thisEmp_last));
                    row.insertCell(2).appendChild(document.createTextNode(thisPax_num));
                    row.insertCell(3).appendChild(document.createTextNode(thisTitle));
                    row.insertCell(4).appendChild(document.createTextNode(thisPagernum));
                    row.insertCell(5).appendChild(document.createTextNode(thisDominoserver));
                }
            }
        }
        XMLRequest.send(null)
    }
</script>

<body>
    <form id="employeeSearchForm" name="employeeSearchForm">
        <input type="text" id="searchterm">
        <!---           onkeypress="(employeeSearchForm.searchterm.value.length > 2) ? searchforEmployee(employeeSearchForm.searchterm.value) : SearchResultsDiv.innerHTML='';  searchlength.value = employeeSearchForm.searchterm.value.length;" > --->
        <input type="button" onclick="searchforEmployee(employeeSearchForm.searchterm.value);" id="Search" value="Search">
    </form>
    <div id="searchlength"></div>
    <div id="SearchResultsDiv">
    </div>
</body>

</html>
{% endhighlight %}
