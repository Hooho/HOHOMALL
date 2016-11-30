//自定义滚动条
var roller = {
	//初始化
	init: function(roll) {
		this.rollCls = roll.rollClass;//滑轮样式
		this.orbitalCls = roll.orbitalClass;//滑轨样式
		this.content = roll.content; //内容
		this.outBox = roll.outBox; //外层盒子
 
		this.createRoller();
		
		var conH = roll.content.height();
		var outH = roll.outBox.outerHeight();
		this.init=true

	},
	//创建滚动条
	createRoller: function() {
		//创建滚轮
		var  that=this;
		var roller = $("<div></div>").addClass(that.rollCls);
		//创建轨道
		var orbital = $("<div></div>").addClass(that.orbitalCls);
		orbital.append(roller);
		that.outBox.append(orbital)
		//调整滚动条
//		this.resizeRoller(roller, orbital, roll);
		this.roller=roller;
		this.orbital=orbital;

	},
	//调整滚动条,添加样式
	resizeRoller: function() {
		var  that=this;
		//滚轮的高度要计算内容高和显示高的比例
		var conH = this.content.outerHeight();
		var outH = this.outBox.outerHeight();
		//内容跟外框的比例==滚动条跟轨道的比例
		var rollRadio = outH * outH / conH;
//		if(conH<outH){
//			this.content.css({
//				"height":outH
//			})
//		}else{
//			this.content.css({
//				"height":"auto"
//			})
//		}
		
		//console.log("高度",conH)
		//设置样式
		this.outBox.css({
			"position":"relative",
			"overflow":"hidden"
		})
		this.content.css({
			"position":"absolute",
			"width":"100%",
			"top": 0
		})
		this.orbital.css({
			"position": "absolute",
			"right": 0,
			"top": 0,
			"overflow": "hidden",
			"height":"100%"
		})
		this.roller.css({
			"position": "absolute",
			"top": 0,
			"width":"100%",
			"height": rollRadio
		})
		if(outH > conH){
			this.content.css({
			"position":"static"
		})
			this.roller.css("display", "none");
		}else{
			this.roller.css("display", "")
		}
		//初始化事件一次
		if(this.init){
			this.clickRoller();//点击
			this.dragRoller();//拖动
			this.rollRoller();//滚动
		}
		//console.log("高度","conH-->"+conH,this.content)
		
	},
	//点击查看
	clickRoller: function() {
		var that = this;
		var rollerH = that.roller.height();
		var orbital = that.roller.parent();
		this.orbital.on("click", function(e) {
			var clickY = e.offsetY;
			//边界值处理
			//判断点击的位置是多大。
			var moveY = (clickY > rollerH) ? clickY - rollerH : clickY
			if(e.target == that.roller[0]) return;
			that.updateContent( moveY)
		})

	},
	//拖动查看
	dragRoller: function() {
		var that = this;
		var orbital = that.roller.parent();
		var orbitalH = that.orbital.height();
		var rollH = that.roller.height()
		
		this.roller.on("mousedown", function(e) {
			//奇怪了，本来我认为这个clickY是相对轨道的，没想到是相对滚轮的
			//而刚好一点击的时候，moveY相对于轨道顶端，clickY相对滚轮，距离就是滚轮距离顶部的距离了。
			//刚点没有移动的时候，moveY-clickY就是滚轮距离上顶部的距离
			//如果clickY不是相对滚轮，那么应该加上已经滚的位置
			e.preventDefault()
			var clickY = e.offsetY;
			//获取已经滚动的距离
			var hasTop = that.roller.position().top;
			//得到滚轮最大的滚动距离
			var maxRH = orbitalH - rollH;
			//console.log(clickY)
			$(document).on("mousemove", function(e) {
				//得到鼠标距离轨道顶部的距离
				var moveY = e.pageY - that.orbital.offset().top;
				//console.log(moveY, clickY)
					//得到鼠标滑动的距离
				moveY = moveY - clickY;
				moveY = moveY < 0 ? 0 : moveY
				moveY = moveY > maxRH ? maxRH : moveY
					//console.log(moveY)
				that.updateContent( moveY)
			})
		})
		$(document).on("mouseup",function(){
			$(document).off("mousemove")
		})

	},
	//滚动查看
	rollRoller: function() {
		var scrollTime = 0;
		var scrollDit = 0;
		//console.log(maxRH,rollH,orbitalH)
		var that = this;
		mouseWheel(that.outBox[0])

		function mouseWheel(dom) {
			//判断什么浏览器
			var mousewheel = navigator.userAgent.indexOf("Firefox") == -1 ? "mousewheel" : "DOMMouseScroll";
			if(document.addEventListener) {
				dom.addEventListener(mousewheel, function(e) {
					//整数向上，负数向下
					//其他的，其他用wheelDelta -+120,
					//其他浏览器竟然往下是负值，我去，跟火狐相反，我只能转为正值在传过去了
					//火狐的，火狐用detail  -+3
					e.preventDefault()
					var scroll = -e.wheelDelta || (e.detail * 40);
					wheelDealFn(scroll)
				})
			} else {
				dom.attachEvent(mousewheel, function(e) {
					e.preventDefault()
					var scroll = e.wheelDelta;
					wheelDealFn(scroll)
				})
			}
		}

		function wheelDealFn(scroll) {
			//获取已经滚动的距离
			///cons
			//放在外面的都是死值
			var orbital = that.roller.parent();
			var orbitalH = that.orbital.height();
			var rollH = that.roller.height()
			//得到滚轮最大的滚动距离
			var maxRH = orbitalH - rollH;
			var hasTop = that.roller.position().top;
			
			//把值变小一点，好计算一次滚动多少，120除以12就是10了
			//如果我是加上已经滚动的高度，是不能累计滚动的
			//如果累计的话，应该保存的是把滚动的高度化成滚动的次数
			//if(obj.drag_length>0){
			//drag_length表示已经滚的距离
				//rolling=obj.drag_length*12;
				//obj.drag_length=-1;
			//}
			//rolling+=(-data);//滚了几次,放在后面，避免了拖动后有一次滚动无效
			//roll_flag=(rolling/12);
			//scrollTime += scroll / 12  
			//console.log(5555,maxRH)
			scrollTime = scroll / 12
				//已经滚动的加上滚的
			scrollDit = scrollTime + hasTop;
			

			//边界值计算
			//还要让滚动值相加停止scrollTime=0,否则scrollTime一直增加和减少导致到头后滚动失灵
			scrollDit = scrollDit < 0 ? (scrollTime = 0, 0) : scrollDit;
			scrollDit = scrollDit > maxRH ? (scrollTime = 0, maxRH) : scrollDit

			that.updateContent(scrollDit)
		}
	},
	//根据滚轮更新显示内容
	updateContent: function(rollTop) {
		//获取应该显示哪一部份内容
		//var maxRH=roller.parent().height()-roller.height();
		//var  scrollH=content.height()*rollTop/maxRH
		//  内容滚动的距离/滚轮滚动的距离=内容高度/显示屏高度
		//内容高度除以显示屏高度===多少条滚动条显示的内容
		//console.log(content.height() / outBox.height())
		//如果盒子高度大于内容高度，不改变
		if(this.content.outerHeight()<this.outBox.outerHeight()){
			return 
		}
		var scrollH = rollTop * this.content.outerHeight() / this.outBox.outerHeight();

		this.content.css("top", -scrollH)
		this.roller.css("top", rollTop)
	}
}