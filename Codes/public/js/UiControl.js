function UiControl(){
    var thisTemp=this;
    //设置系统消息框确认动作
	var flag=false;
	
    document.getElementById("systemInform").getElementsByTagName("button").item(0).onclick=function(){
        thisTemp.hideAlertMsg();
    }
}

UiControl.prototype.showAlertMsg=function(alertContent,okFunc){
    $("#systemInformContent").text(alertContent);
    $("#systemInform").fadeIn(200);

    if(okFunc){
        var thisTemp=this;
        document.getElementById("systemInform").getElementsByTagName("button").item(0).onclick=function(){
            thisTemp.hideAlertMsg();
            okFunc();
        }
    }
    else{
        var thisTemp=this;
        document.getElementById("systemInform").getElementsByTagName("button").item(0).onclick=function(){
            thisTemp.hideAlertMsg();
        }

    }

};

UiControl.prototype.hideAlertMsg=function(){
    $("#systemInform").fadeOut(200);
};

UiControl.prototype.showOkMsg=function(msgContent){
    $("#OkMsgContent").text(msgContent);
    var msgBlock=$("#okMsg");
    msgBlock.fadeIn(200).delay(500).fadeOut(200);

};


UiControl.prototype.showAddFriend=function(){
    $("#shadow").show();
    $("#addFriends").fadeIn(200);
};

UiControl.prototype.hideAddFriend=function(){
    $("#shadow").hide();
    $("#addFriends").fadeOut(200);
    document.getElementById("friendsEmail").value="";
};

UiControl.prototype.showVideoWrapper=function(){
  $("#videoWrapper").show(200);
};


UiControl.prototype.showAcceptMsg=function(msgContent,okFunc,noFunc){
    $("#acceptInformContent").text(msgContent);
    document.getElementById("acceptInformOk").onclick=okFunc;
    document.getElementById("acceptInformNo").onclick=noFunc;
    $("#acceptInform").fadeIn(200);
};


UiControl.prototype.hideAcceptMsg=function(){
    document.getElementById("acceptInformOk").onclick=this.hideAcceptMsg;
    document.getElementById("acceptInformNo").onclick=this.hideAcceptMsg;
    $("#acceptInform").fadeOut(200);
};


UiControl.prototype.showWaitingMsg=function(msgContent){
    if(!msgContent){
        msgContent="等待中";
    }
    $("#waitingMsgContent").text(msgContent);
    var msgBlock=$("#waitingMsg");
    $("#shadow").show();
    msgBlock.fadeIn(200);

};

UiControl.prototype.changeWaitingMsg=function(msgContent){
    if(!msgContent){
        msgContent="等待中";
    }
    $("#waitingMsgContent").text(msgContent);
};


UiControl.prototype.hideWaitingMsg=function(){
    $("#shadow").hide();
    if(arguments[0]==0){
        $("#waitingMsg").hide();
    }
    else{
        $("#waitingMsg").fadeOut(200);
    }

};



UiControl.prototype.constructGroupCreateList=function(userList){
    for(var i=0;i<userList.length;i++){
        var userEmail=userList[i].email;
        var userName=userList[i].username;
        var headUrl=headBaseUrl+userEmail+headType;
        var groupList=document.getElementById("onlineList");
        //TODO dom向在线列表中添加用户
        var onelist=document.createElement("div");
        onelist.className="OneList";
        var headPhoto=document.createElement("img");
        headPhoto.className="headPhoto";
        headPhoto.src=headUrl;
        headPhoto.onerror=function(){
            this.onHeadImgError(headPhoto);
        };
        var h1=document.createElement("h1");
        h1.innerText=userName;
        var emailHidden=document.createElement("div");
        emailHidden.className="emailHidden";
        emailHidden.innerText=userEmail;
        var select=document.createElement("span");
        select.className="selectIcon noSelect";
        onelist.appendChild(headPhoto);
        onelist.appendChild(h1);
        onelist.appendChild(emailHidden);
        onelist.appendChild(select);
        groupList.appendChild(onelist);
        onelist.onclick=function(){
            mainWindowControl.clickGroupList(this);
        }
    }

    $("#laodingGroup").hide();

};

UiControl.prototype.setGroupListSelect=function(element){
    var selector=element.getElementsByClassName("selectIcon").item(0);
    selector.className="selectIcon Selected";
};

UiControl.prototype.setGroupListUnselect=function(element){
    var selector=element.getElementsByClassName("selectIcon").item(0);
    selector.className="selectIcon noSelect";
};

UiControl.prototype.onHeadImgError=function(element){
    element.src="image/head.jpg";
};

UiControl.prototype.showCreateGroupList=function(){
    $("#createGroupSession").fadeIn(200);
};

UiControl.prototype.hideCreateGroupList=function(){
    if(arguments[0]==0){
        $("#createGroupSession ").hide();

    }
    else{
        $("#createGroupSession").fadeOut(200);
    }

    $("#loadingGroup").show();
    document.getElementById("onlineList").innerText="";
};

UiControl.prototype.addListNum=function(){
    var num=document.getElementById("selectNum").innerText;
    num++;
    document.getElementById("selectNum").innerText=num;

};

UiControl.prototype.reduceListNum=function(){
    var num=document.getElementById("selectNum").innerText;
    num--;
    document.getElementById("selectNum").innerText=num;

};

UiControl.prototype.setGroupSelectNumZero=function(){
    document.getElementById("selectNum").innerText=0;
};

UiControl.prototype.getFlag=function(){
	return flag;
};


UiControl.prototype.showGroupVideoWindow=function(){
	flag=true;
	
	//$("#friendListFrame").width(200);
	$("#friendListFrame2").animate({width:'200px'},200);
	$("#friendListFrame2").animate({left:'30px'},200);
    $("#TalkingWindowFrame2").animate({left:'250px'},400,function(){
        $("#GroupVideoChat").fadeIn(200);
    });
};

UiControl.prototype.appendNewVideoToGroupVideo=function(src){
    var content=document.getElementById("GroupVideoChat").getElementsByClassName("groupVideoContent").item(0);
    if(content.childNodes.length==6){
        //变作三列
        $("#GroupVideoChat").animate({width:'700px'},400,function(){
            content.style.width="670px"
        });
    }

    if(content.childNodes.length==13){
        //变作四列
        $("#GroupVideoChat").animate({width:'900px'},400,function(){
            content.style.width="880px"
        });
    }

    var newVideo=document.createElement("video");
    newVideo.autoplay=true;

    if(src){
        newVideo.src=src;
    }
    content.appendChild(newVideo);
};