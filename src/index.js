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

    //Function to add fancybox to images on blogs...
    if(window.location.pathname.includes('blog')) {
        $("img").each(function() {
            if($(this).attr('alt') !=== 'Let Us Eat') {
                var $this = $(this);
                var src = $this.attr('src');
                var caption = $this.attr('alt')
                $this.addClass('image');
                var a = $('<a/>').attr({'href': src, 'data-fancybox': 'images', 'data-caption': caption});
                $this.wrap(a);
            }
        });
    }

})(jQuery);