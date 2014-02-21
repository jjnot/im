/**
 * Created by nzbnizebin on 13-11-30.
 */

socket.on('text',function(event){
     var inform=mainWindowControl.getInformByEmail(event.fromemail);
         mainWindowControl.receiveMessage(event.fromemail,event.time,event.message,inform.sign,inform.userCalled);
    console.log("receive messsage");
});

socket.on('offline',function(event){
    for(var i=0;i<event.length;i++){
        var inform=mainWindowControl.getInformByEmail(event[i].fromEmail);
        mainWindowControl.receiveMessage(event[i].fromEmail,event[i].time,event[i].message,inform.sign,inform.userCalled);
    }

});


socket.on('wantedvideochat',function(data){
    console.log("接收到是否想要视频的请求");
    uiControl.showAcceptMsg("好友"+data.username+"请求与你视频，是否接受呢？",
        function(){
            console.log(data);
            videoControl.acceptVideoChat(data.fromemail);
            uiControl.hideAcceptMsg();
        }
        ,netWorkModel.refuseVideoChat);
});


socket.on('acceptvideochat',function(data){
    console.log("响应是否接受聊天");
    if(data.handle==1){
        console.log("对方同意视频聊天");
        videoControl.doGetUserMedia();
    }
    else{
        //对方拒绝视频聊天
        uiControl.showAlertMsg("对方拒绝与你视频聊天")
    }

});

socket.on('videoChatReady',function(data){
    //双方视频准备完成，可以开始视频聊天了，现在是接受方
    videoControl.doCall();
});




socket.on('candidate', function (message){
    var msg = message;
    var candidate = new RTCIceCandidate({sdpMLineIndex:msg.label,
        candidate:msg.candidate});
    videoControl.pc.addIceCandidate(candidate);
});

socket.on('sdp', function (message){
    //发送人响应
    if(videoControl.status==0){
        videoControl.pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    }
    else{
        //接收人响应
        videoControl.pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
        videoControl.pc.createAnswer(function(sessionDescription){
            videoControl.setLocalAndSendMessage(sessionDescription);
        });
    }
});

socket.on("system",function(message){
    if(message.handle==1){
        //接收到添加好友的消息
        console.log('添加好友请求');
        uiControl.showAlertMsg("用户"+message.username+"("+message.email+")添加您为好友");
        mainWindowControl.addUserToFriendList(message.email,message.username,message.signature);
    }
    if(message.handle==2){
        //接收到删除好友的消息
        uiControl.showAlertMsg("用户"+message.username+"("+message.email+")把您从好友列表中移除了");
        mainWindowControl.deleteFriendFromFriendList(message.email);
    }
    if(message.handle==3){
        //接收到申请多人聊天的消息

            uiControl.showAcceptMsg("用户"+message.username+"邀请你加入多人聊天，是否接受？",
                function(){
                    //接受
                    uiControl.hideAcceptMsg();
                    window.open('/GroupTalking?id='+message.id);
                },
                function(){
                    uiControl.hideAcceptMsg();
                }
            )



    }
});

socket.on('videoclose',function(data){

            $("#videoWrapper").fadeOut(200);

})