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


