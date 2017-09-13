window.onload = function () {
    var winW = $(window).width(),
        num = 6,
        imgW = 760,
        index = 0,
        btnLoc = (winW - imgW)/2;
    var $bg = $("#bg div"),
        $slider = $(".slider"),
        $sliderLi = $slider.find("li"),
        $btn = $("#btn div"),
        $thumb = $(".thumb"),
        $thumbLi = $(".thumb li");
    function start(){
        $bg.css({"width": num*winW +"px"});
        $slider.css({"width": num*winW +"px"},"left:0px");
        $sliderLi.css({"width": winW +"px"});
        $btn.eq(0).css({"left": btnLoc +"px"});
        $btn.eq(1).css({"right": btnLoc +"px"});
        $thumb.css({"width": imgW +"px","marginLeft": -imgW/2 +"px"});
    }
    (function () {
        start();
        // thumb里面li的遍历及li属性的设置，鼠标移入移出事件
        $thumb.find("li").each(function () {
            var angle = Math.random()*43-20;//角度
            $(this).css({
                "left": (imgW/(num + 1))*($(this).index()+1)-($(this).width()/2) + "px",
                //transform rotate 的兼容
                "-moz-transform":"rotate("+ angle +"deg)",
                "-webkit-transform":"rotate("+ angle +"deg)",
                "transform":"rotate("+ angle +"deg)"
            }).hover(function () {
                $(this).stop().animate({
                    "top": -10 +"px"
                    
                },30)
            },function () {
                $(this).stop().animate({
                    "top": 0 +"px"
                },30)
            })
        });
        // 改变窗口大小 适应
        $(window).resize(function () {
            winW = $(window).width();
            imgW = 760;
            btnLoc = (winW -imgW)/2;
            start();
            Move(index,30);
        });
    })();
    
    //thumb 点击事件
    $thumbLi.click(function () {
        index = $(this).index();
        Move(index,1000);
    });
    
    //btn 移入移出事件
    $btn.hover(function () {
        $(this).css({"opacity":1})
    },function () {
        $(this).css({"opacity":.6})
    });
    //btn 点击事件
    $btn.eq(0).click(function () {
        index--;
        if(index < 0)index = num -1;
        Move(index,1000);
    });
    $btn.eq(1).click(function () {
        index++;
        index %= num;
        Move(index, 1000);
    });
    
    //Move 函数封装
    function Move(i , speed) {
        //thumbLi 透明度变化
        $thumbLi.eq(i).find("img").css({"opacity":1}).parent().siblings().find("img").css({"opacity":.75});
        $slider.stop().animate({
            left: -i*winW + "px"
        }, speed,"swing");
        $bg.eq(0).stop().animate({
            left: -i*(winW/8)+ "px"
        }, speed,"swing");
        $bg.eq(1).stop().animate({
            left: -i*(winW/4) + "px"
        }, speed,"swing");
        $bg.eq(2).stop().animate({
            left: -i*(winW/2) + "px"
        }, speed,"swing");
    }
};