// Vanilla initialization (jQuery optional but not required)
(function() {
  function initializePageFeatures() {
    if (document.getElementById('insert-table-of-contents-here')) {
      GenerateTableOfContents();
    }
    if (document.getElementById('main_content')) {
      addLinksToHeaders('main_content');
      const main_content = document.getElementById('main_content');
      addAnchorTagsToParagraphNodes(main_content);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageFeatures);
  } else {
    initializePageFeatures();
  }
})();

function addLinksToHeaders(elementId) {
  const root = document.getElementById(elementId);
  if (!root) return;
  const getCookieValue = function(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const tocArrowsVisible = getCookieValue('tocArrowsVisible') === 'true';
  const htmlContent = `<a href="#Top-of-Table-of-Contents" class="text-decoration-none float-end" style="display:${tocArrowsVisible ? 'inline-block' : 'none'};">&#x2191;</a>`;
  root.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
    if (!h.firstElementChild || h.firstElementChild.getAttribute('href') !== '#Top-of-Table-of-Contents') {
      h.insertAdjacentHTML('afterbegin', htmlContent);
    }
  });
}

function stripURLHash(urlToParse) {
  url = new URL(urlToParse); // create a URL object
  url.hash = "";             // remove the anchor
  return url.href;           // get the href without the anchor
}

// Non-destructive: operate directly on existing paragraph nodes inside root
function addAnchorTagsToParagraphNodes(root) {
  if (!root || root.dataset.paragraphAnchorsAugmented === 'yes') return;
  const paragraphs = root.querySelectorAll('p');
  paragraphs.forEach(paragraph => {
    // Skip paragraphs inside the hex figure to avoid layout side-effects
    if (paragraph.closest('figure.hex-multi-scale')) return;
    const paragraphText = paragraph.textContent.trim();
    const words = paragraphText.split(" ");
    const firstFiveWords = words.slice(0, 5).join(" ");
    const firstFiveLetters = concatenateFirstLetters(firstFiveWords);

    // Create the opening anchor tag
    const openingAnchor = doc.createElement("a");
    openingAnchor.classList.add("WinerAnchor");
    openingAnchor.id = firstFiveLetters;
    openingAnchor.name = firstFiveLetters;
    paragraph.insertBefore(openingAnchor, paragraph.firstChild);

    // Create the closing anchor tag
    const closingAnchor = doc.createElement("a");
    closingAnchor.href = `#`+firstFiveLetters;
    closingAnchor.textContent = `¶`;
    closingAnchor.classList.add("Winerlink");
    
    // Check if pilcrow should be visible based on cookie
    try {
      const getCookieValue = function(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      };
      
      // Apply initial visibility state based on the cookie
      const pilcrowVisible = getCookieValue('pilcrowVisible') === 'true'; // Default to hidden if cookie not set
      closingAnchor.style.display = pilcrowVisible ? 'inline' : 'none';
    } catch (e) {
      // If there's an error, default to hiding the pilcrows
      console.warn("Error reading pilcrow visibility cookie:", e);
      closingAnchor.style.display = 'none';
    }
    
    paragraph.appendChild(closingAnchor);
  });
  root.dataset.paragraphAnchorsAugmented = 'yes';
}

function concatenateFirstLetters(text) {
  // Concatenate the input text with a default string, remove non-alphanumeric characters, and split into words
  const words = (text + " Lorem ipsum dolor sit amet consectetur")
      .replace(/[^\p{Letter}\p{Number} ]/gu, "")
      .split(" ");

  // Get the first letter of the first five words
  const firstLetters = words.slice(0, 5).map(word => word.charAt(0).toUpperCase());

  // Calculate the number of missing letters
  const missingLettersCount = 5 - firstLetters.length;

  // Generate a seed from the text
  const seed = [...text].reduce((acc, char) => acc + char.charCodeAt(), 0);

  // Define all possible letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  // Add random letters to firstLetters
  Array.from({ length: missingLettersCount }, (_, i) => 
      firstLetters.push(letters[(seed + i) % letters.length])
  );

  // Concatenate the letters and convert to lowercase
  return firstLetters.join("").toLowerCase();
}

function GenerateTableOfContents() {  
  const toc = document.getElementById('insert-table-of-contents-here');
  
  // Exit early if TOC element doesn't exist
  if (!toc) {
    console.log('Table of Contents element not found - skipping TOC generation');
    return;
  }
  
  const headers = document.querySelectorAll('#main_content h1, #main_content h2, #main_content h3, #main_content h4, #main_content h5, #main_content h6');
  
  // Determine the level of the first header to calculate the offset
  const firstHeaderLevel = headers.length > 0 ? parseInt(headers[0].tagName.substring(1), 10) : 1;
  const offset = firstHeaderLevel - 1; // Calculate offset to adjust levels to start from 1
  
  let tocItems = ['<ol>']; // Start with an opening <ol> tag
  let currentLevel = 1;

  headers.forEach((header, i) => {
    // Adjust the level of the header based on the offset
    const level = parseInt(header.tagName.substring(1), 10) - offset;

    // Adjust the level depth
    while (level > currentLevel) {
      tocItems.push('<ol>'); // Open a new list
      currentLevel++;
    }
    while (level < currentLevel) {
      tocItems.push('</li></ol>'); // Close current list item and step out
      currentLevel--;
    }

    // Create ID and link for the header
    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, '');
    header.id = headerId; // Assign ID to header

    // Check if next header is at the same or higher level
    const nextHeader = headers[i + 1];
    const nextLevel = nextHeader ? parseInt(nextHeader.tagName.substring(1), 10) - offset : currentLevel;

    if (nextLevel <= level) {
      // If next header is at the same or higher level, close the list item
      tocItems.push(`<li><a href="#${headerId}">${headerText}</a></li>`);
    } else {
      // If next header is at a lower level, start the list item but don't close it
      tocItems.push(`<li><a href="#${headerId}">${headerText}</a>`);
    }
  });

  // Close all open lists and items
  while (currentLevel > 1) {
    tocItems.push('</li></ol>'); // Properly close each level
    currentLevel--;
  }
  tocItems.push('</ol>'); // Close the initial <ol>

  toc.innerHTML = tocItems.join(''); // Convert array to string and set as HTML once
  toc.setAttribute('role', 'navigation');
  toc.setAttribute('aria-label', 'Table of contents');
}