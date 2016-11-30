var magnify = {

	//初始化
	init: function(sliderClass, bimgClass, wrap) {

		//浏览的图片的容器的大小
		this.wrapH = wrap.height();
		this.wrapW = wrap.width();

		this.createSlider(sliderClass, wrap);
		this.createBimg(bimgClass, wrap);
		this.sliderShow(wrap);
		this.sliderMove(wrap);
	},
	//创建滑块和遮罩层
	createSlider: function(sliderClass, wrap) {

		this.shade = $("<div></div>").appendTo(wrap);

		var slider = this.slider = $("<div></div>").addClass(sliderClass).appendTo(wrap);

		this.sliderH = slider.height();
		this.sliderW = slider.width();

		wrap.parent().css({
				"position": "relative"
			})
			//图片容器
		wrap.css({
				"position": "relative"
			})
			//遮罩层,遮罩层在滑块层上面，不然鼠标移动到滑块上面就没有效果了
		this.shade.css({
				"position": "absolute",
				"top": 0,
				"left": 0,
				"height": "100%",
				"width": "100%",
				"z-index": 2,
				"opactity":'0'
			})
			//滑块
		this.slider.css({
			'position': "absolute",
			"z-index": 1
		}).hide()
	},
	//创建大图容器
	createBimg: function(bimgClass, wrap) {
		var that = this;

		//大图容器
		this.bImg = $("<div></div>").addClass(bimgClass).appendTo(wrap.parent()).hide()
			.css({
				"overflow": "hidden",
				"position": "absolute",
				"z-index": 9999
			});

		//大图
		var img = $("<img />").css("position", "absolute").appendTo(that.bImg)

	},

	//滑块和大图的显示和隐藏
	sliderShow: function(wrap) {
		var slider = this.slider;
		var bImg = this.bImg;

		//移进显示
		wrap.mouseenter(function() {
				slider.show();
				bImg.show()
			})
			//移出隐藏
		wrap.mouseleave(function() {
			slider.hide();
			bImg.hide()
		})

	},

	//滑块移动
	sliderMove: function(wrap) {

		var that = this;

		this.shade.mousemove(function(e) {
			var e = window.event || e;

			//取图片
			var imgsrc = wrap.find("img").attr("src")
			that.bImg.find("img").attr("src", imgsrc)

			//传递位置参数
			that.updatePosition(e.offsetY, e.offsetX)
		})

	},
	//位置更新，滑块，大图
	updatePosition: function(top, left) {

		var sliderH = this.sliderH; //滑块高度
		var sliderW = this.sliderW; //滑块宽度

		var maxY = this.wrapH - sliderH; //纵向最大距离
		var maxX = this.wrapW - sliderW; //横向最大距离

		//鼠标在滑块正中间
		var sliderY = top - sliderH / 2
		var sliderX = left - sliderW / 2

		//边距调整，不能离开四边
		var sliderY = sliderY < 0 ? 0 : sliderY;
		var sliderY = sliderY > maxY ? maxY : sliderY;
		var sliderX = sliderX < 0 ? 0 : sliderX;
		var sliderX = sliderX > maxX ? maxX : sliderX;

		//滑块样式
		this.slider.css({
			"top": sliderY,
			"left": sliderX
		})

		//大图的比例计算
		var xPro = sliderX / maxX;
		var yPro = sliderY / maxY;

		//大图最大的位置
		var bMaxX = this.bImg.find("img").width() - this.bImg.width();
		var bMaxY = this.bImg.find("img").height() - this.bImg.height();

		//大图计算后的位置
		var bImgX = xPro * bMaxX;
		var bImgY = yPro * bMaxY;

		//大图位置更新
		this.bImg.find("img").css({
			"top": -bImgY,
			"left": -bImgX
		})

	}

}