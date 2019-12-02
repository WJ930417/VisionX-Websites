/*
$(document).ready(function() {
  $(window).scroll(function() {
    if ($(window).scrollTop() < 100) {
      $('.navbar').css({ 'background-color': 'transparent' });
    } else {
      $('.navbar').css({ 'background-color': 'black' });
    }
  });
});
*/

$(function() {
  $(document).scroll(function() {
    var $nav = $('.navbar-fixed-top');
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
