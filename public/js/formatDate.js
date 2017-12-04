
//时间格式化
function FormatDate (date) {
    var date=new Date(date)
    return date.toLocaleDateString()+" "+date.toLocaleTimeString();
}