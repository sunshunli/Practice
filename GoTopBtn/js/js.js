!function(window, document, $, undefined) {

    var goTop = function() {
        $(window).on('scroll', function() {
            var $this = $(this),
                st = $this.scrollTop(),
                wHeight = $this.height();

            if (st > wHeight) {
                $('.goTop').slideDown();
            } else {
                $('.goTop').slideUp();
            }
        });

        $('.goTop').on('click', function() {
            $('html').animate({
                scrollTop: 0
            }, 300);
        });
    };

    goTop();

}(window, document, jQuery);