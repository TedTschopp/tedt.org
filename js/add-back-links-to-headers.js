// Safe jQuery initialization - check if jQuery is available
(function() {
    function addBackLinksToHeaders() {
        // Only proceed if we have jQuery available (this function requires it)
        if (typeof $ === 'undefined' || !$.fn) return;
        
        var htmlContent = '<a href="#Top-of-Table-of-Contents" class="text-decoration-none float-end">&#x2191;</a>';

        // Select all headline tags (h1 to h6)
        $(':header').each(function() {
            // Insert the HTML content as the first child of each headline tag
            $(this).prepend(htmlContent);
        });
    }

    // Try jQuery first, fallback to doing nothing (this function requires jQuery)
    if (typeof $ !== 'undefined' && typeof $.fn !== 'undefined' && $.fn.ready) {
        $(document).ready(addBackLinksToHeaders);
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addBackLinksToHeaders);
        } else {
            addBackLinksToHeaders();
        }
    }
})();
