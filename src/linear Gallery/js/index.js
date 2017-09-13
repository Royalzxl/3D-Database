$(function ($) {
    var $ul = $("#box ul"),
        $Li = $("#box ul li");
    $Li.eq(0).css({"opacity":1});
    $Li.click(function () {
        var index = $(this).index();
        $(this).stop().animate({
            "width" : "600px",
            "height" : "400px",
            "marginTop" : "0px",
            "opacity":1
        },1000).siblings().stop().animate({
            "width":"260px",
            "height":"150px",
            "margin-top":"135px",
            "opacity": .3
        });
        $ul.stop().animate({
            marginLeft: -(index*260 + 300)+"px"
        },1000)
    })
});