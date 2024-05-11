document.addEventListener('DOMContentLoaded', function() {
  const toc = document.getElementById('insert-table-of-contents-here');
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let tocItems = []; // Use an array to collect ToC items
  let currentLevel = 1;

  headers.forEach(header => {
    const level = parseInt(header.tagName.substring(1)); // Get numeric part of heading tag (h1, h2, etc.)

    while (level > currentLevel) {
      tocItems.push('<ol>');
      currentLevel++;
    }
    while (level < currentLevel) {
      tocItems.push('</li></ol>');
      currentLevel--;
    }

    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, ''); // Simplify the ID and remove non-alphanumeric characters
    header.id = headerId; // Assign ID to header

    tocItems.push(`<li><a href="#${headerId}">${headerText}</a></li>`); // Always enclose <a> tags in <li> tags
  });

  // Close all remaining lists
  while (currentLevel > 1) {
    tocItems.push('</li></ol>');
    currentLevel--;
  }

  toc.innerHTML = tocItems.join(''); // Convert array to string and set as HTML
  toc.setAttribute('role', 'navigation');
  toc.setAttribute('aria-label', 'Table of contents');
});