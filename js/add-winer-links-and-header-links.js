$(document).ready(function() {
    // Generate the Table of Contents
    GenerateTableOfContents();

    // Link up the Table of Contents to each of the proper Header Tags.
    // Call the function with the ID of the element you want to add links to
    addLinksToHeaders('main_content');

    // Step 2: Add Winer Tags to Paragraphs
    var main_content = document.getElementById('main_content');
    main_content.innerHTML = addAnchorTagsToParagraphs(main_content.innerHTML);

});

function addLinksToHeaders(elementId) {
  var htmlContent = '<a href="#Top-of-Table-of-Contents" class="text-decoration-none float-end">&#x2191;</a>';

  // Select all headline tags (h1 to h6) within the specified element
  $(`#${elementId} :header`).each(function() {
      // Insert the HTML content as the first child of each headline tag
      $(this).prepend(htmlContent);
  });
}

function stripURLHash(urlToParse) {
  url = new URL(urlToParse); // create a URL object
  url.hash = "";             // remove the anchor
  return url.href;           // get the href without the anchor
}

function addAnchorTagsToParagraphs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const paragraphs = doc.querySelectorAll("p");

  paragraphs.forEach((paragraph) => {
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
    paragraph.appendChild(closingAnchor);
  });

  return doc.documentElement.innerHTML;
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
  const headers = document.querySelectorAll('#main_content h1, #main_content h2, #main_content h3, #main_content h4, #main_content h5, #main_content h6');
  let tocItems = []; // Initialize an empty array for building the TOC HTML
  let currentLevel = 0;

  headers.forEach(header => {
    const level = parseInt(header.tagName.substring(1), 10); // Get numeric part of heading tag (h1, h2, etc.)

    // Create ID and link for the header
    const headerText = header.textContent;
    const headerId = headerText.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/gi, '');
    header.id = headerId;

    // Adjust the level depth
    while (level > currentLevel) {
      tocItems.push('<ol><li>'); // Open a new list and a new list item
      currentLevel++;
    }
    while (level < currentLevel) {
      tocItems.push('</li></ol>'); // Close current list item and step out
      currentLevel--;
    }
    if (level === currentLevel) {
      if (currentLevel !== 0) tocItems.push('</li>'); // Close the previous list item if not at the first item
      tocItems.push(`<li><a href="#${headerId}">${headerText}</a>`); // Start a new list item
    }
  });

  // Close all open lists and items
  while (currentLevel > 0) {
    tocItems.push('</li></ol>'); // Properly close each level
    currentLevel--;
  }

  toc.innerHTML = tocItems.join(''); // Convert array to string and set as HTML
  toc.setAttribute('role', 'navigation');
  toc.setAttribute('aria-label', 'Table of contents');
}