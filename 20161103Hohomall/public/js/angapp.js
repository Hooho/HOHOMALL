

angular.module('app',['ui.router','controller','service','filter','directive'])

.config(routerConfig)

.run(function($rootScope,islogin,$location){


        //每次刷新的时候，都要验证登录
        islogin(function (result) {
            //result是登录用户的数据
            if(result=="-1"){
                //用户没有登录1.头部改一下
                $(".nologinShow").show()
                $location.path("/")

            }else{
                //用户已经登录
                $(".loginShow").show();

                //判断是否是管理员
                if(result.role=="8"){
                    $("#userManage").show()
                    $("#myStore").show()
                    $("#publishGood").show()

                }else if(result.role=="2"){
                    $("#myStore").show()
                    $("#publishGood").show()
                }

                $rootScope.userData=result;

            }
            //console.log(result)

        })

        $rootScope.$on("ngRepeatFinished", function (e) {
            //console.log(e)
            roller.resizeRoller()
        })
        $rootScope.$on('$viewContentLoaded', function(){
           // alert()
        });

        $("#TipsModal").on('hidden.bs.modal', function () {
            location.reload()
        })


        //$rootScope.repeatCount=new Array(3)


    })
