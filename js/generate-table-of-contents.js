document.addEventListener('DOMContentLoaded', function() {
    generateTOC("insert-table-of-contents-here")

});

/**
 * Generates a table of contents for a document.
 * 
 * @param {Document} documentRef - The document to generate the table of contents for. Defaults to the current document.
 */
function htmlTableOfContents(documentRef) {
    // Use the provided document reference or default to the current document
    var documentRef = documentRef || document;

    // Get the table of contents element
    var toc = documentRef.getElementById("toc");

    // Get all heading elements inside <article> tags
    var headings = [].slice.call(documentRef.body.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6'));

    var lastLevel = 0;

    // Iterate over each heading
    headings.forEach(function (heading, index) {
        // Create a reference for the heading
        var ref = "toc" + index;

        // If the heading already has an id, use it as the reference
        if (heading.hasAttribute("id")) {
            ref = heading.getAttribute("id");
        } else {
            // Otherwise, set the id of the heading to the reference
            heading.setAttribute("id", ref);
        }

        // Create a link to the heading
        var link = documentRef.createElement("a");
        link.setAttribute("href", "#" + ref);
        link.textContent = heading.textContent;

        // Create a list element and append the link to it
        var listElement = documentRef.createElement("li");
        listElement.appendChild(link);

        // Get the level of the heading (e.g., h1 -> 1, h2 -> 2, etc.)
        var className = heading.tagName.toLowerCase();
        var thisLevel = parseInt(className.charAt(1));

        var unorderedList;
        var parent = toc;

        // The commented out code appears to be an attempt to nest lists based on heading level,
        // but it's currently not functional. It would need to be debugged and completed.

        // If the current heading is a higher level than the last one, create a new list
        //        if (thisLevel > lastLevel) {
        //            unorderedList = documentRef.createElement("ul");
        //            unorderedList.appendChild(listElement);
        //            parent.lastChild.appendChild(unorderedList);
        //        } else if (thisLevel < lastLevel) {
        //            // close off the last list and start a new one
        //            var diff = lastLevel - thisLevel;
        //            for (var i = 0; i < diff; i++) {
        //                parent = parent.parentNode;
        //            }
        //            unorderedList = documentRef.createElement("ul");
        //            unorderedList.appendChild(listElement);
        //            parent.appendChild(unorderedList);
        //        } else {
        //            unorderedList = documentRef.createElement("ul");
        //            unorderedList.appendChild(listElement);
        //            parent.appendChild(unorderedList);
        //        }
        //


        // Update the last level
        lastLevel = thisLevel;
    });
}


/**
 * Function to generate a Table of Contents (TOC) for an article.
 * The TOC is a nested list of links to the headings in the article.
 * The TOC is inserted into the DOM object with the provided ID.
 *
 * @param {string} tocContainerId - The ID of the DOM object where the TOC should be inserted.
 */
function generateTOC(tocContainerId) {
    // Find the article element
    const article = document.querySelector('article');
    if (!article) {
        console.log('Article tag not found.');
        return;
    }

    // Collect all heading tags within the article
    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
        console.log('No headings found in the article.');
        return;
    }

    // Create the table of contents container
    const toc = document.createElement('div');
    toc.id = 'toc';
    toc.innerHTML = '<h2>Table of Contents</h2>';
    let currentLevel = 0;
    let currentList = document.createElement('ul');

    toc.appendChild(currentList);

    // Build a nested list structure based on heading levels
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1), 10);

        // Adjust the list level based on heading level
        while (level > currentLevel) {
            const newList = document.createElement('ul');
            currentList.appendChild(newList);
            currentList = newList;
            currentLevel++;
        }
        while (level < currentLevel) {
            currentList = currentList.parentElement;
            currentLevel--;
        }

        // Add the heading to the table of contents
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = heading.textContent;
        anchor.href = `#${heading.id}`;

        listItem.appendChild(anchor);
        currentList.appendChild(listItem);
    });

    // Find the container where the TOC should be inserted
    const tocContainer = document.getElementById(tocContainerId);
    if (!tocContainer) {
        console.log(`Container with ID "${tocContainerId}" not found.`);
        return;
    }

    // Append the table of contents to the container
    tocContainer.appendChild(toc);
}
