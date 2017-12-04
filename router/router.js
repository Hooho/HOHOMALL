

var  formidable=require("formidable");
var  path=require("path");
var  fs=require("fs");
var  UUID=require("uuid");
var  userService=require("../dao/userService.js")
var  goodsService=require("../dao/goodsService.js")
var  orderService=require("../dao/orderService.js")
var  collectService=require("../dao/collectionService.js")


exports.index= function (req,res,next) {
    res.redirect('index.html')
}

exports.toRegist= function (req,res,next) {
    res.redirect('regist.html')
}
//判断登录
exports.islogin= function (req,res,next) {
    if(req.session.login=="1"){
        var data={
            userid:req.session.userid,
            username:req.session.username,
            avatar:req.session.avatar,
            role:req.session.role,
            money:req.session.money
        }
        res.json(data)

    }else{
        res.send("-1")
    }
}



//用户相关------------------------------------------------------

//注册
exports.regist= function (req,res,next) {
    var form=new formidable.IncomingForm();

    form.parse(req, function (err,field,file) {

        var  username=field.username;
        var  password=field.password;

        //查询有没有重复人名
        userService.findOneUser({username:username}, function (result) {
            if(!result){
                userService.addOneUser(field, function (user) {
                    if(user.username){
                        //注册成功
                        console.log(user)
                        req.session.login="1";
                        req.session.userid=user._id;
                        req.session.username=user.username;
                        req.session.avatar=user.avatar;
                        req.session.money=user.money;
                        req.session.role=user.role;
                        res.send("1")
                    }else{
                        res.send("-2")
                    }
                })
            }else{
                res.send("-1")
            }
        })
    })
}

//登录
exports.login= function (req,res,next) {
    var form=new formidable.IncomingForm();

    form.parse(req, function (err,field,file) {
        //console.log(field)
        var  username=field.username;
        var  password=field.password;

        //查询有没有重复人名
        userService.findOneUser({username:username}, function (user) {
            if(user){
               // console.log(user)
                if(password==user.password){
                    //密码正确
                    req.session.login="1";
                    req.session.userid=user._id;
                    req.session.username=user.username;
                    req.session.avatar=user.avatar;
                    req.session.money=user.money;
                    req.session.role=user.role;
                    res.send("1")
                }else{
                    //密码错误
                    res.send("-1")
                }

            }else{
                //用户不存在
                res.send("-2")
            }
        })
       // console.log(field)
    })
}

//退出登录
exports.quit= function (req,res,next) {
   // console.log(123456)
    req.session.destroy();
    res.send("1")
}

//修改用户名
exports.updateUsername= function (req, res, next) {
    var newusername=req.query.username;
    var oldusername=req.session.username;

    if(newusername!=oldusername){
        console.log(newusername)
        userService.updateUser({username:oldusername},{$set:{username:newusername}}, function (result) {
            if(result.ok=="1"){
                req.session.username=newusername;
                res.send("1")
            }else{
                res.send("-1")
            }
        })
    }else{
        //修改的名字和原名相同
        res.send("-2")
    }
}

//修改密码
exports.updatePsd= function (req, res, next) {

    var form=new formidable.IncomingForm();

    form.parse(req, function (err,field,file) {
        var newPsd=field.password;
        var oldPsd=field.opassword;
        var username=req.session.username;

        userService.findOneUser({username:username}, function (result) {
            //比对密码
            if(result.password==oldPsd){
                userService.updateUser({username:username},{$set:{password:newPsd}}, function (result) {
                    if(result.ok=="1"){
                        //修改成功
                        res.send("1")
                    }else{
                        //修改失败
                        res.send("-2")
                    }
                })
            }else{
                //密码错误
                res.send("-1")
            }
        })

    })



}

//修改头像
exports.updateAvatar= function (req, res, next) {
    var form=new formidable.IncomingForm();

    form.uploadDir=path.normalize(__dirname+"/../avatar/")
    form.parse(req, function (err,field,file) {
        console.log(file)
        //图片存在
        if(file.avatar){
            var imgType=file.avatar.type.slice(6);
            var username=req.session.username;
            var imgName=username+"."+imgType;
            var oldPath=file.avatar.path;
            var newPath=__dirname+"/../avatar/"+imgName;

            fs.rename(oldPath,newPath, function (err) {
                if(err){
                    console.log(175,err);
                    return;
                }
                userService.updateUser({username:req.session.username},{$set:{avatar:imgName}}, function (result) {
                    if(result.ok=="1"){
                        //修改成功
                        req.session.avatar=imgName
                        res.send("1")
                    }else{
                        res.send("-1")
                    }
                })
            })

        }else{
            //没有接收到文件
            res.send("-2")
        }

    })
}


//商品相关---------------------------------------------------------

//发布商品
exports.publishGood= function (req,res,next) {

    var form=new formidable.IncomingForm();



    var good={
        publisherId:req.session.userid,
        goodImg:[]
    };
    if(!good.publisherId){
        res.send("nlogin");
        return ;
    }
    var file=[];
    form.uploadDir=path.normalize(__dirname+"/../goodImg/")


    form.parse(req);
    form.on('err', function (err) {
        console.log(err)
    })
    .on('field', function (field, value) {
        //接受文件以外的数据
        //console.log(field,value)
            if(form.type=="multipart"){

                //第一次进不来，如果是数组，就可以进来，因为子啊
                if(field in good){
                    //创建数组,判断good[field]是不是数组，
                    //如果是数组就进不去
                    if(!Array.isArray(good[field])){
                        //good[field]已经存在，并且是一个字符串
                        good[field]=[good[field]];
                    }
                    good[field].push(value);
                    return ;
                }
            }
        //但是如果已经创建了就不用创建了
        good[field]=value;

    })
    .on("file", function (field,value) {
            //接受文件
            var  imgType=value.type.slice(6);
            var  imgName=UUID.v1()+"."+imgType;//根据随机数给图片命名

            good.goodImg.push(imgName);
            file.push(value)

    })
    .on('end', function () {

        console.log(good)

        //解析完毕
        goodsService.addGood(good, function (result) {

            if(result){
                file.forEach(function (item,index) {
                    var  img=item;
                    var  oldPath=img.path;
                    var  newPath=__dirname+"/../goodImg/"+good['goodImg'][index];

                    //保存至服务器
                    fs.rename(oldPath,newPath, function (err) {
                        if(err){
                            console.log("发布商品240--->"+err)
                            return
                        }
                    })
                })
                res.send("1")
            }else{
                res.send("-3")//发布失败
            }
        })
    })


    //form.parse(req, function (err, field, file) {

        //console.log(good)

        //添加商品
        //goodsService.addGood(good, function (result) {
        //
        //    if(result){
        //        for(var index in file){
        //            var  img=file[index];
        //            var  imgType=img.type.slice(6);
        //            var  imgName=UUID.v1()+"."+imgType;//根据随机数给图片命名
        //            var  oldPath=img.path;
        //            var  newPath=__dirname+"/../goodImg/"+imgName;
        //
        //            //保存至服务器
        //            fs.rename(oldPath,newPath, function (err) {
        //                if(err){
        //                    console.log("发布商品240--->"+err)
        //                    return
        //                }
        //            })
        //        }
        //        res.send("1")
        //    }else{
        //        res.send("-3")//发布失败
        //    }
        //})


    //})
}

//搜索商品
exports.searchGoodByName= function (req,res,next) {

    var name=req.query.name || '.+' ;
    name=new RegExp(name)
    console.log(typeof name,name)
    goodsService.findAllGood({goodName:name}, function (result) {
        res.json(result);
    })
}

//搜索商品通过类型
exports.searchGoodByType= function (req,res,next) {

    var type=req.query.type ;
    //condition=new RegExp(condition)
    //console.log(typeof condition,condition)
    goodsService.findAllGood({goodType:type}, function (result) {
        res.json(result);
    })
}

//商品详情
exports.detailGood= function (req,res,next) {
    var goodid=req.query.goodId
   // console.log("goodid-->",goodid)
    goodsService.findOneGood({_id:goodid}, function (result) {
        res.json(result);
    })
}


//订单相关-------------------------------------------------------

//匹配支付密码,，增加一个销量
exports.comfirmPay= function (req,res,next) {
    var form=new formidable.IncomingForm();

    form.parse(req, function (err,field,file) {
        //console.log(field)
        var  username=req.session.username;
        var  password=field.password;
        var  payMoney=parseInt(field.payMoney);
        var  orderId=field.orderId

        //console.log(field)

        //查询这个人的余额
        userService.findOneUser({username:username}, function (user) {
            if(user){
                // console.log(user)
                if(password==user.password){
                    //密码正确
                    if(user.money>payMoney){
                        var currentMoney=user.money-payMoney
                        //console.log(currentMoney,payMoney,typeof  currentMoney)
                        //减钱
                        userService.updateUser({username:username},{$set:{money:currentMoney}}, function (result) {

                             if(result){
                                //支付成功
                                //更改订单状态
                                req.session.money=currentMoney;
                               orderService.updateOrder({_id:orderId},{$set:{state:2}}, function (order) {


                                  // 增加商品销量
                                   if(order.ok=="1"){
                                       orderService.findOneOrder({_id:orderId}, function (order) {
                                           goodsService.findOneGood({_id:order.goodId}, function (result) {
                                              // console.log(result)
                                               var saleCount=parseInt(result.saleCount)+1;
                                               goodsService.updateGood({_id:order.goodId},{$set:{saleCount:saleCount}}, function () {
                                                   if(result){
                                                       res.send("1")
                                                   }else{
                                                       //支付失败
                                                       res.send("-4")
                                                   }
                                               })
                                           })
                                       })
                                       //console.log(order)
                                   }else{
                                       res.send("-4")
                                   }
                               })

                            }else{
                                //支付失败
                                res.send("-4")
                            }
                        })

                    }else{
                        res.send("-2")
                    }

                }else{
                    //密码错误
                    res.send("-1")
                }
            }else{
                //用户不存在
                res.send("-3")
            }
        })
        // console.log(field)
    })
}

//提交订单，还要减少买家相应的余额
exports.addOrder=function (req,res,next) {


    var  orders=JSON.parse(req.query.orders) ;
    var  orderCount=JSON.parse(req.query.orderCount)


    iteratar(0);


    function iteratar(index){
        if(index==orders.length){
            //提交成功
            res.send("1")

            return ;
        }

        var data={
            goodId:orders[index],
            buyerId:req.session.userid,
            goodCount:orderCount[index]

        }
        goodsService.findOneGood({_id:data.goodId}, function (good) {

            data.publisherId=good.publisherId;

           // console.log(data)
            orderService.addOrder(data, function (order) {
                if(!order){
                    //提交失败
                    res.send("-1")
                }else{
                    iteratar(index+1)
                }

            })

        })

    }


}

//查找个人所有订单
exports.getAllOrder=function (req,res,next) {
    var  userid=req.session.userid;

    orderService.findAllOrder({buyerId:userid}, function (orders) {
        iterator(0);

        function iterator(index) {

            if (index == orders.length) {
                res.json(result);
                return;
            }
            //单个订单
            var order=orders[index]._doc;
            var goodId=order.goodId;
            //为单个订单添加商品信息
            goodsService.findOneGood({_id:goodId}, function (good) {
                order.good=good
            })
        }
    })
}

//查找个人未完成订单，未付款，未发货，未收货的
exports.getCurrentOrder=function (req,res,next) {
    var  userid=req.session.userid;

    orderService.findAllOrder({buyerId:userid,state:{$nin:4}}, function (orders) {
        iterator(0);

        //console.log(1111,orders)
        function iterator(index) {

            if (index == orders.length) {
                res.send(orders);
                return;
            }
            //单个订单
            var order=orders[index]._doc;
            var goodId=order.goodId;
            //为单个订单添加商品信息
            goodsService.findOneGood({_id:goodId}, function (good) {
                order.good=good
                iterator(index+1);

            })
        }
    })
}

//更新订单状态，发货,收货，当买家收货，卖家可以相应的增加余额
exports.changeOrderState=function (req,res,next) {
    var  userid=req.session.userid;
    var  orderId=req.query.orderId
    var  state=req.query.state;

    orderService.updateOrder({_id:orderId},{$set:{state:state}}, function (result) {
        if(result){
            //更新成功
            res.send("1")
        }else{
            //更新失败
            res.send("-1")
        }
    })
}

//查找我所有接的订单（作为卖家)
exports.getAllReceiveOrder=function (req,res,next) {
    var  publisherId=req.session.userid;

    //找到所有订单中，是我发布的商品的
    orderService.findAllOrder({publisherId:publisherId}, function (orders) {
        iterator(0);

        function iterator(index) {

            if (index == orders.length) {
                res.json(orders);
                return;
            }
            //单个订单
            var order=orders[index]._doc;
            var goodId=order.goodId;
            //为单个订单添加商品信息
            goodsService.findOneGood({_id:goodId}, function (good) {
                order.good=good
            })
        }
    })
}

//查找我所有接的订单没有处理的订单，已经付款了的（作为卖家)
exports.getNoDealReceiveOrder=function (req,res,next) {
    var  publisherId=req.session.userid;

    //找到所有订单中，是我发布的商品的
    orderService.findAllOrder({publisherId:publisherId,state:{$nin:4}}, function (orders) {
        iterator(0);

        function iterator(index) {

            if (index == orders.length) {
                res.json(orders);
                return;
            }
            //单个订单
            var order=orders[index]._doc;
            var goodId=order.goodId;
            //为单个订单添加商品信息
            goodsService.findOneGood({_id:goodId}, function (good) {
                order.good=good
            })
        }
    })
}



//收藏相关----------------------------------------------------------------

//添加收藏
exports.collectGood= function (req,res,next) {


    var data={
        goodId:req.query.goodId,
        collecterId:req.session.userid
    }

    goodsService.findOneGood({_id:data.goodId}, function (result) {
        data.publisherId=result.publisherId;

        var  collectCount=parseInt(result.colletionCount);

        //console.log(data)
        //还要判断是否收藏过

        collectService.findOneColletion(data, function (result) {


            //console.log(111,result)
            if(!result){
                collectService.addColletion(data, function (result) {
                    console.log(222,result)
                    if(result){
                        //给商品更新收藏人数
                        goodsService.updateGood({_id:data.goodId},{$set:{colletionCount:++collectCount}}, function (ud) {
                            res.json(result);

                        })

                    }else{
                        res.send("-2")
                    }

                })
            }else{
                res.send("ced")
            }
        })

    })



}

//获取收藏
exports.getCollectGood= function (req,res,next) {

    var  userid=req.session.userid;

    if(!userid){
        res.send("nlogin")
        return ;
    }

    collectService.findAllColletion({collecterId:userid}, function (result) {

        iterator(0);

        function iterator(index){

            if(index==result.length){
                res.json(result)
                return ;
            }


            var collection=result[index]._doc;
            var goodId=collection.goodId

            goodsService.findOneGood({_id:goodId}, function (good) {

                collection.good=good
                iterator(index+1)
            })

        }

    })

}

















