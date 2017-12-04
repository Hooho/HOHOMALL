/**
 * Created by 侯小贤 on 2016/11/15.
 */

var  mongoose=require("mongoose")
var  db=require("./db.js");

var orderSchema=new mongoose.Schema({
    buyerId:{type:String},//购买者
    goodId:{type:String},//商品
    publisherId:{type:String},//发布者
    goodCount:{type:Number},//订单数量
    state:{type:Number,default:1},//商品状态，下单还是发货,默认是未付款
    orderDate:{type:Date,default: new Date()}//下单日期
})

//添加订单
orderSchema.statics.addOrder= function (json,callback) {
    this.model("order").create(json, function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result)
    })
}


//查找所有订单
orderSchema.statics.findAllOrder= function (json,callback) {
    this.model("order").find(json).sort({orderDate:-1}).exec( function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}


//查找单个订单
orderSchema.statics.findOneOrder= function (json,callback) {
    this.model("order").findOne(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找订单总数
orderSchema.statics.findOrderCount= function (json,callback) {
    this.model("order").find(json).count().exec(function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//更新订单信息，订单状态
orderSchema.statics.updateOrder= function (json,condition,callback) {
    this.model("order").update(json,condition,function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//删除订单
orderSchema.statics.delOrder= function (json,callback) {
    this.model("order").remove(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result);
    })
}


//orderSchema.statics= function (json,callback) {
//
//}




var orderModel=db.model("order",orderSchema);

module.exports=orderModel