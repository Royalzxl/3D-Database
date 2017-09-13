$(function ($) {
    var $Item = $("#ul .item");
    var $Tab = $("#ulTwo li");
    var length = $Item.length;
    var index = 0;
    var timer = null;
    var $Ul = $("#box");
   
   
    $Tab.eq(0).addClass("current");
    $Item.eq(0).show();
    
    $Tab.click(function () {
        if(index === $(this).index())return;
        change(function () {
            index = $(this).index();
        }.bind(this));
    });
    
    auto();
    $Ul.hover(function () {
        clearInterval(timer);
    },auto());
    
    function auto(){
        timer = setInterval(function () {
            change(function () {
                index ++;
                index %= length;
            })
        },3000);
    }
    
    function change(fn) {
        $Item.eq(index).fadeOut(500);
        $Tab.eq(index).removeClass("current");
        fn && fn ();
        $Item.eq(index).fadeIn(500);
        $Tab.eq(index).addClass("current");
    }
});