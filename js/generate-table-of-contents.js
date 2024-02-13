$(document).ready(function() {
    htmlTableOfContents();
}); 

function htmlTableOfContents( documentRef ) {
    var documentRef = documentRef || document;
    var toc = documentRef.getElementById("toc");
//  Use headings inside <article> only:
//  var headings = [].slice.call(documentRef.body.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6'));
    var headings = [].slice.call(documentRef.body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headings.forEach(function (heading, index) {
        var ref = "toc" + index;
        if ( heading.hasAttribute( "id" ) ) 
            ref = heading.getAttribute( "id" );
        else
            heading.setAttribute( "id", ref );

        var link = documentRef.createElement( "a" );
        link.setAttribute( "href", "#"+ ref );
        link.textContent = heading.textContent;

        var div = documentRef.createElement( "div" );
        div.setAttribute( "class", heading.tagName.toLowerCase() );
        div.appendChild( link );
        toc.appendChild( div );
    });
}