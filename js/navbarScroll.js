$(function() {
  $(document).scroll(function() {
    var $nav = $('.navbar-change');
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
