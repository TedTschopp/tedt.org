document.addEventListener('DOMContentLoaded', function() {
    generateTOC("insert-table-of-contents-here")

});

/**
 * Function to generate a Table of Contents (TOC) for an article.
 * The TOC is a nested list of links to the headings in the article.
 * The TOC is inserted into the DOM object with the provided ID.
 *
 * @param {string} tocContainerId - The ID of the DOM object where the TOC should be inserted.
 */
function generateTOC(tocContainerId) {
    // Find the article element
    const article = document.getElementById('content-column');
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
    toc.id = 'table-of-contents-container';
    let currentLevel = 0;
    let currentList = toc; // Initialize currentList as toc

    // Build a nested list structure based on heading levels
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1), 10);

        // Adjust the list level based on heading level
        if (level > currentLevel) {
            const newList = document.createElement('ol');
            currentList.appendChild(newList);
            currentList = newList;
            currentLevel++;
        } else {
            while (level < currentLevel) {
                currentList = currentList.parentElement;
                currentLevel--;
            }
        }

        // Add the heading to the table of contents
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = heading.textContent;
        anchor.href = document.location+`#${heading.id}`;

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
