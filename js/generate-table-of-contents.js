$(document).ready(function() {
    var toc = "";
    var level = 0;
    var maxLevel = 3;

    alert("Building TOC...");

    var mainContent = $("#main_content");
    var content = mainContent.html();

    content = content.replace(/<h([\d])>([^<]+)<\/h([\d])>/gi, function (str, openLevel, titleText, closeLevel) {
        if (openLevel != closeLevel) {
            console.log(openLevel);
            return str + ' - ' + openLevel;
        }
        if (openLevel > level) {
            toc += (new Array(openLevel - level + 1)).join("<ol>");
        } else if (openLevel < level) {
            toc += (new Array(level - openLevel + 1)).join("</ol>");
        }
        level = parseInt(openLevel);

        var anchor = titleText.replace(/ /g, "_");
        toc += "<li><a href=\"#" + anchor + "\">" + titleText + "</a></li>";

        return "<h" + openLevel + "><a name=\"" + anchor + "\">" + titleText + "</a></h" + closeLevel + ">";
    });

    if (level) {
        toc += (new Array(level + 1)).join("</ol>");
    }

    mainContent.html(content);
    $("#toc").append(toc);
});
