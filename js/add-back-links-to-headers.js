// Vanilla implementation (jQuery optional)
(function() {
    function addBackLinksToHeaders() {
        const htmlContent = '<a href="#Top-of-Table-of-Contents" class="text-decoration-none float-end">&#x2191;</a>';
        document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
            if (!h.firstElementChild || h.firstElementChild.getAttribute('href') !== '#Top-of-Table-of-Contents') {
                h.insertAdjacentHTML('afterbegin', htmlContent);
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBackLinksToHeaders);
    } else {
        addBackLinksToHeaders();
    }
})();
