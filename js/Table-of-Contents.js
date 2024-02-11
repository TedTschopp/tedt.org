
// Store the existing window.onload function in a variable
var existingOnload = window.onload;

// Define a new function to be added to window.onload
var newOnload = function() {
  var toc = "";
  var level = 0;
  var maxLevel = 3;

  document.getElementById("main_content").innerHTML =
      document.getElementById("main_content").innerHTML.replace(
          /<h([\d])>([^<]+)<\/h([\d])>/gi,
          function (str, openLevel, titleText, closeLevel) {
              if (openLevel != closeLevel) {
       c.log(openLevel)
                  return str + ' - ' + openLevel;
              }

              if (openLevel > level) {
                  toc += (new Array(openLevel - level + 1)).join("<ol>");
              } else if (openLevel < level) {
                  toc += (new Array(level - openLevel + 1)).join("</ol>");
              }

              level = parseInt(openLevel);

              var anchor = titleText.replace(/ /g, "_");
              toc += "<li><a href=\"#" + anchor + "\">" + titleText
                  + "</a></li>";

              return "<h" + openLevel + "><a name=\"" + anchor + "\">"
                  + titleText + "</a></h" + closeLevel + ">";
          }
      );

  if (level) {
      toc += (new Array(level + 1)).join("</ol>");
  }

  document.getElementById("toc").innerHTML += toc;
};

// Add the new function to window.onload
window.onload = function() {
  // If there was an existing window.onload function, call it
  if (existingOnload) {
    existingOnload();
  }

  // Call the new function
  newOnload();
};
