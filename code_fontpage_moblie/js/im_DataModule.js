/**
 * Created by fiffy on 14-3-3.
 */
(function(){

    function DataModule(){
        var _this=this;
        this.init();
        return _this;
    }


    DataModule.prototype.init=function(){
        var _this=this;
        _this.friendIndex=0;
        _this.friendData={};
        _this.talkingList={};
        _this.selfInfom={
            selfEmail:window.localStorage.getItem("email"),
            selfNick:window.localStorage.getItem("username"),
            signature:window.localStorage.getItem("signature")
        }

    };

    DataModule.prototype.addFriendsData=function(userData){
        //构建好友列表数据模型
        //像好友数据模型中添加用户
        //数据为数组格式  username email signature
        var _this=this;
        if(!userData.length){
            //防止非数组格式数据报错
            userData=[userData];
        }
        for(var i=0;i<userData.length;i++){
            var email=userData[i].email;
            if(!_this.friendData[email]){
                _this.friendData[email]=userData[i];
                _this.friendData[email].index=_this.friendIndex;
                _this.friendIndex++;
            }
        }
    };
    DataModule.prototype.removeFriendData=function(email){
        var _this=this;
        if(_this.friendData[email]){
            delete _this.friendData[email];
        }
    };
    DataModule.prototype.hasTalking=function(email){
        var _this=this;
        if(_this.talkingList[email]){
            return true;
        }
        return false;
    };

    DataModule.prototype.addTalkingFriend=function(userData){
        var _this=this;
        if(!userData.length){
            //防止非数组格式数据报错
            userData=[userData];
        }
        for(var i=0;i<userData.length;i++){
            var email=userData[i].email;
            if(!_this.talkingList[email]){
                _this.talkingList[email]=_this.friendData[email];
            }
        }
    };
    DataModule.prototype.removeTalkingFriend=function(email){
        var _this=this;
        if(_this.friendData[email]){
            delete _this.friendData[email];
        }
    };


    DataModule.prototype.addMessage=function(dialogData){
        var _this=this;

        if(!dialogData.length){
            dialogData=[dialogData];
        }
        for(var i=0;i<dialogData.length;i++){
            var email=dialogData[i].email;
            if(!_this.talkingList[email]){
                _this.addTalkingFriend({
                    email:email
                });
            }
            if(!_this.talkingList[email].diaolog){
                _this.talkingList[email].diaolog=[];
                _this.talkingList[email].diaologCount=0;
                _this.talkingList[email].readCount=0;
            }
            //将收到会话内容插入
            _this.talkingList[email].diaolog[_this.talkingList[email].diaologCount]=dialogData[i];
            _this.talkingList[email].diaologCount++;
        }
    };

    DataModule.prototype.addImmediateDialog=function(dialogData){
        if(!dialogData.length){
            dialogData=[dialogData];
        }
        this.addMessage(dialogData);
        _this.talkingList[email].readCount+=(dialogData.length+1);

    };

    DataModule.prototype.getUnreadMsg=function(email){
        //读取信息
        var _this=this;
        var msg=[];
        for(var i=_this.talkingList[email].readCount;i<_this.talkingList[email].diaologCount;i++){
            var count=i-_this.talkingList[email].readCount;
            msg[count]=_this.talkingList.diaolog[i];
        }
        //已读标志后移
        _this.talkingList[email].readCount= _this.talkingList[email].diaologCount;
        return msg;
    };
    DataModule.prototype.getUnreadCount=function(email){
        return this.talkingList[email].diaologCount-this.talkingList[email].readCount;
    };

    DataModule.prototype.getUserInfo=function(email){
        return this.friendData[email];
    };






    if(!window.DataModule){
        window.DataModule=new DataModule();
    }

})();
