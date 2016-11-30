
angular.module("filter",[])


//    格式化颜色
.filter('colorTran', function () {
    return function (val) {

        switch (val){
            case "c1":
                return '红色 '
                break;
            case "c2":
                return '黑色  '
                break;
            case "c3":
                return '蓝色 '
                break;
            case "c4":
                return '白色 '
                break;
            case "c5":
                return '绿色 '
                break;
        }
    }
})

//    格式化大小
.filter('sizeTran', function () {
    return function (val) {

        switch (val){

            case 's1':
                return 'L '
                break;
            case 's2':
                return 'M '
                break;
            case 's3':
                return 'S'
                break;

        }

    }
})

//    计算单件商品的总额
.filter('caluteAccount', function () {
        return function (val) {

            //console.log(val)

            var price=parseInt(val.goodPrice);
            //默认为一件
            var count=parseInt(val.orderCount)||1;

            return price*count
        }
    })

//计算余额是否足够支付
.filter('calRemainMoney', function () {
    return function (val) {
        var remainMoney=parseInt(val[0]);
        var payMoney=parseInt(val[1])
        if(remainMoney>payMoney){
            return "余额充足"
        }else{
            return "余额不足"
        }
    }
})

///时间格式化
.filter('formatDate', function () {
        return function (date) {
            var date=new Date(date)
            return date.toLocaleDateString()+" "+date.toLocaleTimeString();
        }
    })

///判断是否有商品
.filter('hasGood', function () {
    return function (val) {
        console.log(val)

        if(val){
            return ''

        }else{
            return 'false'
        }


    }
})

//订单状态判断
.filter('orderState', function () {
    return function (state) {
       // console.log(state)
        switch (state){
            case 1:

                return "去付款"

                break;

            case 2:
                return "确认收货"
                break;
            case 3:

                return "立即评价"
                break;

        }
    }
})

//不同状态添加不同的样式
.filter('orderClass', function () {
    return function (state) {
        // console.log(state)
        switch (state){
            case 1:

                return "btn-success"

                break;

            case 2:
                return "btn-warning"
                break;
            case 3:

                return "btn-primary"
                break;

        }
    }
})