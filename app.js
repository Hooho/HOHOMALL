var express = require("express");
var app = express();
var cookieParser = require("cookie-parser")
var session = require("express-session");
var hbs = require("hbs");

var routers = require("./router/router.js")

//设置session
app.use(cookieParser())

//使用session
app.use(session({
	name: 'hohoID',
	secret: 'keyboard cat',
	maxAge: 1000,
	resave: true, //每次请求是否重写设置一份新的session
	saveUninitialized: false //无论有没有session cookie，每次请求都设置个session cookie
}))

//设置静态资源

app.use(express.static('public'));
app.use(express.static('avatar'));
app.use(express.static('views'));
app.use(express.static('goodImg'))

//设置路由

app.all("*", function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	next()
})
app.get("/", routers.index);
app.get("/regist", routers.toRegist);

//用户相关--------------------------------------------------------

//判断登录
app.get("/user/islogin", routers.islogin)

//注册
app.post("/user/regist", routers.regist)

//登录
app.post("/user/login", routers.login)

//退出登录
app.get("/user/quit", routers.quit)

//更新用户名
app.get('/user/updateUsername', routers.updateUsername)

//更新密码
app.post("/user/updatePsd", routers.updatePsd)

//更新头像
app.post("/user/updateAvatar", routers.updateAvatar)

//商品相关--------------------------------------------------------

//发布商品
app.post("/good/publishGood", routers.publishGood)

//搜索商品通过名字
app.get("/good/searchGoodByName", routers.searchGoodByName)

//搜索商品通过类型
app.get("/good/searchGoodByType", routers.searchGoodByType)

//商品详情
app.get("/good/detailGood", routers.detailGood)

//订单相关--------------------------------------------------------

//确认支付
app.post("/order/comfirmPay", routers.comfirmPay)

//提交订单
app.get("/order/addOrder", routers.addOrder)

//查看所有历史记录订单
app.get("/order/getAllOrder", routers.getAllOrder)

//查看所有当前订单，未完成
app.get("/order/getCurrentOrder", routers.getCurrentOrder)

//更新订单状态
app.get("/order/changeOrderState", routers.changeOrderState)

//查看卖家所有的接单历史记录
app.get("/order/getAllReceiveOrder", routers.getAllReceiveOrder)

//查看卖家所有没有处理的单子
app.get("/order/getNoDealReceiveOrder", routers.getNoDealReceiveOrder)

//收藏相关--------------------------------------------------------

//添加收藏
app.get("/good/collectGood", routers.collectGood)

//获取收藏
app.get("/good/getCollectGood", routers.getCollectGood)

app.listen(8888)