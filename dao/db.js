

// 连接数据库
var  mongoose=require("mongoose");
var  db=mongoose.createConnection("mongodb://127.0.0.1:27017/mall");

db.once("open", function (callback) {
    console.log("\n\n\n db is success\n\n\n\n")
})

module.exports=db;
