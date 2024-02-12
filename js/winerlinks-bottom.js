$(document).ready(function() {
  var existingReadyFunction = $.fn.ready;

  $.fn.ready = function(fn) {
    if (existingReadyFunction) {
      existingReadyFunction();
    }

    var main_content = $('#main_content');
    main_content.html(addAnchorTagsToParagraphs(main_content.html()));

    if (fn) {
      fn();
    }
  };
});