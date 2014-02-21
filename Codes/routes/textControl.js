var textmodel=require('./textModel');

    //event={fromemail:xxxx,toemail:xxxx,message:xxx,time:xxxx}
//fromsocket是谁发送的信息
//tosocket 是信息发送给谁
//首先判断tosocket是否为空来判断对方是否在线，如果在线调用storeMessage,否则调用storeOfflineMessage
//如果对方在线，使用tosocket发送text信息
exports.textMessage=function(event,fromsocket,tosocket){

    if(tosocket){
        textmodel.storeMessage(event.fromemail,event.toemail,event.message,event.time);
        tosocket.emit('text',event);
    }
    else {
        textmodel.storeOfflineMessage(event.message,event.fromemail,event.toemail,event.time);
    }

	}

//获取属于自己的离线消息
//调用textmodel.getOfflineMessage(myemail,success,fail);
//函数的作用域在于它的定义域而不是调用域
//成功socket发送offline消息,在success函数里面调用
//失败什么都不做


exports.getMyOfflineMessage=function(myemail,socket){
	var myemail=myemail;
    textmodel.getOfflineMessage(myemail,function(array){
    socket.emit('offline',array);
    } ,function(array){

    console.log('get offline message failed!');

    })
	
	}


//调用textmodel.getChatRecord_model(myemail,fromemail,success,fail)
exports.getChatRecord_control=function(myemail,fromemail,mysocket){
    textmodel.getChatRecord_model(mymail,fromemail,function(array){
        mysocket.emit('chatrecord',array);
    },function(){
        console.log('get chat record failed!');
    })



}