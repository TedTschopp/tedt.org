document.addEventListener('DOMContentLoaded', function() {
  const toc = document.getElementById('insert-table-of-contents-here');
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let tocItems = ['<ol>']; // Start with an opening <ol> tag
  let currentLevel = 1;

  headers.forEach(header => {
    const level = parseInt(header.tagName.substring(1), 10); // Get numeric part of heading tag (h1, h2, etc.)

    // Adjust the level depth
    while (level > currentLevel) {
      tocItems.push('<ol>');
      currentLevel++;
    }
    while (level < currentLevel) {
      tocItems.push('</li></ol>'); // Close current list and step out
      currentLevel--;
    }

    // Create ID and link for the header
    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, '');
    header.id = headerId; // Assign ID to header

    tocItems.push(`<li><a href="#${headerId}">${headerText}</a>`); // Append the link wrapped in <li>
  });

  // Close all open lists and items
  while (currentLevel > 1) {
    tocItems.push('</li></ol>'); // Properly close each level
    currentLevel--;
  }
  tocItems.push('</li></ol>'); // Close the initial <ol>

  toc.innerHTML = tocItems.join(''); // Convert array to string and set as HTML once
  toc.setAttribute('role', 'navigation');
  toc.setAttribute('aria-label', 'Table of contents');
});
