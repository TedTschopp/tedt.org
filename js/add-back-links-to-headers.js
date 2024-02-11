$(document).ready(function() {
    var htmlContent = '<a href="javascript:history.back()" class="text-decoration-none float-end">&#x2191;</a>';

    // Select all headline tags (h1 to h6)
    $(':header').each(function() {
        // Insert the HTML content as the first child of each headline tag
        $(this).prepend(htmlContent);
    });
});
