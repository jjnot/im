function NetWorkModel(){}


NetWorkModel.prototype.addFriends=function(targetEmail){
    var tempthis=this;
    $.ajax({
        type: "POST",
        url: "/addfriend",
        data:{myemail:mainWindowControl.selfEmail,
            youremail:targetEmail
        },
        success: function (data) {
            tempthis.addFriendsResponse(data);
        },
        error:function(e){
            uiControl.showAlertMsg("网络链接错误,添加好友失败。");

        }

    });


};

NetWorkModel.prototype.deleteFriend=function(targetEmail){
    var tempthis=this;
    $.ajax({
        type: "POST",
        url: "/deletefriend",
        data:{myemail:mainWindowControl.selfEmail,
            youremail:targetEmail
        },
        success: function (data) {
            tempthis.deleteFriendResponse(data);
            mainWindowControl.resetDeleteArray(targetEmail);
        },
        error:function(e){
            uiControl.showAlertMsg("网络链接错误,删除好友失败。");
            mainWindowControl.resetDeleteArray(targetEmail);

        }

    });


};


NetWorkModel.prototype.createGroup=function(list){
    uiControl.showWaitingMsg("正请求创建群聊");
    list.unshift(mainWindowControl.selfEmail);
    $.ajax({
        type: "POST",
        url: "/createRoom",
        data:{
            email:list
        },
        success: function (data) {
            var openfun=function(){
                window.open('/GroupTalking?id='+data.id)
            };
            uiControl.hideWaitingMsg();
            uiControl.showAlertMsg("创建群聊成功成功",openfun);
        },
        error:function(e){
            uiControl.hideWaitingMsg();
            uiControl.showAlertMsg("网络链接错误,创建群聊天失败");
        }

    });
};


NetWorkModel.prototype.getOnlineList=function(){
    $.ajax({
        type: "POST",
        url: "/getOnlineList",
        data:{
            email:mainWindowControl.selfEmail
        },
        success: function (data) {
            uiControl.constructGroupCreateList(data);
        },
        error:function(e){
            uiControl.hideCreateGroupList(0);
            uiControl.showAlertMsg("网络链接错误,无法获取在线用户列表,创建群聊天失败");
        }

    });
};

NetWorkModel.prototype.deleteFriendResponse=function(response){
    uiControl.showOkMsg("删除好友"+response.username+"成功");
    mainWindowControl.deleteFriendFromFriendList(response.email);
};

NetWorkModel.prototype.addFriendsResponse=function(response){
      if(response.username==""||response.username==null||response.username==undefined){
                uiControl.showAlertMsg("没有找到邮箱为 "+response.email+" 的目标好友")
        }
            else{
                uiControl.showOkMsg("添加好友"+response.email+"成功");
                mainWindowControl.addUserToFriendList(response.email,response.username,response.signature);
            }
};


NetWorkModel.prototype.requestVideoChat=function(){
    //请求视频聊天
    console.log(mainWindowControl.selfName);
    socket.emit('wantedvideochat',{
        username:mainWindowControl.selfName,
        fromemail:mainWindowControl.selfEmail,
        toemail:mainWindowControl.talkingTarget
    });
    //将身份设置成call端
    videoControl.setStatusCall();
};

NetWorkModel.prototype.sendVideoReady=function(){
    socket.emit('videoChatReady',{
        fromemail:mainWindowControl.selfEmail,
        toemail:mainWindowControl.talkingTarget
    });
};


NetWorkModel.prototype.acceptVideoChat=function(acceptTarget){
    console.log(acceptTarget);
    socket.emit('acceptvideochat',{
        fromemail:mainWindowControl.selfEmail,
        toemail:acceptTarget,
        handle:1
    });
};
NetWorkModel.prototype.refuseVideoChat=function(){
    socket.emit('acceptvideochat',{
        fromemail:mainWindowControl.selfEmail,
        toemail:acceptTarget,
        handle:0
    });
    uiControl.hideAcceptMsg();
};

NetWorkModel.prototype.changeUserInform=function(name,signature){
    $.ajax({
        type: "POST",
        url: "/modify",

        data:{
            email:mainWindowControl.selfEmail,
            username:name,
            signature:signature
        },success:function(data){
            window.localStorage.setItem('username',name);
            window.localStorage.setItem('signature',signature);
        } });
};