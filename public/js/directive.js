
angular.module("directive",[])

//	总布局相关------------------------------------

//左栏菜单的显示和隐藏
.directive('leftMenuCtl',function(){
	return {
		link:function(scope,ele,attr){
			ele.click(function(){
				if($(".navRightMenu").hasClass("open")){
					$(".navRightMenu").removeClass("open")
				}else{
					$(".navRightMenu").addClass("open")
				}
			})
			$(".navRightMenu .hohoicon-left-arrow").click(function(){
				$(".navRightMenu").removeClass("open")
			})
//			$(document).off("click").on("click",function(e){
//				if($(e.target).parents(".navRightMenu ").length||$(e.target).hasClass("navRightMenu")||$(e.target).attr("left-menu-ctl")){
//					return
//				}
//				$(".navRightMenu").removeClass("open")
//			})
		}
	}
})

//轮播图
.directive('loopTurn',function(){
	return {
		link:function(scope,ele,attr){
			var imgarr=['/img/turn/1.jpg','/img/turn/2.jpg','/img/turn/3.jpg','/img/turn/4.jpg','/img/turn/5.jpg']
			
			var loop=new LoopImages(imgarr,$(".home-turn .imgList"),true)
			loop.createImage().createPot($(".slidePot")).createArrow($(".leftArrow"),$(".rightArrow")).setStyle().timeOut()
			
		}
	}
})


//	用户相关--------------------------------

//登录
.directive("submitBtn", function (login) {
	return {
		link:function(scope,ele,attr){
			var form=ele.parents("#loginform");
			var alertP=ele.parents(".modal").find(".alert");
			ele.click(function () {
				login(form.serialize(),function(result){
					if(result=="1"){
						location.reload()
					}else if(result=="-1"){
						alertP.css("display","inline").html("密码错误")
					}else if(result=="-2"){
						alertP.css("display","inline").html("用户不存在")

					}
					//console.log(result)
				})
			})
			ele.parents(".modal").find("input").focus(function () {
				alertP.hide()
			})
		}
	}
})

//退出登录
.directive("quit",function (quit,$location,$state) {
	return {
		link: function (scope,ele,attr) {
			ele.click(function () {
				quit(function (result) {
					if(result=="1"){
						//$state.go('homepage',{},{reload:true});
						//scope.$digest()
						location.reload()
						$location.path("/")
					}

				})
			})
		}
	}
})

//修改用户名
.directive("updateUsername", function (updateUsername) {
	return{
		link: function (scope,ele,attr) {
			var  form=ele.parents(".modal").find("form");
			var  alertP=ele.parents(".modal").find(".alert");

			ele.click(function () {
				//alert()
				updateUsername(form.serialize(), function (result) {
					//console.log(result)
					if(result=="1"){
						location.reload()
					}else if(result=="-1"){
						alertP.css("display","inline").html("用户不存在")
					}else if(result=="-2"){
						alertP.css("display","inline").html("根本没改，确定个毛")

					}
				})
			})
			ele.parents(".modal").find("input").focus(function () {
				alertP.hide()
			})

		}
	}
})

//修改密码
.directive("updatePsd", function (updatePassword) {
	return{
		link: function (scope,ele,attr) {
			var  form=ele.parents(".modal").find("form");
			var alertP=ele.parents(".modal").find(".alert");
			ele.click(function () {
				updatePassword(form.serialize(), function (result) {
					if(result=="1"){
						location.reload()
					}else if(result=="-1"){
						alertP.css("display","inline").html("原密码错误")
					}else if(result=="-2"){
						alertP.css("display","inline").html("修改失败")

					}
				})

			})
			ele.parents(".modal").find("input").focus(function () {
				alertP.hide()
			})
		}
	}
})

//修改头像
.directive("updateAvatar", function () {
	return{
		link: function (scope,ele,attr) {
			var  form=ele.parents(".modal").find("form");
			var alertP=ele.parents(".modal").find(".alert");
			ele.click(function () {

				form.ajaxSubmit({
					type:"POST",
					url:'http://localhost:8888/user/updateAvatar',
					success: function (result) {
						if(result=="1"){

							location.reload()

						}else if(result=="-1"){
							alertP.css("display","inline").html("上传失败")


						}else if(result=="-2"){
							alertP.css("display","inline").html("没有接收到文件")

						}
					}
				})

			})
			ele.parents(".modal").find("input").focus(function () {
				alertP.hide()
			})
		}
	}
})

//头像图片预览
.directive("fileAvatar",function(previewImg){
		return {
			link:function(scope,ele,attr){
				ele.change(function(e){
					var avatorimg=$(this).siblings().find(".avapreview").show().find("img");
					previewImg(this,avatorimg)
				})
			}
		}
	})


//	商品有关---------------------------------------------------

//搜索框搜索
.directive('searchBtn',function($state,$rootScope){
		return {
			link:function(scope,ele,attr){
				ele.click(function(){

					var condition=$("#searchGood").val()
					$state.go("searchpage",{
						condition:'name',
						params:condition
					},{reload:true})

				})
			}
		}
	})

//菜单栏搜索
.directive('searchNav',function($rootScope,showSearchByType,$state){
		return {
			link:function(scope,ele,attr){
				ele.click(function(){


					var index=$(this).index()

					sessionStorage.setItem('currentIndex',index)
					$(this).addClass("active").siblings().removeClass("active");


				})
			}
		}
	})


//商品样图预览
.directive('addImg', function (previewImg) {
	return {
		link: function (scope,ele,attr) {
			var list=ele.parent();
			var oldname=ele.children("input").attr("name");
			ele.children("input").change(function(e){
				var listL=list.children(".fileIMG").length
				var lilength=$(this).parents("form").find(".avapreview").children("li").length
				//创建预览图片
				var goodimg=$("<img />");
				var li=$("<li></li>").append(goodimg);
				$(this).parents("form").find(".avapreview").show().append(li);
				previewImg(this,goodimg)

				//大于五张图片就移除最后一个input框
				//因为这个chagne事件是要选择文件之后才触发的
				//所以放在创建预览图片之后，克隆文件框之前
				if(lilength>=4) {
					list.children(".fileIMG").last().remove()
					list.hide()
					e.preventDefault()//阻止默认事件
					return ;
				}
				var cloneinput=$(this).parent(".fileIMG").clone(true)
				var newinput=cloneinput.children("input").attr("name",oldname+listL);
				list.append(cloneinput)
				$(this).parent(".fileIMG").hide()
			})
		}
	}
})

//发布商品
.directive("pbgood", function () {
	return {
		link: function (scope,ele,attr) {
			ele.submit(function () {
//				ele.find("input[type='submit']").attr("disabled")
				console.log(ele.serialize())
				ele.ajaxSubmit({
					type:"POST",
					url:'http://localhost:8888/good/publishGood',
					success: function (result) {
						var content=$("#TipsModal").find(".tipsContent")
						if(result=="nlogin"){
							
							location.reload()
							$location.path("/")
						}else if(result=="1"){
							content.html("发布成功")
							
						}else if(result=="-3"){
							//发布失败
							content.html("发布失败")
						}
						$("#TipsModal").modal('toggle')
						$("#TipsModal").on("hidden.bs.modal", function () {
							location.reload()
						})
						//console.log(result)
					}
				})
			})
		}
	}
})

//视图数据渲染完毕
.directive("onFinishRender", function ($timeout) {
	return {
		link: function (scope,ele,attr) {
			if(scope.$last===true){
				$timeout(function () {
					scope.$emit('ngRepeatFinished')
				})
			}
		}
	}
})
	
//商品详情大图预览
.directive("imgChange", function ($timeout) {
	return {
		link: function (scope,ele,attr) {
			ele.find(".img-s").on("mouseenter","li", function () {

				var imgsrc=$(this).find("img").attr("src");
				ele.find(".img-b img").attr("src",imgsrc)
				$(this).addClass("select").siblings().removeClass("select")
			})
		}
	}
})

//添加进购物车
.directive("addShoppingCar", function ($rootScope,indexDB) {
		return {
			link: function (scope,ele,attr) {
				ele.click(function () {
					//用户的id
					if(!$rootScope.userData){
						$("#loginModal").modal('show')
						return ;
					}
					var userid=$rootScope.userData.userid;

					//商品的信息
					var good=scope.detailGood
					//利用本地数据库搞事情
					//因为只能建一次表，我不能给每个用户动态创建一张表了的，但是我可以给用户创建一个数据库哈哈哈
					//你咬我啊，总是有办法的
					indexDB({dbName:userid,storeName:'shoppingCar'}, function (store) {

						var index=store.index('goodId');

						index.get(good._id).onsuccess=function(){
							var content=$("#TipsModal").find(".tipsContent")
							//已经收藏过了
							//console.log(this.result)
							if(this.result){
								content.html("你已经添加过该商品")
							}else{
								store.put(good)
								content.html("添加成功")
							}
							$("#TipsModal").modal('toggle')
						}

					})
				})
			}
		}
	})

//	商品类型选择
.directive('goodTypeSelect', function () {
	return {
		link: function (scope,ele,atr) {
			ele.on("click","li", function () {
				$(this).addClass("on").siblings().removeClass("on")

			})
		}
	}
})

//	数量选择
.directive('goodCountSelect', function (indexDB,$rootScope,calAccount,$location) {
		return {
			link: function (scope,ele,attr) {
				var input=ele.find("input");

				ele.on("click",'.input-group-addon', function () {

					var classname=this.className;
					var val=parseInt(input.val());
					var count=parseInt(attr.goodCountSelect);

					//数量加减
					if(classname.indexOf("good-plus")!=-1){
						val++;
						if(val>count) return

						input.val(val);
					}else{
						val--;
						if(val<1) return
						input.val(val);
					}

					//console.log($location.path().indexOf("shoppingcar")!=-1)
					//购物车页
					if($location.path().indexOf("shoppingcar")!=-1){
						calAccount()
						var price=attr.price;
						var accout=ele.siblings(".good-account");
						accout.find("span").html(price*val);

						var userid=$rootScope.userData.userid;
						var goods=scope.goodsCar;//所有商品
						var good;//存储单件商品的所有信息
						var goodid=ele.parents("ul.row").attr("goodid");//增加数量的那件商品


						//遍历那件商品，取出所有信息，保存进本地数据库
						goods.forEach(function (item,index) {
							if(item._id==goodid){
								good=item
							}
						})

						//更新购物车购买的数量
						good.orderCount=val;

						indexDB({dbName:userid,storeName:'shoppingCar'}, function (store) {

							store.put(good)

						})

					}

					//商品详情页
					if($location.path().indexOf("detailGood")!=-1){
						var good=scope.detailGood
						good.orderCount=val
						scope.detailGood=good
						//console.log(scope.detailGood)
						scope.$digest()
					}
				})
			}
		}
})
	
	
//从购物车删除
.directive('delFormCar', function (indexDB,$rootScope,$state) {
	return {
		link: function (scope, ele, attr) {
			ele.click(function () {
				var goodid=attr.delFormCar;
				var userid=$rootScope.userData.userid;
				indexDB({dbName:userid,storeName:'shoppingCar'},function(store){

					var index=store.index('goodId');
					index.get(goodid).onsuccess= function () {
						store.delete(this.result.id).onsuccess= function () {
							//console.log(this.result)
							var content=$("#TipsModal").find(".tipsContent");
							content.html("删除成功")
							$("#TipsModal").modal('toggle')
						}
					}

				})
				//console.log(goodid)
			})

		}
	}
})

//	全选
.directive('allCheck', function (indexDB,$rootScope,$state,calAccount) {
	return {
		link: function (scope, ele, attr) {
			ele.click(function () {
				var checked=!$(this).attr("checked")
				//console.log(checked)

				$(".shoppingcar").find("input[type='checkbox']")
					.attr("checked",checked).prop("checked",checked)

				calAccount()



			})

		}
	}
})

//	单选
.directive('singleCheck', function (indexDB,$rootScope,$state,calAccount) {
	return {
		link: function (scope, ele, attr) {
			ele.click(function () {

				//点击前的值,但是我给他转化了，变成了点击后的值
				var checked=$(this).prop("checked")


				//console.log(checked)


				calAccount()




			})

		}
	}
})

//	批量删除
.directive('massDel', function (indexDB,$rootScope,$state) {
	return {
		link: function (scope, ele, attr) {
			ele.click(function () {

				var delArr=[]
				var userid=$rootScope.userData.userid;

				var checkbox=$(".shoppingcar").find(".singleCheck");
				//console.log(checkbox)
				
				$.each(checkbox, function (index,item) {
					if(item.checked){
						delArr.push($(item).parents("ul.row").attr("goodid"))
					}
					//console.log(item.checked)
				})
				if(!delArr.length){
					var content=$("#TipsModal").find(".tipsContent");
					content.html("请至少选择一件商品")
					$("#TipsModal").modal('toggle')
					return
				}

				indexDB({dbName:userid,storeName:'shoppingCar'}, function (store) {


					iteratar(0)

					function iteratar(a){

						if(a==delArr.length){
							var content=$("#TipsModal").find(".tipsContent");
							content.html("删除成功")
							$("#TipsModal").modal('toggle')

							return;
						}
						var  goodid=delArr[a];
						var index=store.index('goodId');
						index.get(goodid).onsuccess= function () {
							store.delete(this.result.id).onsuccess= function () {
								//console.log(111,this.result)
								iteratar(a+1)

							}
						}
					}

				})

				//console.log(delArr)


			})

		}
	}
})


//	订单相关------------------------------------------------------------------

//立即购买
.directive('buyOnce', function ($rootScope,$location,$state) {
		return {
			link: function (scope,ele,attr) {
				ele.click(function(){
					if(!$rootScope.userData){
						$("#loginModal").modal('show')

					}else{
						var good=JSON.stringify([scope.detailGood]);
						localStorage.setItem('orderData',good)
						//console.log(scope.detailGood)
						$state.go('submitOrder',{})

					}
				})
			}
		}
	})

//添加收藏
.directive('collect', function ($rootScope,collection) {
	return {
		link: function (scope,ele,attr) {
			ele.click(function(){
				if(!$rootScope.userData){
					$("#loginModal").modal('show')
					return
				}
				var goodid=scope.detailGood._id;
				//console.log(goodid)
				collection(goodid, function (result) {
					var content=$("#TipsModal").find(".tipsContent");
					//console.log(result)
					if(result=="-2"){
						content.html("收藏失败")

					}else if(result=="ced"){
						content.html("你已经收藏过啦")

					}else {
						content.html("收藏成功")
					}
					$("#TipsModal").modal('toggle')
				})
			})
		}
	}
})

//结算
.directive("closeAccouts", function ($rootScope,$state,indexDB) {
	return {
		link: function (scope,ele,attr) {

			ele.click(function () {

				if(!$rootScope.userData){
					$("#loginModal").modal('show')

				}else{

					var buyArr=[]
					var userid=$rootScope.userData.userid;

					var checkbox=$(".shoppingcar").find(".singleCheck");
					//console.log(checkbox)

					$.each(checkbox, function (index,item) {
						if(item.checked){
							buyArr.push($(item).parents("ul.row").attr("goodid"))
						}
					})
					//console.log(buyArr)

					if(!buyArr.length){
						var content=$("#TipsModal").find(".tipsContent");
						content.html("请至少选择一件商品")
						$("#TipsModal").modal('toggle')
						return
					}

					indexDB({dbName:userid,storeName:'shoppingCar'}, function (store) {

						var goods=[]
						iteratar(0)

						function iteratar(a){

							if(a==buyArr.length){
								var good=JSON.stringify(goods);
								localStorage.setItem('orderData',good)
								$state.go('submitOrder',{})

								return;
							}
							var  goodid=buyArr[a];
							var index=store.index('goodId');
							index.get(goodid).onsuccess= function () {
								goods.push(this.result)
								iteratar(a+1)
							}
						}

					})


				}

			})

		}
	}
})


//在订单页删除订单
.directive('delOrder', function ($rootScope,$state) {
	return {
		link: function (scope,ele,attr) {
			ele.click(function () {
				var goodid=$(this).closest("li.row").attr("goodid");
				var goods=JSON.parse(localStorage.getItem("orderData"));
				goods.forEach(function (item, index) {
					if(item._id==goodid){

						goods.splice(index,1)
					}
				})
				goods=JSON.stringify(goods);
				localStorage.setItem("orderData",goods);
				$("#TipsModal").find(".tipsContent").html("删除成功");
				$("#TipsModal").modal("toggle")
				//location.reload()


			})
		}
	}
})


//确认提交订单
.directive("submitOrder", function (comfirmOrder,$timeout) {
	return {
		link: function (scope,ele,attr) {

			ele.click(function () {
				//当前所有订单信息，但是我只要商品id
				var  orders=[];
				var  ordersCount=[];
				scope.orderGood.forEach(function (item,index) {
					orders.push(item._id);
					ordersCount.push(item.orderCount||1)
				})
				orders=JSON.stringify(orders)
				ordersCount=JSON.stringify(ordersCount)
				comfirmOrder(orders,ordersCount, function (result) {
					var content=$("#orderSuccessModal").find(".tipsContent");
					if(result=="1"){
						//	提交成功
						content.html("提交订单成功")

					}else{
						//	提交失败
						content.html("提交订单失败")
					}
					$("#orderSuccessModal").modal('toggle')

				})

				//$("#payModal").modal();

			})
		}
	}
})

//	订单成功跳转到订单页
.directive('orderSuccess', function ($state) {
	return {
		link: function (scope,ele,attr) {
			ele.click(function () {
				$state.go('orderpage',{})
			})
		}
	}
})
	
//确认支付
.directive('comfirmPay', function (comfirmPay,$state,$rootScope) {
		return {
			link: function (scope,ele,attr) {
				var  form=ele.parents(".modal").find("form");
				var alertP=ele.parents(".modal").find(".alert");
				ele.click(function () {

					console.log($rootScope.currentAccount)

					//在前台检测到余额不足，就不让他提交
					if(scope.userData.money<parseInt($rootScope.currentAccount)){
						alertP.css("display","inline").html("余额不足，请充值")
						return
					}
					//确认支付密码
					comfirmPay(form.serialize(), function (result) {
						if(result=="1"){
							//支付成功
							$("#payModal").modal("toggle")
							$state.go('paySuccess',null,{reload:true})
						}else if(result=="-1"){
							//密码错误
							alertP.css("display","inline").html("密码错误")
						}else if(result=="-2"){
							//余额不足
							alertP.css("display","inline").html("余额不足，请充值")
						}
					})
					
				})
			}
		}
	})

//订单处理，收货，付款，评价
.directive('dealOrder', function ($rootScope,comfirmRecive) {
		return {
			link: function (scope,ele,attr) {
				ele.click(function () {
					var val=$(this).html()
					var account=$(this).parents(".order-single").find(".account span").html()
					var orderId=$(this).parents(".order-single").attr("orderid")

					switch (val){
						case "去付款":
							$("#payModal input[name='payMoney']").val(account)
							$("#payModal input[name='orderId']").val(orderId)

							$("#payModal h3 span").html(account)

							//$rootScope.currentAccount=account

							$("#payModal").modal();

							break;

						case "确认收货":
							comfirmRecive(orderId);

							break;

						case "立即评价":

							break;

					}

				})
			}
		}
	})





