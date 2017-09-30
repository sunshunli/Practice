!function(window, document, $, undefined){
    var $addBtn = $('.addBtn'),
        shopCart = $('.shopcart').get(0),
        add = 0;

    var init = function() {
        initEvt();
    };

    var initEvt = function() {
        $addBtn.on('click', flyToCart);
    };

    var flyToCart = function(event) {
        // offset = $('.shopcart').offset() 此方法用于购物车随滚动条移动的情况
        var cartHeight = $('.shopcart')[0].offsetTop,
            cartWidth = $('.shopcart')[0].offsetLeft,
            $flyer = $('<img class="u-flyer" src="img/boy.jpg"/>'),
            $num = $('#num');

        add++
        $num.html(add);

        $flyer.fly({
            start: {
                /*left: event.pageX,
                top: event.pageY*/
                left: event.clientX,
                top: event.clientY
            },
            end: {
                // left: offset.left,
                // top: offset.top,
                left: cartWidth,
                top: cartHeight,
                width: 0,
                height: 0
            },
            onEnd: function(){
                $("<div>", {
                    class: "pro-opc"
                }).html(1).appendTo(shopCart).animate({
                        opacity: 0,
                        top: -50
                }, 1000, function() {
                    $('.pro-opc:not(:animated)').remove();
                });


            }
        });

    };

    init();
}(window, document, jQuery);
