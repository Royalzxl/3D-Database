var arrW = [],
    arrH = [],
    arrL = [],
    arrT = [],
    arrPty = [],
    arrZdx = [],
    index = 0;
var $obj = $("ul li");
var len = $obj.length;
var time = new Date();
$("img.right").click(function () {
    if(new Date - time > 500){
        X(0);
    }
    time = new Date;
});
$("img.left").click(function () {
    if(new Date - time > 500){
        X(1);
    }
    time = new Date;
});
function X(click) {
    for (var i = 0; i < len; i++) {
        arrW[i] = $obj.eq(i).css("width");
        arrH[i] = $obj.eq(i).css("height");
        arrL[i] = $obj.eq(i).css("left");
        arrT[i] = $obj.eq(i).css("top");
        arrPty[i] = $obj.eq(i).find("img").css("opacity");
        arrZdx[i] = $obj.eq(i).css("z-index");
    }
    for (i = 0; i < len; i++) {
        if(click === 1){
            if(i === len-1){index = 0}else{index = i+1}
        }
        if(click === 0){
            if(i === 0){index = len - 1}else{index = i-1}
        }
        $obj.eq(i).find("img").css({"opacity":arrPty[index]});
        $obj.eq(i).css({"z-index":arrZdx[index]});
        $obj.eq(i).stop().animate({
            width:arrW[index],
            height:arrH[index],
            left:arrL[index],
            top:arrT[index]
        },500)
    }
}
