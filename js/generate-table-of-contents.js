document.addEventListener('DOMContentLoaded', function() {
  const toc = document.getElementById('insert-table-of-contents-here');
  toc.innerHTML = '<ol>'; // Start the ToC with an opening <ol> tag
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let currentLevel = 1;

  headers.forEach(header => {
    const level = parseInt(header.tagName.substring(1)); // Get numeric part of heading tag (h1, h2, etc.)

    // Ensure the correct structure by managing nested lists
    while (level > currentLevel) {
      toc.innerHTML += '<ol>';
      currentLevel++;
    }
    while (level < currentLevel) {
      toc.innerHTML += '</ol></li>'; // Close the current list and list item properly
      currentLevel--;
    }

    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, '');
    header.id = headerId; // Assign ID to header

    toc.innerHTML += `<li><a href="#${headerId}">${headerText}</a>`; // Start the list item with the link
  });

  // Close all open tags properly
  while (currentLevel > 1) {
    toc.innerHTML += '</ol></li>'; // Close each level properly
    currentLevel--;
  }
  toc.innerHTML += '</ol>'; // Finally, close the outermost <ol>

  toc.setAttribute('role', 'navigation');
  toc.setAttribute('aria-label', 'Table of contents');
});
