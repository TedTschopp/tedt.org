$(document).ready(function() {
    htmlTableOfContents();
}); 

function htmlTableOfContents( documentRef ) {

    var documentRef = documentRef || document;
    var toc = documentRef.getElementById("toc");
    //  Use headings inside <article> only:
    var headings = [].slice.call(documentRef.body.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6'));
    //  var headings = [].slice.call(documentRef.body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    var lastLevel = 0;
    headings.forEach(function (heading, index) {
        var ref = "toc" + index;

        if ( heading.hasAttribute( "id" ) ) {
            ref = heading.getAttribute( "id" );
        } else {
            heading.setAttribute( "id", ref );
        }

        var link = documentRef.createElement( "a" );
        link.setAttribute( "href", "#"+ ref );
        link.textContent = heading.textContent;

        var unorderedList = documentRef.createElement( "ul" );

        var listElement = documentRef.createElement( "li" );
        listElement.appendChild( link );

        var className = heading.tagName.toLowerCase();
        var thisLevel = parseInt( className.charAt(1) );


        // If the current heading is a higher level than the last one, create a new list
        if ( thisLevel > lastLevel ) {
            // open up a new list element and append it to the last item
            unorderedList.appendChild( listElement );
        } else if ( thisLevel < lastLevel ) {
            // close off the last list and start a new one
            var diff = lastLevel - thisLevel;
            var parent = toc;
            for ( var i = 0; i < diff; i++ ) {
                parent = parent.parentNode;
            }
            parent.appendChild( listElement );
        } else {
            // add the list item to the parent
            unorderedList.appendChild( listElement );
        }

        // var div = documentRef.createElement( "div" );
        // div.setAttribute( "class", className );
        // div.appendChild( link );
        // toc.appendChild( div );

        // set the last level to this level
        lastLevel = thisLevel;

    });

}