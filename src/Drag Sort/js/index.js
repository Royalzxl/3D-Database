$(function () { //这种写法是 当DOM加载完成后，执行其中的函数。
    //存储对象位置坐标信息 函数
    function Pointer(x,y) {
        this.x = x;
        this.y = y;
    }
    //存储对象定位数值
    function Position(left,top) {
        this.left = left;
        this.top = top;
    }
    //遍历所有item
    $("#content .item").each(function (i) {
        /** 初始化方法
         *      由于item的父元素li为浮动布局，所以item也为浮动布局
         *      而浮动布局后的位置是不会改变的，所以将item的布局方式改为定位布局
         *      以便于后面修改相应的位置信息
         */
        this.init = function () { //面向对象写法
            this.fatherSet = $(this).parent(); //存储每一个item的父元素li   -.-
            this.moving = false; // 表 图片移动
            $(this).attr("index",i).css({ // attr("index",i) 自定义设置一个序列号 index 属性  i 值
                position: "absolute",
                left:this.fatherSet.offset().left,
                top:this.fatherSet.offset().top
            }).appendTo("#content");
            this.drag();
        };
        // 拖拽事件
        this.drag = function () {
            var oldPointer = new Pointer();
            var oldPosition = new Position();
            var currentItem = null;//表示元素
            var isDrag = false;//表 是否拖拽
            $(this).mousedown(function (e) {
                e = e||window.event;
                e.preventDefault();//阻止默认事件
                oldPointer.x = e.clientX;
                oldPointer.y = e.clientY;
                oldPosition.left = $(this).position().left;
                oldPosition.top = $(this).position().top;
                isDrag = true;
                currentItem = this;
            });
            $(document).mousemove(function (e) {
                e = e || window.event;
                var currentPointer = new Pointer(e.clientX,e.clientY);
                if(!isDrag) return false;
                $(currentItem).css({
                    "opacity":0.8,
                    "z-index":9999
                });
                var _Left = currentPointer.x - oldPointer.x + oldPosition.left;
                var _Top = currentPointer.y - oldPointer.y + oldPosition.top;
                $(currentItem).css({
                    left:_Left,
                    top:_Top
                });
                currentItem.pointer = currentPointer;//自定义属性 存储当前坐标值
                currentItem.collisionChick();
            });
            $(document).mouseup(function () {
                if(!isDrag) return;
                isDrag = false;
                currentItem.move(function () {
                    $(this).css({
                        "opacity":1,
                        "z-index":0
                    });
                    $("#content .item").each(function () {
                        this.moving = false;
                    });
                });
            });
        };
        //碰撞检测
        this.collisionChick = function () {
            var currentItem = this;
            var direction = null; //方向
            $(this).siblings(".item").each(function () {
                if(
                    currentItem.pointer.x > this.fatherSet.offset().left &&
                    currentItem.pointer.y > this.fatherSet.offset().top &&
                    (currentItem.pointer.x < this.fatherSet.offset().left + this.fatherSet.width()) &&
                    (currentItem.pointer.y < this.fatherSet.offset().top + this.fatherSet.height())
                ){
                    //返回碰撞成功后的元素和方向
                    if(currentItem.fatherSet.offset().top < this.fatherSet.offset().top){
                        direction = "down";
                    }else if(currentItem.fatherSet.offset().top > this.fatherSet.offset().top){
                        direction = "up";
                    }else {
                        direction = "normal";
                    }
                    //交换
                    this.swap(currentItem,direction);
                }
            })
        };
        //交换位置
        this.swap = function (currentItem,direction) {
            if(this.moving)return false;
            var directions = {
                normal: function () {
                    var saveFather = this.fatherSet;
                    this.fatherSet = currentItem.fatherSet;
                    currentItem.fatherSet = saveFather;
                    this.move();
                    $(this).attr("index",this.fatherSet.index());
                    $(currentItem).attr("index",currentItem.fatherSet.index());
                },
                up: function () {
                    var Father = this.fatherSet;
                    var Node = this;
                    var StartIndex = Node.fatherSet.index();
                    var EndIndex = currentItem.fatherSet.index();
                    for (var i = StartIndex; i < EndIndex; i++) {
                        var nextNode = $('.item[index='+(i+1)+']')[0];
                        Node.fatherSet = nextNode.fatherSet;
                        $(Node).attr("index", Node.fatherSet.index());
                        Node.move();
                        Node = nextNode;
                    }
                    currentItem.fatherSet = Father;
                    $(currentItem).attr("index", Father.index()) ;
                },
                down: function () {
                    var Father = this.fatherSet;
                    var Node = this;
                    var StartIndex = currentItem.fatherSet.index();
                    var EndIndex = Node.fatherSet.index();
                    for (var i = EndIndex; i > StartIndex; i--) {
                        var prevNode = $('.item[index='+(i-1)+']')[0];
                        Node.fatherSet = prevNode.fatherSet;
                        $(Node).attr("index", Node.fatherSet.index());
                        Node.move();
                        Node = prevNode;
                    }
                    currentItem.fatherSet = Father;
                    $(currentItem).attr("index", Father.index()) ;
                }
            };
            directions[direction].call(this);
        };
        //移动图片
        this.move = function (callback) {
            this.moving = true;
            $(this).stop().animate({
                left:this.fatherSet.offset().left,
                top:this.fatherSet.offset().top
            },500, function () {
                callback && callback.call(this);
            })
        };
        this.init();
    })
});
