document.addEventListener('DOMContentLoaded', function() {
  var main_content = document.getElementById('main_content');
  main_content.innerHTML = addAnchorTagsToParagraphs(main_content.innerHTML);
});