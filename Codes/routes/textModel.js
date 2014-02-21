var text = require('../models/text');

var chatRec=text.chatRec;
var offMsg=text.offMsg;
var sysMsg=text.sysMsg;

//往数据库存入一条聊天记录
exports.storeMessage=function(fromemail,toemail,message,time){
    console.log(fromemail+' '+toemail+' '+message+' '+time);
    var newRec =new chatRec();
    newRec.fromEmail=fromemail;
    newRec.toEmail=toemail;
    newRec.message=message;
    newRec.time=time;
    console.log("storeMessage ");
    chatRec.create(newRec,function(err){
        console.log(err);
        return !err;
    })
	
	}
	
	

//离线缓存记录,当发送给不在线的好友的时候，这个集合与上面那个集合不是同一个
exports.storeOfflineMessage=function(message,fromemail,toemail,time){
    var newOff =new offMsg();
    newOff.fromEmail=fromemail;
    newOff.toEmail=toemail;
    newOff.message=message;
    newOff.time=time;
    text.offMsg.create(newOff,function(err){
            return !err;
    })
	
	}
	
	
//获取离线的信息
//success函数的形式像这样，array是该函数进行数据库读取并处理得到的数组
//function success(array){}
//
exports.getOfflineMessage=function(myemail,success,fail){
    offMsg.find({toEmail:myemail}).sort({_id:1}).exec(function(err,offArray){
        if(err) {fail()}
        else {
            offMsg.remove({toEmail:myemail},function (err) {if(err) {fail()}});
            success(offArray);
//            offArray.remove({},function (err) {});
//            offArray.save();
        }
    });

	}


//获取聊天记录
//其中success(array),fail是两个函数
//array: [{fromemail:xxxmessage:xxxxx,time:xxxx},{………...} ]
exports.getChatRecord_model=function(myemail,fromemail,success,fail){
    chatRec.find({"$or":[{toEmail:myemail},{fromEmail:myemail}]}).sort({_id:1}).exec(function(err,offArray){
        if(err) {fail()}
        else {success(offArray)}
    });

}

//再加一个集合存离线系统信息
//顺便保存时间
//youremail不在线的那个
//该信息再加一个字域type：addfriend
//根据type来判别是添加还是删除。（“add”或者“delete” 用别的也是可以的。）
exports.addFriendRemind_model=function(youremail,myemail,time,type){
//    console.log(youremail+' '+myemail+' '+time+' '+type);
    var newSys =new sysMsg();
    newSys.yourEmail=youremail;
    newSys.myEmail=myemail;
    newSys.type=type;
    newSys.time=time;
    console.log("storeSystemMessage ");
    sysMsg.create(newSys,function(err){
        console.log(err);
        return !err;
    })
}

//取得系统消息的，名字要根据你们使用改，youremail是需要接收消息的那一个人的；
// 然后取得的array需要通过type来判别是添加还是删除.
exports.getFriendRemind_model=function(youremail,success,fail){
    sysMsg.find({yourEmail:youremail}).sort({_id:1}).exec(function(err,sysArray){
        if(err) {fail()}
        else {
            sysMsg.remove({yourEmail:youremail},function (err) {if(err) {fail()}});
            success(sysArray);
        }
    });
}

//exports.deleteFriendRemind_model=function(youremail,myemail,time,type){
//    var newSys =new sysMsg();
//    newSys.yourEmail=youremail;
//    newSys.myEmail=myemail;
//    newSys.type=type;
//    newSys.time=time;
//    console.log("storeSystemMessage ");
//    sysMsg.create(newSys,function(err){
//        console.log(err);
//        return !err;
//    })
//}