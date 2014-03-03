
(function(window,$){
    function DomModule(){
        var _this=this;
        this.init();
        return _this;
    }
    DomModule.prototype.init=function(){
        var _this=this;
        _this.config={};
        _this.config.baseHeadUrl=document.location.href.replace(/index\.html.*/,'')+'image/head/';
        _this.config.headFileType='.jpg';
        _this.domList={"friendList":$("#friendListUl"),
            "talkingList":$("#takingListUl"),
            'sessionList':$("#sessionListUl"),
            'talkingTarget':$("#talkingTarget")
        };
        _this.listData={
            'friendListCount':1,
            'takingListCount':0

        };
        _this.DomTemplate={
            'friendList':'<li class="friendListLi">'+
                            '<img class="headPhoto" src="{@headSrc}" />'+
                            '<h1>{@userNick}</h1>'+
                            '<div class="signature">{@signature}</div>'+
                            '<div class="deleteIcon"></div>'+
                            '<div class="emailHidden">{@UserEmail}</div>'+
                         '</li>',
            'talkingList':'<li class="friendListLi">'+
                                '<img class="headPhoto" src="{@headSrc}" />'+
                                '<h1>{@userNick}</h1>'+
                                '<div class="alertNumber hidden">0</div>'+
                                '<div class="emailHidden">{@UserEmail}</div>'+
                          '</li>',
            'sessionList':'<li>'+
                                '<div class="headTd">'+
                                    '<img class="headPhotoforTalking" src="{@headSrc}">'+
                                '</div>'+
                                '<div class="SessionContent">'+
                                      '<span class="username">{@userNick}</span>'+
                                      '<div class="bubbleSan"></div>'+
                                      '<div class="bubbleWord">{@dialogContent}</div>'+
                                '</div>'+
                           '</li>'
        }
    };
    DomModule.prototype.addItemToFriendsList=function(userData){
        //将好友插入好友列表
        //数据为数组格式 username email signature
        var _this=this;
        var listUl=_this.domList.friendList;
        if(!userData.length){
            userData=[userData];
        }
        for(var list_item=0;list_item<userData.length;list_item++){
            itemHTML=_this.DomTemplate.friendList
                .replace(/{@headSrc}/,_this.config.baseHeadUrl+userData[list_item].email+_this.config.headFileType)
                .replace(/{@userNick}/,userData[list_item].username)
                .replace(/{@UserEmail}/,userData[list_item].email)
                .replace(/{@signature}/,userData[list_item].signature);
            var newItem=$(itemHTML);
            //绑定事件
            newItem.on('click',function(){
                MainControl.clickFriendItem($(this));
            });
            newItem.appendTo(listUl);
            _this.listData.friendListCount++;
        }
        MainControl.refreshScroll("taking_wrapper");
    };
    DomModule.prototype.addItemToTalkingList=function(userData){
        //向列表添加项
        //数据为数组格式 username email
        var _this=this;
        var listUl=_this.domList.talkingList;
        if(!userData.length){
            userData=[userData];
        }
        for(var list_item=0;list_item<userData.length;list_item++){
            itemHTML=_this.DomTemplate.talkingList
                .replace(/{@headSrc}/,_this.config.baseHeadUrl+userData[list_item].email+_this.config.headFileType)
                .replace(/{@userNick}/,userData[list_item].username)
                .replace(/{@UserEmail}/,userData[list_item].email);
            var newItem=$(itemHTML);
            if(_this.listData.takingListCount>0){
                newItem.insertBefore(listUl.children('li').eq(0));
            }else{
                newItem.appendTo(listUl);
            }
            //绑定事件
            newItem.on('click',function(){
                MainControl.clickFriendItem($(this));

            });
            _this.listData.takingListCount++;
        }
        MainControl.refreshScroll("friend_wrapper");
    };
    DomModule.prototype.addSentenceToSession=function(dialogData){
        //向对话列表中添加对话
        //数据为数组格式 username message fromSelf email
        var _this=this;
        var listUl=_this.domList.sessionList;
        if(!dialogData.length){
            dialogData=[dialogData];
        }
        for(var list_item=0;list_item<dialogData.length;list_item++){
            itemHTML=_this.DomTemplate.sessionList
                .replace(/{@userNick}/,dialogData[list_item].username)
                .replace(/{@dialogContent}/,dialogData[list_item].message)
                .replace(/{@headSrc}/,_this.config.baseHeadUrl+dialogData[list_item].email+_this.config.headFileType);
            var newItem=$(itemHTML);
            if(dialogData[list_item].fromSelf==true){
                newItem.addClass('mySession');
            }
            newItem.appendTo(listUl);
        }
        //位移和刷新
        MainControl.refreshScroll("taking_wrapper");
    };
    DomModule.prototype.initTalkingPage=function(email,dialogData){
        //切到目标页面的dom
        var _this=this;
        var userInfo=DataModule.getUserInfo(email);
        _this.domList.talkingTarget.text(userInfo.username);
        _this.domList.sessionList.innerHTML="";
        if(dialogData.length>0){
            _this.addSentenceToSession(dialogData);
        }

    };

    DomModule.prototype.addTalkingCount=function(data){
        //增加用户的消息提示数量
        //数据为{email:...,countIndex:...}
        var _this=this;
        var target=_this.findItemFromList(data,'talkingList');
        var listUl=_this.domList.talkingList;
        var Num=target.children('.alertNumber');
        Num.text(Number(Num.text())+1);
        if(_this.listData.takingListCount>1){
            //列表中大于一项，应提升
            target.remove();
            target.insertBefore(listUl.children('li').eq(0));
        }

    };

    DomModule.prototype.resetTalkingCount=function(data){
        //清空用户的消息提示数量
        //数据为{email:...,countIndex:...}
        var _this=this;
        var target=_this.findItemFromList(data,'talkingList');
        var Num=target.children('.alertNumber');
        Num.text(0);
        if(!Num.hasClass("hidden")){
            Num.addClass("hidden");
        }
    };
    DomModule.prototype.removeFriend=function(targetEmail){
        var _this=this;
        _this.removeItemFromList({email:targetEmail},"friendList");
    };
    DomModule.prototype.removeTalking=function(targetEmail){
        var _this=this;
        _this.removeItemFromList({email:targetEmail},"talkingList");
    };
    DomModule.prototype.removeItemFromList=function(data,targetList){
        //s移除项
        //数据为{email:...,countIndex:...}
        var _this=this;
        var target=_this.findItemFromList(data,targetList);
        target.remove();
    };

    DomModule.prototype.findItemFromList=function(data,targetList){
        //寻找列表中的目标项
        //数据为{email:...,countIndex:...}
        var _this=this;
        var listUl=_this.domList[targetList];
        var target;
        if(data.email){
            // 根据email来寻找
            var items=listUl.find('.emailHidden');
            items.forEach(
                function(item){
                    if(item.innerText==data.email){
                        target=$(item).parent();
                    }
                }
            )
        }else if(data.countIndex){
            //根据下标来找
            target=listUl.children('li').eq(data.countIndex);
        }
        return target;
    };
    if(!window.DomModule){
        window.DomModule=new DomModule();
    }


})(window,Zepto);