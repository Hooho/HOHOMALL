
angular.module("service",[])

//	图片预览
.factory('previewImg',function(){
	return function(e,img){
			var $file=$(e);
			var fileObj=$file[0];
			var windowURL=window.URL||window.webkitURL;
			var dataURL;
			if(fileObj&&fileObj.files&&fileObj.files[0]){
				dataURL=windowURL.createObjectURL(fileObj.files[0]);
				img.attr("src",dataURL)
				//console.log(111,dataURL)
			}else{
				dataURL=$file.val();
				//console.log(222,dataURL)
				img[0].style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				img[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src=dataURL;
			}
	}
})

//	用户相关-------------------------------------------

//登录
.factory("login",function($http){
	return function(data,callback){
		//var data=$httpParamSerializer(data)
		$http.post("http://localhost:8888/user/login",data,{
			headers:{"Content-Type":"application/x-www-form-urlencoded"}

		}).success(function(result){
			callback(result)
		})
	}
})

//退出登录
.factory("quit",function($http){
	return function(callback){
		//var data=$httpParamSerializer(data)
		$http.get("http://localhost:8888/user/quit").success(function (result) {
			callback(result)
		})
	}
})

//判断是否登录
.factory("islogin",function($http){
	return function(callback){
		$http.get("http://localhost:8888/user/islogin").success(function(result){
			callback(result)
			//console.log(result)
		})
	}
})

//修改名字
.factory('updateUsername',function ($http) {
	return function (username,callback) {
		console.log(username)
		$http.get('http://localhost:8888/user/updateUsername?'+username).success(function (result) {
			//console.log(result)
			callback(result)
		})
	}
})

//修改密码
.factory('updatePassword',function ($http) {
	return function (data,callback) {
		$http.post('http://localhost:8888/user/updatePsd',data,{
			headers:{"Content-Type":"application/x-www-form-urlencoded"}
		}).success(function (result) {
			callback(result)
		})
	}
})

//	商品相关-------------------------------------------

//搜索框
.service('showSearchByName',function($http){

		this.getData= function (condition,callback) {
			
			$http.get("http://localhost:8888/good/searchGoodByName?condition="+condition).success(function (result) {
				callback(result)
			})
		}

})

//	菜单栏点击搜索
.service('showSearchByType',function($http){

	this.getData= function (type,callback) {

		$http.get("http://localhost:8888/good/searchGoodByType?type="+type).success(function (result) {
			callback(result)
		})
	}

})


//商品详情
.service('showDetail',function($http){

	this.getData= function (id, callback) {

		$http.get("http://localhost:8888/good/detailGood?goodId="+id).success(function (result) {
			callback(result)
		})
	}

})

//本地数据库indexedDB,存储购物车信息
.factory('indexDB', function ($rootScope) {
	return function (obj,callback) {
		var indexedDB=window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

		var indexdb=indexedDB.open(obj.dbName);

		indexdb.onupgradeneeded= function () {
			///console.log(123456)
			var db=this.result;
			if(!db.objectStoreNames.contains(obj.storeName)){
				var store=db.createObjectStore(obj.storeName,{
					keyPath:"id",
					autoIncrement: true
				});
				//创建索引
				store.createIndex('goodId','_id',{unique:true})
			}
		}
		indexdb.onsuccess= function () {

			var db=this.result;

			//创建表,不等于-1说明找得到
			//console.log(db.objectStoreNames)

			var tran=db.transaction(obj.storeName,'readwrite');

			var store=tran.objectStore(obj.storeName);

			callback(store)

		}
	}
})

//	添加数量
.factory('CountSelect', function () {
		return function (classname,val,input,count) {

		}
	})

//添加收藏
.factory('collection',function($http){

	return function (id,callback) {
		$http.get("http://localhost:8888/good/collectGood?goodId="+id).success(function (result) {
			callback(result)
		})
	}
})

//获取收藏
.factory('getCollection',function($http){

	return function (callback) {
		$http.get("http://localhost:8888/good/getCollectGood").success(function (result) {
			console.log(result)
			callback(result)
		})
	}
})

//计算总价和总数量
.factory('calAccount', function ($rootScope) {

	return function () {

		//遍历所有的input
		var allCount= 0,allAccount=0;

		var checkbox=$(".shoppingcar").find(".singleCheck");

		//保存所有选中的商品
		$.each(checkbox, function (index,item) {
			if(item.checked){
				var ul =$(item).parents("ul.row");
				var count=parseInt(ul.find(".good-count input").val());
				var price=parseInt(ul.find(".good-price>span").html());

				allCount+=count
				allAccount+=count*price;
			}
		})

		//数量
		//$scope.allAccount=allAccount
		//$scope.allCount=allCount;
		//$scope.$digest()
		$(".count-text").html(allCount)

		//金额
		$(".account-text").html(allAccount)

	}
})


//确认提交订单，增加订单
.factory("comfirmOrder", function ($http) {
	return function (order,orderCount,callback) {

		$http.get('http://localhost:8888/order/addOrder?orders='+order+"&orderCount="+orderCount,{
			headers:{"Content-Type":"application/x-www-form-urlencoded"}
		}).success(function (result) {
			callback(result)
		})

	}
})

//确认支付
.factory("comfirmPay", function ($http) {
	return function (data,callback) {

		$http.post('http://localhost:8888/order/comfirmPay',data,{
			headers:{"Content-Type":"application/x-www-form-urlencoded"}
		}).success(function (result) {
			callback(result)
		})

	}
})

//查看当前未完成订单
.factory('checkNoComOrder', function ($http) {
	return function (callback) {
		$http.get("http://localhost:8888/order/getCurrentOrder")
			.success(function (result) {
				callback(result)
			})
	}
})

//确认收货
.factory('comfirmRecive', function ($http) {
	return function (orderId) {
		$http.get("http://localhost:8888/order/changeOrderState?state=3&orderId="+orderId)
			.success(function (result) {
				//callback(result)
			})
	}
})




