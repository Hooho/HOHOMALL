
var  mongoose=require("mongoose");
var  db=mongoose.createConnection("mongodb://127.0.0.1:27017/mall");

db.once("open", function (callback) {
    console.log("db is success")
})

module.exports=db;
