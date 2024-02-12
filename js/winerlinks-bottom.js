// Store the existing window.onload function in a variable
var existingOnload = window.onload;

// Define a new function to be added to window.onload
var newOnloadForWinerLinks = function() {
    var main_content = document.getElementById('main_content');
    main_content.innerHTML = addAnchorTagsToParagraphs(main_content.innerHTML);
};

// Add the new function to window.onload
window.onload = function() {
  // If there was an existing window.onload function, call it
  if (existingOnload) {
    existingOnload();
  }

  // Call the new function
  newOnloadForWinerLinks();
};