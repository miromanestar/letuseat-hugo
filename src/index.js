import "./css/main.css";

//Sticky menu
(function ($) {
    $(window).scroll(function () {
        if ($('.navigation').offset().top >= 50) {
            $('.navigation').addClass('nav-bg');
        } else {
      $('.navigation').removeClass('nav-bg');
        }
    });
})(jQuery);