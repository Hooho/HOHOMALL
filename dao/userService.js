

var  mongoose=require("mongoose")
var  db=require("./db.js");

var userSchema=new mongoose.Schema({
    username:{type:String},//用户名
    password:{type:String},//密码
    avatar:{type:String,default:"male.png"},//头像
    role:{type:Number,default:1},//角色，管理员，卖家，买家
    registerDate:{type:Date,default: new Date()},//注册日期
    money:{type:Number,default:1000}//用户金额
})


//插入用户
userSchema.statics.addOneUser= function (json, callback) {
    this.model("user").create(json, function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result)
    })
}

//查找单个用户
userSchema.statics.findOneUser= function (json, callback) {
    this.model("user").findOne(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//查找所有用户
userSchema.statics.findUserCount= function ( callback) {
    this.model("user").find({}, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}


//查找用户总数
userSchema.statics.findUserCount= function (callback) {
    this.model("user").find({}).count().exec(function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}



//更新用户,密码，用户名，余额，角色
userSchema.statics.updateUser= function (json,condition, callback) {
    this.model("user").update(json,condition,function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result)
    })
}

//删除用户
userSchema.statics.delOneUser= function (json,callback) {
    this.model("user").remove(json, function (err,result) {
        if(err){
            console.log(err);
            return
        }
        callback(result);
    })
}




var userModel=db.model("user",userSchema);

module.exports=userModel
