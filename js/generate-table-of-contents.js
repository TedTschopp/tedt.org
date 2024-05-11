document.addEventListener('DOMContentLoaded', function() {
  const toc = document.getElementById('insert-table-of-contents-here');
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let tocHtml = '';
  let currentLevel = 0;

  headers.forEach(header => {
    const level = parseInt(header.tagName.substring(1)); // Get numeric part of heading tag (h1, h2, etc.)

    if (level > currentLevel) {
      // Start new lists as we go deeper
      tocHtml += '<ol>'.repeat(level - currentLevel);
    } else if (level < currentLevel) {
      // Close lists as we go back up
      tocHtml += '</ol>'.repeat(currentLevel - level);
    }

    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, ''); // Simplify the ID and remove non-alphanumeric characters
    header.id = headerId; // Assign ID to header

    tocHtml += `<li><a href="#${headerId}">${headerText}</a></li>`;

    currentLevel = level;
  });

  // Close remaining open lists
  tocHtml += '</ol>'.repeat(currentLevel - 1); // Adjusted to close all open ul tags
  toc.innerHTML = tocHtml;
});
