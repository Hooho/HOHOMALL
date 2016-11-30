/**
 * Created by 侯小贤 on 2016/11/15.
 */

var  mongoose=require("mongoose")
var  db=require("./db.js");

var collectSchema=new mongoose.Schema({
    collecterId:{type:String},//收藏者
    publisherId:{type:String},//发布者
    goodId:{type:String},//商品
    collectionDate:{type:Date,default: new Date()}//收藏日期
})



//添加收藏
collectSchema.statics.addColletion= function (json,callback) {
    this.model("collection").create(json, function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result)
    })
}


//查找所有收藏
collectSchema.statics.findOneColletion= function (json,callback) {
    this.model("collection").findOne(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找所有收藏
collectSchema.statics.findAllColletion= function (json,callback) {
    this.model("collection").find(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找收藏总数
collectSchema.statics.findColletionCount= function (json,callback) {
    this.model("collection").find(json).count().exec(function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//删除收藏
collectSchema.statics.delColletion= function (json,callback) {
    this.model("collection").remove(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result);
    })
}


//collectSchema.statics= function (json,callback) {
//
//}

var collectModel=db.model("collection",collectSchema);

module.exports=collectModel