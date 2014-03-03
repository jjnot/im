/**
 * Created by fiffy on 14-3-3.
 */
(function(window,$){
    function NetworkModule(){
        var _this=this;
        _this.init();
        return _this;
    }
    NetworkModule.prototype.init=function(){
        var _this=this;
        _this.selfEmail=window.localStorage.getItem("email");

    };

    NetworkModule.prototype.requestFriendsList=function(){
        var _this=this;
        $.ajax({
            type: "POST",
            //TODO 修改URL
            url: "/im/code_fontpage_moblie/friendList.json",
            data:{
                myemail:_this.selfEmail
            },
            success: function (data) {
                //初始化数据模型
                DataModule.addFriendsData(data);
                //DOM构建好友列表
                DomModule.addItemToFriendsList(data);
                //隐藏初始化消息
                UiFrame.hideAlert();
            },
            error:function(e){
                UiFrame.alert("网络链接错误,添加好友失败。");
            }

        });
    };

    NetworkModule.prototype.addFriends=function(targetEmail){
        //添加好友请求
        //参数为目标邮箱
        var _this=this;
        $.ajax({
            type: "POST",
            url: "/addfriend",

            data:{
                myemail:_this.selfEmail,
                youremail:targetEmail
            },
            success: function (data) {
                if(data.response.username==""||null||undefined){
                    //未找到目标好友
                    UiFrame.alert("未找到邮箱为"+targetEmail+"的目标好友")
                }else{
                    DataModule.addFriendsData(data);
                    DomModule.addItemToFriendsList(data);
                    UiFrame.alert("好友添加成功")
                }

            },
            error:function(e){
                UiFrame.alert("网络链接错误,添加好友失败。");
            }

        });
    };

    NetworkModule.prototype.deleteFriend=function(targetEmail){
        //删除好友请求
        var _this=this;
        $.ajax({
            type: "POST",
            url: "/deletefriend",
            data:{
                myemail:_this.selfEmail,
                youremail:targetEmail
            },
            success: function (data) {
                DataModule.removeFriendData(targetEmail);
                DomModule.removeFriend(targetEmail);
                if(DataModule.hasTalking(targetEmail)){
                    DataModule.removeTalkingFriend(targetEmail);
                    DomModule.removeTalking(targetEmail);
                }
            },
            error:function(e){
                UiFrame.alert("网络链接错误,删除好友失败。");
            }

        });


    };

    NetworkModule.prototype.getOnlineList=function(){
        //获取在线好友
        $.ajax({
            type: "POST",
            url: "/getOnlineList",
            data:{
                email:_this.selfEmail
            },
            success: function (data) {
            },
            error:function(e){
                UiFrame.alert("网络链接错误,无法获取在线用户列表");
            }

        });
    };

    NetworkModule.prototype.changeUserInform=function(name,signature){
        $.ajax({
            type: "POST",
            url: "/modify",

            data:{
                email:_this.selfEmail,
                username:name,
                signature:signature
            },success:function(data){
                window.localStorage.setItem('username',name);
                window.localStorage.setItem('signature',signature);
                UiFrame.alert("个人资料修改成功");
            } });
    };


    if(!window.NetworkModule){
        window.NetworkModule=new NetworkModule();
    }

})(window,Zepto);