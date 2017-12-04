
function routerConfig($stateProvider,$urlRouterProvider){
	
	$(".hohoMall-body").height($(window).height()-90)

	//滚动条初始化，只用初始化一次
	roller.init({
		rollClass:"roller",
		orbitalClass:"orbital",
		content:$(".hohoMall-inner"),
		outBox:$(".hohoMall-body")
	})

	//窗口改变也相应调整滚动条
	$(window).resize(function(){
		$(".hohoMall-body").height($(window).height()-90)
		roller.resizeRoller()
	})
	//console.log(roller)
		
	$urlRouterProvider.otherwise("/homepage/main");
	
	$stateProvider
	
	//首页
	.state('homepage',{
		url:'/homepage',
		views:{
			'mallCotent':{
				templateUrl:"/template/homepage.html",
				controller:function(){
					
					
					roller.resizeRoller()
				}
			}
		}
	})

	//	首页展示主要内容
	.state('homepage.main',{
		url:'/main',
		views:{
			'homeCenter@homepage':{
				templateUrl:"/template/homeMain.html",
				controller:function($scope,showSearchByName){

					$('.right-nav li').eq(0).trigger("click")

					showSearchByName.getData('',function (result) {
						$scope.newReCommened=result.slice(10,20);
						console.log($scope.newReCommened)

					})
					//$scope.newReCommened=
					$scope.upper1=[{
						'goodName':'羽绒服 加厚款',
						'goodPrice':'499',
						'goodImg':'1-2.jpg'
					},{
						'goodName':'灯芯绒衬衫 西部工装',
						'goodPrice':'184',
						'goodImg':'1-1.jpg'
					}]
					$scope.upper2=[{
						'goodName':'吉国武免烫3.0衬衫',
						'goodPrice':'499',
						'goodImg':'1-3.jpg'
					},{
						'goodName':'针织衫 新品上市',
						'goodPrice':'184',
						'goodImg':'1-4.jpg'
					}]
					$scope.underGood=[{
						'goodName':'休闲裤 成衣染',
						'goodPrice':'184',
						'goodImg':'under1.jpg'
					},{
						'goodName':'休闲裤 全棉直筒',
						'goodPrice':'199.5',
						'goodImg':'under2.jpg'
					},{
						'goodName':'凡客休闲裤 拉绒加厚',
						'goodPrice':'94.5',
						'goodImg':'under3.jpg'
					},{
						'goodName':'弹力修身牛仔裤',
						'goodPrice':'164.5',
						'goodImg':'under4.jpg'
					}]
					$scope.moreGood=['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg']
					roller.resizeRoller()
				}
			}
		}
	})

	//	首页搜索
	.state('homepage.search',{
		url:'/search/:type',
		views:{
			'homeCenter@homepage':{
				templateUrl:"/template/homeSearch.html",
				controller:function(showSearchByType,$stateParams,$scope){

					//console.log($stateParams)

					var currentIndex=sessionStorage.getItem("currentIndex")
					console.log(currentIndex);

					$('.right-nav li').eq(currentIndex).trigger("click")

					showSearchByType.getData($stateParams.type,function (result) {

						$scope.searchData=result;
						//console.log(result)
					})
				}
			}
		}
	})

	//个人页
	.state('personpage',{
		url:'/personpage',
		views:{
			'mallCotent':{
				templateUrl:"/template/personPage.html",
				controller:function(){
					
					
					roller.resizeRoller()
				}
			}
		}
	})

	//查看我所有的宝贝
	.state('personpage.allOrder',{
		url:'/allOrder',
		views:{
			'personRight@personpage':{
				templateUrl:"/template/allOrder.html",
				controller:function(){
					roller.resizeRoller()
				}
			}
		}
	})

	//充值
	.state('personpage.fullMoney',{
		url:'/fullMoney',
		views:{
			'personRight@personpage':{
				templateUrl:"/template/fullMoney.html",
				controller:function(){
					roller.resizeRoller()
				}
			}
		}
	})

	//个人页的收藏
	.state('personpage.collection',{
		url:'/collection',
		views:{
			'personRight@personpage':{
				templateUrl:"/template/collectionPage.html",
				controller:function(){
					roller.resizeRoller()
				}
			}
		}
	})

	//订单页
	.state('orderpage',{
		url:'/orderpage',
		views:{
			'mallCotent':{
				templateUrl:"/template/order.html",
				controller:function($scope,checkNoComOrder){

					//请求当前订单
					checkNoComOrder(function (result) {
						//console.log(result)
						$scope.orderCount=result.length
						$scope.orders=result;
						//$scope.$digest()
					})
				}
			}
		}
	})
	
	//购物车
	.state('shoppingcar',{
		url:'/shoppingcar',
		views:{
			'mallCotent':{
				templateUrl:"/template/shoppingCar.html",
				controller:function($scope,indexDB,$rootScope){
					var userid=$rootScope.userData.userid;
					indexDB({dbName:userid,storeName:'shoppingCar'}, function (store) {


						store.getAll().onsuccess= function () {
							$scope.goodsCar=this.result;
							$scope.$digest()
						}
					})
				}
			}
		}
	})
	
	//搜索页
	.state('searchpage',{
		url:'/searchpage/:condition/:params',
		views:{
			'mallCotent':{
				templateUrl:"/template/searshGood.html",
				controller:function(showSearchByName,$stateParams,showSearchByType,$scope){

						showSearchByName.getData($stateParams.params,function (result) {
							$scope.searchData=result;

							if($scope.searchData.length){
								//搜得到
								$("#searchTip").hide()
							}else{
								//搜不到
								$("#searchTip").show()
							}
						})



				}
			}
		}
	})
	
	//商品详情页,初始化放大镜
	.state('detailGood',{
		url:'/detailGood/:goodid',
		views:{
			'mallCotent':{
				templateUrl:"/template/detailGood.html",
				controller:function(showDetail,$scope,$stateParams){
					//console.log($stateParams);

					showDetail.getData($stateParams.goodid, function (result) {
						$scope.detailGood=result
					})

					magnify.init("slider",'img-B',$(".img-b"))
					console.log(magnify)

				}
			}
		}
	})
	
	//收藏页
	.state('collection',{
		url:'/collection',
		views:{
			'mallCotent':{
				templateUrl:"/template/collectionPage.html",
				controller:function(getCollection,$scope){

					getCollection(function (result) {
						$scope.collections=result
					})
				}
			}
		}
	})
	
	//管理用户页
	.state('userManage',{
		url:'/userManage',
		views:{
			'mallCotent':{
				templateUrl:"/template/userManage.html",
				controller:function(){
					
					
					roller.resizeRoller()
				}
			}
		}
	})
	
	//修改资料页
	.state('modifyData',{
		url:'/modifyData',
		views:{
			'mallCotent':{
				templateUrl:"/template/homepage.html",
				controller:function(){
					
					
					roller.resizeRoller()
					
				}
			}
		}
	})
	
	//发布商品
	.state('publishGood',{
		url:'/publishGood',
		views:{
			'mallCotent':{
				templateUrl:"/template/publishGood.html",
				controller:function(){
					
					
					roller.resizeRoller()
				}
			}
		}
	})
	
	//付款成功
	.state('paySuccess',{
		url:'/paySuccess',
		views:{
			'mallCotent':{
				templateUrl:"/template/paySuccess.html",
				controller:function(){
					
					
					roller.resizeRoller()
				}
			}
		}
	})

	//提交订单
	.state('submitOrder',{
		url:'/submitOrder',
		views:{
			'mallCotent':{
				templateUrl:"/template/submitOrder.html",
				controller:function($scope){
					//console.log(JSON.parse(localStorage.getItem("orderData")))
					$scope.orderGood=JSON.parse(localStorage.getItem("orderData"));
					var  allAccount=0;
					$scope.orderGood.forEach(function (item,index) {
						//只有在详情页添加了数量，才有orderCount这个属性
						//所有如果没有这个属性就默认为1
						var count=parseInt(item.orderCount||1);
						var price=parseInt(item.goodPrice)

						allAccount+=count*price;
					})
					$scope.allAccount=allAccount

				}
			}
		}
	})

	//我的店铺
	.state('myStore',{
		url:'/myStore',
		views:{
			'mallCotent':{
				templateUrl:"/template/myStore.html",
				controller:function($scope	){
					roller.resizeRoller()

				}
			}
		}
	})
	
	
	
}
