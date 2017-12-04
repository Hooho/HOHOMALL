/**
 * Created by 侯小贤 on 2016/11/15.
 */

var  mongoose=require("mongoose")
var  db=require("./db.js");

var goodsSchema=new mongoose.Schema({
    goodName:{type:String},//商品名称
    goodPrice:{type:String},//商品价格
    goodCount:{type:String},//商品总量
    goodIntro:{type:String},//商品简介
    goodType:{type:String},//商品类型
    goodColor:{type:Array},//商品颜色
    goodSize:{type:Array},//商品大小
    goodImg:{type:Array},//商品样图
    publisherId:{type:String},//商品发布者id
    saleCount:{type:Number,default:0},//销量
    colletionCount:{type:Number,default:0},//收藏总人数
    publishDate:{type:Date,default: new Date()}//商品发布日期

})

//添加商品
goodsSchema.statics.addGood= function (json,callback) {
    this.model("goods").create(json, function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result)
    })
    
}

//查找单个商品
goodsSchema.statics.findOneGood= function (json,callback) {
    this.model("goods").findOne(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找全部或分类商品
goodsSchema.statics.findAllGood= function (json,callback) {
    this.model("goods").find(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找商品总数
goodsSchema.statics.findGoodsCount= function (json,callback) {
    this.model("goods").find(json).count().exec(function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//更新商品信息，收藏人数，销量
goodsSchema.statics.updateGood= function (json,condition,callback) {
    this.model("goods").update(json,condition,function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//删除商品
goodsSchema.statics.delGood= function (json,callback) {
    this.model("goods").remove(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result);
    })
}


//goodsSchema.statics= function (json,callback) {
//
//}



var goodsModel=db.model("goods",goodsSchema);

module.exports=goodsModel

