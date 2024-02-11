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
    const words = text.split(" ");
    const firstFiveWords = words.slice(0, 5);
    const firstLetters = firstFiveWords.map(word => word.charAt(0).toUpperCase());
    
    while (firstLetters.length < 5) {
        // Add a null character to the array in the event that there are less than 5 words.  Not the best, but it should work.
        firstLetters.push('␀');
    }
    
    const concatenatedLetters = firstLetters.join("").toLowerCase();

    return concatenatedLetters;
}


