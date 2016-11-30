var LoopImages = function(imgArr, container, isLoop) {
	this.ImageArr = imgArr;
	this.container = container;
	this.flag = true;
	this.isLoop = isLoop
	if(isLoop) this.index = 1
	else this.index = 0
}
LoopImages.prototype = {
	//创建轮播图
	createImage: function() {
		var imgarr = this.ImageArr;
		var container = this.container;
		$.each(imgarr, function(index, item) {
			var img = $("<img />").attr('src', item);
			var li=$("<li></li>").append(img)
			container.append(li);
		})
		return this;
	},
	//箭头
	createArrow: function(leftArrow, rightArrow) {
		var that = this;
		this.leftArrow = leftArrow;
		this.rightArrow = rightArrow;
		leftArrow.on("click", function() {
			clearInterval(that.timer)
			that.changeReverse()
			that.timeOut()
		});
		rightArrow.on("click", function() {
			clearInterval(that.timer)
			that.changePositive()
			that.timeOut()
		})
		return this
	},
	//焦点
	createPot: function(pot) {
		var that = this
		var container = this.container;
		var img = container.children();
		var imgWidth = img.eq(0).innerWidth();
		var length = this.ImageArr.length
		this.pot = pot;
		for(var i = 0; i < length + 2; i++) {
			var li = $("<li></li>");
			if(i == 0 || i == length + 1) {
				li.hide()
			}
			if(i == 1) li.addClass("on")
			this.pot.append(li)
		}
		this.pot.children().on("click", function() {
			clearInterval(that.timer)
			that.index = $(this).index()
			that.changeImage()
			that.timeOut()
		})
		return this
	},
	setStyle: function() {
		var container = this.container;
		var img = container.children();
		var imgWidth = img.eq(0).width();
		//console.log(img.eq(0).outerWidth())
		var first = container.children("li").first();
		var last = container.children("li").last();
		var firstClone = first.clone(true);
		var lastClone = last.clone(true);
		first.before(lastClone);
		last.after(firstClone)

		container.css({
			"position": "absolute",
			'left': -imgWidth
		})

		return this
	},
	//正向播放
	changePositive: function() {
		var container = this.container;
		var length = this.ImageArr.length
		if(this.flag) {
			this.index++;
			this.flag = false;
			if(this.index > length) {
				this.index = 1;
				container.css("left", 0)
			}
			this.changeImage()
		}
	},
	//反向播放
	changeReverse: function() {
		var container = this.container;
		var length = this.ImageArr.length
		var img = container.children();
		var imgWidth = img.eq(0).innerWidth();
		if(this.flag) {
			this.index--;
			this.flag = false;
			if(this.index < 1) {
				this.index = length
				container.css("left", -(length + 1) * imgWidth)
			}
			this.changeImage()
		}
	},
	changeImage: function() {
		var that = this;
		var container = this.container;
		var img = container.children();
		var imgWidth = img.eq(0).innerWidth();
		if(this.pot) {
			this.pot.children().eq(this.index).addClass("on").siblings().removeClass("on")
		}
		container.animate({
			left: -this.index * imgWidth
		}, 1000, function() {
			that.flag = true;
		})
	},
	//定时器
	timeOut: function(time) {
		var that = this;
		var time = time || 3000
		this.timer = setInterval(function() {
			that.changePositive();
		}, time)
		return this
	}
}