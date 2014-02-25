


(function(window,$){
    function DomModule(){
        var _this=this;
        this.init();
        return _this;
    }
    DomModule.prototype.init=function(){
        var _this=this;
        _this.config={};
        _this.config.baseHeadUrl=document.location.href.replace(/index.html/,'')+'image/';
        _this.config.headFileType='.jpg';
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
                                '<div class="alertNumber" >1</div>'+
                                '<div class="emailHidden">{@UserEmail}</div>'+
                          '</li>'
        }
    };
    DomModule.prototype.constructFriendsList=function(userData){
        //将好友插入好友列表
        //数据为数组格式
        var listUl=$("#friendListUl");
        var _this=this;
        for(var list_item=0;list_item<userData.length;list_item++){
            itemHTML=_this.DomTemplate.friendList.replace(/{@headSrc}/,_this.config.baseHeadUrl+userData[list_item].email+_this.config.headFileType)
                .replace(/{@userNick}/,userData[list_item].username)
                .replace(/@emailHidden/,userData[list_item].email)
                .replace(/@signature/,userData[list_item].signature);
            var newItem=$(itemHTML);
            //绑定事件
            newItem.on('click',function(){
                $(this).css("background","#57D5C9")
            });
            newItem.appendTo(listUl);
        }
    };
    DomModule.prototype.addItemToTalkingList=function(userData){
        //向列表添加项
        //数据为数组格式
        var listUl=$("#takingListUl");
        var _this=this;
        for(var list_item=0;list_item<userData.length;list_item++){
            itemHTML=_this.DomTemplate.talkingList.replace(/{@headSrc}/,_this.config.baseHeadUrl+userData[list_item].email+_this.config.headFileType)
                .replace(/{@userNick}/,userData[list_item].username)
                .replace(/@emailHidden/,userData[list_item].email);
            var newItem=$(itemHTML);

            newItem.appendTo(listUl);
            //绑定事件
            newItem.on('click',function(){
                $(this).css("background","#57D5C9")
            });
        }
    };


    if(!window.DomModule){
        window.DomModule=new DomModule();
    }


})(window,Zepto);