window.onload = function () {
    window.requestAnimationFrame = window.requestAnimationFrame||function (a){ return setTimeout(a,1000/60)};
    window.cancelAnimationFrame = window.cancelAnimationFrame||clearTimeout;
    (function () {
        var length = 5*5*5,
            oUl = document.getElementById("box").children[0], /*oBox = document.getElementById("box"),oUl = oBox.firstElementChild;*/
            aLi = oUl.children;
        //初始化
        (function () {
            //生成5*5*5个li
            for (var i = 0; i < length; i++) {
                var oLi = document.createElement("li");
                // 每个li的坐标 自定义属性表示
                oLi.index = i;
                oLi.x = i%5;
                oLi.y = Math.floor(i%25/5);
                oLi.z = 4 - Math.floor(i/25);
                var date = WsbData[i] || WsbData[0];
                oLi.innerHTML = "<p class='liTitle'>"+date.type+"</p>" +
                    "<p class='liAuthor'>"+date.author+"</p>" +
                    "<p class='liTime'>"+date.time+"</p>";
                //随机分散
                var rX = Math.random()*5000-2500,
                    rY = Math.random()*5000-2500,
                    rZ = Math.random()*5000-2500;
                oLi.style.transform = "translate3d("+rX+"px,"+rY+"px,"+rZ+ "px)";
                oUl.appendChild(oLi);
            }
            setTimeout(Grid, 300); // 定时器里面 函数不能加()，加了后会立即执行，定时器没有效果
        })();
        
        //弹窗模块事件
        (function () {
            var oAlert = document.getElementById("alert"),
                oATitle = oAlert.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oAImg = oAlert.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAInfo = oAlert.getElementsByClassName("info")[0].getElementsByTagName("span")[0],
                oAAuthor = oAlert.getElementsByClassName("author")[0].getElementsByTagName("span")[0];
            var oBWrap = document.getElementById("bg-wrap");
            var oBack = document.getElementById("back");
            var oiFrame = document.getElementById("iFrame");
            //给每一个li加个点击事件，不太合理，这里用事件委托
            oUl.onclick = function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                if(/li/i.test(getNode(target))){
                    if(getNode(target).ICBC){
                        getNode(target).ICBC = false;
                    }else {
                        if(oAlert.style.display === "block"){
                            hide();
                        }else {
                            var index = getNode(target).index;
                            var date = WsbData[index] || WsbData[0];
                            oAlert.index = index;
                            oATitle.innerHTML = date.title;
                            oAImg.src = "src/"+date.src+"/index.png";
                            oAInfo.innerHTML = "描述："+date.dec;
                            oAAuthor.innerHTML = "制作："+date.author;
                            show();
                        }
                    }
                }
            };
            oAlert.onclick = function (e) {
                var date = WsbData[this.index] || WsbData[0];
                oiFrame.src = "src/"+date.src+"/index.html";
                oBWrap.className = "left";
                e.cancelBubble = true; // 阻止冒泡
            };
            document.onclick = function () {
                hide();//li以外点击 alert 弹窗隐藏
            };
            oBack.onclick = function () {
                oBWrap.className = "";
            };
            // Js 动画  显示
            function show() {
                if(!oAlert.timer){
                    oAlert.timer = true;
                    //初始样式
                    oAlert.style.display = "block";
                    oAlert.style.transform = "rotateY(0deg) scale(2)";
                    oAlert.style.opacity = "0";
                    var time = 800,//显示时间
                        sTime = new Date();//初始时间
                    function play() {
                        var prop = (new Date - sTime)/time; // prop 表比例
                        if(prop >= 1){
                            prop = 1;
                            oAlert.timer = false;
                        }else {
                            requestAnimationFrame(play);
                        }
                        oAlert.style.transform = "rotateY(0deg) scale("+((1-2)*prop+2)+")";
                        oAlert.style.opacity = prop;
                    }
                    requestAnimationFrame(play);
                }
                return false;
            }
            //Js 动画 隐藏
            function hide() {
                if(oAlert.style.display === "block" && !oAlert.timer){
                    oAlert.timer = true;
                    oAlert.style.display = "block";
                    oAlert.style.transform = "rotateY(0deg) scale(1)";
                    oAlert.style.opactiy = "1";
                    var time = 800,
                        sTime = new Date();
                    function play() {
                        var prop = (new Date - sTime)/time;
                        if(prop>=1){
                            prop = 1;
                            oAlert.timer = false;
                            oAlert.style.display = "none";
                        }else{
                            requestAnimationFrame(play);
                        }
                        oAlert.style.transform = "rotateY("+180*prop+"deg) scale("+(1 - prop)+")";
                        oAlert.style.opacity = 1 - prop;
                    }
                    requestAnimationFrame(play);
                }
            }
            
        })();
        
        //拖拽与滚轮
        (function () {
            //禁止默认事件
            document.onselectstart = function () {
                return false;
            };
            //禁止图片拖动事件
            document.ondrag = function () {
                return false;
            };
    
            // 定义变量 存储transform 里面的三个值
            var roX = 0,
                roY = 0,
                trZ = -2000;
    
            var timer2 = null;
    
            // 拖拽事件
            document.onmousedown = function (e) {
                e = e || window.event;
                cancelAnimationFrame(timer2 );
                var sX = e.clientX,
                    sY = e.clientY,
                    lastX = sX,
                    lastY = sY,
                    X_ = 0,
                    Y_ = 0,
                    ifMove = false,
                    moveTime = 0,
                    ifTime = new Date;
                if(/li/i.test(getNode(e.target).nodeName)){
                    var thisLi = getNode(e.target);
                }
                this.onmousemove = function (e) {
                    ifMove = true;
                    X_ = e.clientX - lastX;
                    Y_ = e.clientY - lastY;
                    // 拖拽时 旋转的度数
                    roX -= Y_*0.15;
                    roY += X_*0.15;
                    oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
                    lastX = e.clientX;
                    lastY = e.clientY;
                    moveTime = new Date;
                };
                this.onmouseup = function () {
                    if ( ifMove && (e.target !== document) && (getNode(e.target)=== thisLi) && (new Date - ifTime)>500){
                        thisLi.ICBC = true;
                    }
                    this.onmousemove = null;
                    //惯性动画效果
                    function inertia() {
                        X_ *= 0.975;
                        Y_ *= 0.975;
                        roX -= Y_*0.15;
                        roY += X_*0.15;
                        oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
                        //判断何时停止
                        if(Math.abs(X_)<0.015 && Math.abs(Y_)<0.015)return;
                        timer2 = requestAnimationFrame(inertia);
                    }
                    if(new Date - moveTime < 300){
                        timer2 = requestAnimationFrame(inertia);
                    }
                }
            };
            //滚轮事件
            ~function ( fn ) {
                if ( document.onmousewheel === undefined ){
                    document.addEventListener("DOMMouseScroll" , function (e) {
                        var d = -e.detail/3;
                        fn.call(this , d);
                    },false);
                }else{
                    document.onmousewheel = function (e) {
                        var d = e.wheelDelta / 120;
                        fn.call(this , d);
                    }
                }
            }(function (d) {
                trZ += d*100;
                oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
            });
        })();
        
        // tab 点击
        (function () {
            var aTab = document.getElementById("tab").getElementsByTagName("li");
            var arr = [Table,Sphere,Helix,Grid];
            for (var i = 0; i < arr.length; i++) {
                (function (i) {
                    aTab[i].onclick = arr[i];
                })(i);
            }
        })();
    
        // 获取事件源
        function getNode(node) {
            if(node.nodeName === "BODY" || node.nodeName === "DIV" || node.nodeName === "UL"){
                return node;
            }
            if( node.nodeName === "LI"){
                return node;
            } else {
                return getNode(node.parentNode);
            }
            
        }
        
        //Grid 布局方法
        function Grid() {
            if(Grid.arr){
                for (var i = 0; i < length; i++) {
                    aLi[i].style.transform = Grid.arr[i];
                }
            }else {
                Grid.arr = [];
                //每个方向上li之间的间隔
                var disX = 250,
                    disY = 250,
                    disZ = 500;
                for (i = 0; i < length; i++) {
                    var oLi = aLi[i];
                    var x = (oLi.x - 2)*disX, //这里－2 是因为 以坐标(2,2,2)为中心
                        y = (oLi.y - 2)*disY,
                        z = (oLi.z - 2)*disZ;
                    var val = "translate3d("+x+"px,"+y+"px,"+z+"px)";
                    Grid.arr[i] = val;
                    oLi.style.transform = val;
                }
            }
        }
    
        //Helix 螺旋式布局
        function Helix() {
            /* 思路：
            *       1、先让所有的li 以Y轴为中心轴变成一个环型
            *       2、确定环型的大小，即半径 translateZ(800px)
            *       3、再对每个li的Y轴位置(translateY()) 进行逐个叠加
            * */
            if(Helix.arr){
                for (var i = 0; i < length; i++) {
                    aLi[i].style.transform = Helix.arr[i];
                }
            }else {
                Helix.arr = [];
                var h = 3.7,//设定环数
                    tY = 8,// 相邻两个li的Y轴位置差
                    num = Math.round(length / h),//每环的个数   Math.round() --> 四舍五入
                    deg = 360 / num,// 一环里面的每个li 旋转的度数
                    mid = length / 2 - 0.5;//中间的li
                for (i = 0; i < length; i++) {
                    var val = "rotateY("+ i*deg +"deg) translateY("+(i - mid)*tY+"px) translateZ(800px )";
                    Helix.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }
        
        //Sphere 球状布局
        function Sphere() {
            /* 思路：
            *       1、分层、设定每层li的个数
            *       2、先让所有的li 以Y轴为中心轴变成一个环型
            *       3、确定环型的大小，即半径 translateZ(800px)
            *       4、再让每一层li 沿X轴旋转90度到-90度
            * */
            if(Sphere.arr){
                for (var i = 0; i < length; i++) {
                    aLi[i].style.transform = Sphere.arr[i];
                }
            }else {
                Sphere.arr = [];
                var arr = [1,5,7,11,14,16,19,17,13,9,7,5,1], //层数及每层个数
                    arrLen = arr.length,
                    xDeg = 180/(arrLen-1);//每层X轴旋转的度数 第一个不用旋转
                for (i = 0; i < length; i++) {
                    var numLay = 0, // 层数
                        numI = 0; //个数
                    var arrSum = 0;
                    //判断当前li属于哪一层，以及该层中的哪一个
                    for (var j = 0; j < arrLen; j++) {
                        arrSum += arr[j];
                        if(arrSum > i){ //判断i 属于哪一层
                            numLay = j; //j 层
                            numI = arr[j] -(arrSum - i);//li在该层中的位置
                            break;//跳出循环
                        }
                    }
                    var yDeg = 360/arr[numLay];//每层li沿Y 轴旋转的度数
                    var val = "rotateY("+(numI+1.7)*yDeg+"deg) rotateX("+(90-numLay*xDeg)+"deg) translateZ(800px)";
                    Sphere.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }
        
        //Table 元素周期表布局
        function Table() {
            /** 思路：
             *      1、直接把周期表前三行定位固定
             *      2、剩下的依次排列 即可
             * */
            if(Table.arr){
                for (var i = 0; i < length; i++) {
                    aLi[i].style.transform = Table.arr[i];
                }
            }else {
                Table.arr = [];
                var N = Math.ceil(length/18) + 2,// N 行数;向上取整,不足18 也占据一行;+2 是因为Math.ceil(length/18)计算出来的行数把元素周期表的头三行算着一行了
                    midY = N / 2 - 0.5 ,// 中间行 --> 整个布局中心
                    midX = 18 / 2 - 0.5,// 中间列 --> 整个布局中心
                    disX = 160, //水平偏移量
                    disY = 190, //竖直偏移量
                    /* arr = [
                         {x:-midX*disX,y:-midY*disY},
                         {x:midX*disX,y:-midY*disY},
                         {x:-midX*disX,y:(1 - midY)*disY},
                         {x:(1- midX)*disX,y:(1 - midY)*disY},
                         {x:(midX - 5)*disX,y:(1 - midY)*disY},
                         {x:(midX - 4)*disX,y:(1 - midY)*disY},
                         {x:(midX - 3)*disX,y:(1 - midY)*disY},
                         {x:(midX - 2)*disX,y:(1 - midY)*disY},
                         {x:(midX - 1)*disX,y:(1 - midY)*disY},
                         {x:midX*disX,y:(1 - midY)*disY},
                         {x:-midX*disX,y:(2 - midY)*disY},
                         {x:(1- midX)*disX,y:(2 - midY)*disY},
                         {x:(midX - 5)*disX,y:(2 - midY)*disY},
                         {x:(midX - 4)*disX,y:(2 - midY)*disY},
                         {x:(midX - 3)*disX,y:(2 - midY)*disY},
                         {x:(midX - 2)*disX,y:(2 - midY)*disY},
                         {x:(midX - 1)*disX,y:(2 - midY)*disY},
                         {x:midX*disX,y:(2 - midY)*disY}
                     ];   //前18个li 的位置
                 for (var i = 0; i < length; i++) {
                      if(i < 18){
                         aLi[i].style.transform = "translate3D("+arr[i].x+"px,"+arr[i].y+"px,0px)";
                     }else {
                         var X = i%18,
                             Y = Math.floor(i/18) + 2;
                      aLi[i].style.transform = "translate3D("+(X-midX)*+"px,"+(Y-midY)*+"px,0px)";
                     }
                 }
                 */
                    arr = [
                        {x:0,y:0},
                        {x:17,y:0},
                        {x:0,y:1},
                        {x:1,y:1},
                        {x:12,y:1},
                        {x:13,y:1},
                        {x:14,y:1},
                        {x:15,y:1},
                        {x:16,y:1},
                        {x:17,y:1},
                        {x:0,y:2},
                        {x:1,y:2},
                        {x:12,y:2},
                        {x:13,y:2},
                        {x:14,y:2},
                        {x:15,y:2},
                        {x:16,y:2},
                        {x:17,y:2}
                    ];
                for (i = 0; i < length; i++) {
                    var X,Y;
                    if(i < 18){
                        X = arr[i].x;
                        Y = arr[i].y;
                    }else {
                        X = i%18;
                        Y = Math.floor(i/18) + 2;
                    }
                    var val = "translate3D("+(X-midX)*disX+"px,"+(Y-midY)*disY+"px,0px)";
                    Table.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }
    })();
};

/** 打点计时器
 *  var oDiv = document.createElement("div");
 *  oDiv.style.cssText = "background:pink; position:absolute; width:5px; height:5px; border-radius:100%; top:"+e.clientY+"px; left:"+e.clientX+"px;";
 *  document.body.appendChild(oDiv);
 * */

/**  注意：
 *  1、布局方法里面最大的if-else 的作用是阻止重复计算li的坐标
 *  2、Table 布局方式 在Edge 浏览器中 存在点击事件Bug
 *  3、由于li 不是事件源，进行匹配时无法匹配得到，
 *      进行--> 在同一个li上 按下 滑动 抬起 还是会触发点击事件，利用getNode() 函数得以解决
 *  4、弹窗隐藏时缩回对应li 事件未完成 -.-!
 *
 * */

/*
//事件委托优化  太过于繁琐<-.->
function eventDelegate (parentSelector, targetSelector, events, foo) {
    // 触发执行的函数
    function triFunction (e) {
        // 兼容性处理
        var event = e || window.event;
        
        // 获取到目标阶段指向的元素
        var target = event.target || event.srcElement;
        
        // 获取到代理事件的函数
        var currentTarget = event.currentTarget;
        
        // 处理 matches 的兼容性
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }
        
        // 遍历外层并且匹配
        while (target !== currentTarget) {
            // 判断是否匹配到我们所需要的元素上
            if (target.matches(targetSelector)) {
                var sTarget = target;
                // 执行绑定的函数，注意 this
                foo.call(sTarget, Array.prototype.slice.call(arguments))
            }
            
            target = target.parentNode;
        }
    }
    
    // 如果有多个事件的话需要全部一一绑定事件
    events.split('.').forEach(function (evt) {
        // 多个父层元素的话也需要一一绑定
        Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(function ($p) {
            $p.addEventListener(evt, triFunction);
        });
    });
} */
