/**
 * This script generates a table of contents for a webpage.
 * It should be run when the window loads.
 */
window.onload = function() {
  // Initialize an empty string to build the table of contents
  var toc = "";

  // Initialize the current heading level
  var level = 0;

  // Get the main content of the page
  var mainContent = document.getElementById("main_content").innerHTML;

  // Replace each heading in the main content with a heading that includes an anchor
  // Also, build the table of contents as a nested list of links to these anchors
  mainContent = mainContent.replace(
    /<h([\d])>([^<]+)<\/h([\d])>/gi, // Regular expression to match headings
    function(str, openLevel, titleText, closeLevel) {
      // If the opening and closing levels don't match, return the original string
      if (openLevel != closeLevel) {
        return str;
      }

      // If the current level is less than the opening level, add new lists to the table of contents
      if (openLevel > level) {
        toc += (new Array(openLevel - level + 1)).join("<ul>");
      } 
      // If the current level is greater than the opening level, close the current lists
      else if (openLevel < level) {
        toc += (new Array(level - openLevel + 1)).join("</ul>");
      }

      // Update the current level
      level = parseInt(openLevel);

      // Generate an anchor from the title text
      var anchor = titleText.replace(/ /g, "_");

      // Add a list item to the table of contents
      toc += "<li><a href=\"#" + anchor + "\">" + titleText + "</a></li>";

      // Return the modified heading
      return "<h" + openLevel + "><a name=\"" + anchor + "\">" + titleText + "</a></h" + closeLevel + ">";
    }
  );

  // If there are any open lists, close them
  if (level) {
    toc += (new Array(level + 1)).join("</ul>");
  }

  // Add the table of contents to the page
  document.getElementById("toc").innerHTML += toc;
};