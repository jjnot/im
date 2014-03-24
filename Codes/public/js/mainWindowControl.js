/**
 * Created with JetBrains WebStorm.
 * User: Fiffy
 * Date: 13-10-24
 * Time: 下午7:16
 * To change this template use File | Settings | File Templates.
 */




function changeBackgroundBlue(element){
    element.style.background="lightblue";
}


function changeBackgroundWhite(element){
    element.style.background="#FFFFFF";
}













/*@窗口控制类，控制列表，弹窗等事件
--------------------------------------------------------------------------------------------------------------------*/
function MainWindowControl(){}

MainWindowControl.prototype.init=function(selfEmail,selfName,selfSign,baseUrl,headType){
    this.deleteArray=[];
    this.selfEmail=selfEmail;
    this.windowList=[];
    this.groupList=null;
    this.sessionMaintain=0;
    this.baseUrl=baseUrl;
    this.selfSign=selfSign;
    this.selfName=selfName;
    this.headType=headType;
    this.isMouseDownOT=false;
    this.userListController=new UserListController();
    this.talkingTarget=null;
    this.clickTalkingPos={
        x:null,
        y:null
    };
    this.originTalkingWindowPos={
        top:30,
        left:405
    };
    this.groupSelecter=[];
    //初始化界面元素
    this.initInterfaceElement();


};

MainWindowControl.prototype.initInterfaceElement=function(){
    //初始化个人设置栏
    var pages=document.getElementsByClassName('friendListBody').item(2);
    pages.getElementsByTagName('h4').item(0).innerText=this.selfEmail;
    pages.getElementsByTagName('input').item(0).value=this.selfName;
    pages.getElementsByTagName('input').item(1).value=this.selfSign;

    var head=document.getElementById("headCanvas");
    head.src=headBaseUrl+this.selfEmail+headType;
    head.onError=function(){
        uiControl.onHeadImgError(head);
    };

    //自适应高度
    var pageHeight=document.body.clientHeight;
    console.log(pageHeight);
    document.getElementsByClassName("ListContent").item(0).style.height=pageHeight-200+"px";
    document.getElementsByClassName("talkingWindowBody").item(0).style.height=pageHeight-250+"px";
};


MainWindowControl.prototype.moveFriendListNav=function(navItem){
    //滑动LIST,传入的参数是转到目标为第几个LIST
    navPos=navItem;
    var listW=document.getElementById("friendListFrame").clientWidth;

    var listX=document.getElementById("friendListFrame").offsetLeft ;

    var positionX=-navItem*listW+listX-30;
    console.log(positionX);
    $("#scrollBroad").animate({left:positionX},120);
};
MainWindowControl.prototype.friendOpenWithDom=function(domElement){
    //传入点击的DOM对象
    var userCalled=domElement.getElementsByTagName('h1').item(0).innerText;
    var email=domElement.getElementsByClassName('emailHidden').item(0).innerText;
    var targetSign=domElement.getElementsByClassName('sign').item(0).innerText;
    this.friendOpenWithInformation(userCalled,email,targetSign);

};

MainWindowControl.prototype.getInformByEmail=function(email){
    var friendList=document.getElementsByClassName("friendListBody").item(1).getElementsByClassName("OneList");
    var inform=null;
    for(var i=2;i<friendList.length;i++){
        if(friendList.item(i).getElementsByClassName("emailHidden").item(0).innerText==email){
            var sign=friendList.item(i).getElementsByClassName("sign").item(0).innerText;
            var userCalled=friendList.item(i).getElementsByTagName("h1").item(0).innerText;
            inform={
                sign:sign,
                userCalled:userCalled
            };
            break;
        }
    }
    return inform;

};


MainWindowControl.prototype.getTalkingElementByEmail=function(email){
    var friendList=document.getElementsByClassName("friendListBody").item(0).getElementsByClassName("OneList");
    var element=null;
    for(var i=0;i<friendList.length;i++){
        if(friendList.item(i).getElementsByClassName("emailHidden").item(0).innerText==email){
            element=friendList.item(i);
        }
    }
    return element;

};


MainWindowControl.prototype.friendOpenWithInformation=function(userCalled,email,targetSign){

    if(this.windowList[this.talkingTarget]){
        this.windowList[this.talkingTarget].setWindowStatusClose();
    }
    if(!this.windowList[email]){
        this.windowList[email]=new NormalSession(this.selfEmail,email,this.baseUrl+this.selfEmail+
            this.headType,this.baseUrl+email+this.headType,targetSign,userCalled,this.selfName);
        this.sessionMaintain++;
        this.windowList[email].openSessionWindow();
        this.userListController.addNewItemToList(this.baseUrl+email+this.headType,userCalled,email,targetSign);
    }
    else{
        this.windowList[email].openSessionWindow();
    }

    this.talkingTarget=email;
};

MainWindowControl.prototype.groupInit=function(roomid,selfEmail,baseUrl,headType,selfName){
    this.selfEmail=selfEmail;
    this.baseUrl=baseUrl;
    this.selfName=selfName;
    this.headType=headType;
    this.isMouseDownOT=false;
    if(!this.groupList){
        this.groupList = new NormalSession(this.selfEmail,roomid,this.baseUrl+this.selfEmail+
            this.headType,this.selfName);
        console.log(this.groupList);
    }
};


MainWindowControl.prototype.clickSend=function(){
    this.windowList[this.talkingTarget].sendMessageToSever();
};
MainWindowControl.prototype.groupSend=function(){
    this.groupList.sendGroupMessageToSever();
};

MainWindowControl.prototype.receiveMessage=function(email,time,message,targetSign,userCalled){
    if(this.navPos!=0){
        //:todo  现在暂时使用直接移动法提示，应该使用加数字法更好吧
        this.moveFriendListNav(0);
    }
    if(!this.windowList[email]){
        this.windowList[email]=new NormalSession(this.selfEmail,email,this.baseUrl+this.selfEmail+
            this.headType,this.baseUrl+email+this.headType,targetSign,userCalled,this.selfName);
        this.sessionMaintain++;
        this.userListController.addNewItemToList(this.baseUrl+email+this.headType,userCalled,email,targetSign);
    }
    this.windowList[email].receiveMessageRomeSever(message,time);
    this.userListController.popUpListByEmail(email,(email==this.talkingTarget),userCalled)
};

MainWindowControl.prototype.clearAlertNumber=function(domElement){
    var alertNumberDom=domElement.getElementsByClassName("alertNumber").item(0);
    alertNumberDom.innerText=0;
    alertNumberDom.style.display="none";
};

MainWindowControl.prototype.moveTalkingWindow=function(newX,newY){
    if(this.isMouseDownOT){
        moveX=newX-this.clickTalkingPos.x;
        moveY=newY-this.clickTalkingPos.y;
        var windowDom=document.getElementById("TalkingWindowFrame");
        windowDom.style.left=this.originTalkingWindowPos.left+moveX+'px';
        windowDom.style.top=this.originTalkingWindowPos.top+moveY+'px';
        console.log(windowDom.offsetLeft+','+windowDom.offsetTop+','+moveX+','+moveY);
    }


};
MainWindowControl.prototype.setTouchPointOnTalking=function(x,y){
    this.isMouseDownOT=true;
    this.clickTalkingPos.x=x;
    this.clickTalkingPos.y=y;
};

MainWindowControl.prototype.mouseUpOnTalkingWindow=function(){
    var windowDom=document.getElementById("TalkingWindowFrame");
    this.originTalkingWindowPos.left=windowDom.offsetLeft;
    this.originTalkingWindowPos.top=windowDom.offsetTop;
    this.isMouseDownOT=false;

};


MainWindowControl.prototype.removeSession=function(element)
{
    var email=element.parentNode.getElementsByClassName('emailHidden').item(0).innerText;
    if(this.talkingTarget==email){
        this.closeWindow();
    }
    this.userListController.deleteItem(element);
    delete this.windowList[email];
    this.sessionMaintain--;
};

MainWindowControl.prototype.closeWindow=function(){
    if(this.talkingTarget){
        this.windowList[this.talkingTarget].closeSessionWindow();
        this.talkingTarget=null;
    }
};
MainWindowControl.prototype.addUserToFriendList=function(email,userCalled,signature){
    console.log("tianjiadaohaoyouliebiao"+email+userCalled+signature);
    var friendList=document.getElementsByClassName("friendListBody").item(1);
    var onelist=document.createElement("div");
    onelist.className="OneList";
    onelist.onmouseover=function(){
        changeBackgroundBlue(onelist);
    };
    onelist.onmouseout=function(){
        changeBackgroundWhite(onelist);
    };

    onelist.onclick=function(){
        clickFriendList(onelist);
    };
    //head
    var headPhoto=document.createElement("img");
    headPhoto.className="headPhoto";
    headPhoto.src=headBaseUrl+email+headType;
    onelist.appendChild(headPhoto);
    //userName
    var h1=document.createElement("h1");
    h1.innerText=userCalled;
    onelist.appendChild(h1);
    //deleteIcon
    var deleteIcon=document.createElement("div");
    deleteIcon.className="deleteIcon";
    deleteIcon.onclick=function(){
        removeListItem(deleteIcon);
    };
    onelist.appendChild(deleteIcon);
    //emailHidden
    var emailHidden=document.createElement("div");
    emailHidden.className="emailHidden";
    emailHidden.innerText=email;
    onelist.appendChild(emailHidden);
    //sign
    var sign=document.createElement("div");
    sign.className="sign";
    sign.innerText="signature";
    onelist.appendChild(sign);
    //end
    friendList.appendChild(onelist);

};


MainWindowControl.prototype.deleteFriend=function(domElement){
    var dom=domElement.parentNode;
    var email=dom.getElementsByClassName("emailHidden").item(0).innerText;
    var name=dom.getElementsByTagName("h1").item(0).innerText;
    var tempThis=this;
    var yesFun=function(){
        //确定删除
        tempThis.deleteArray[email]=true;
        netWorkModel.deleteFriend(email);
        uiControl.hideAcceptMsg();
    };
    var noFun=function(){
        uiControl.hideAcceptMsg();
    };
    if(!this.deleteArray[email] ){
        uiControl.showAcceptMsg("你确定删除好友"+name+"?",yesFun,noFun)
    }
};
MainWindowControl.prototype.resetDeleteArray=function(email){
    this.deleteArray[email]=null;
    delete  this.deleteArray[email];
};

MainWindowControl.prototype.deleteFriendFromFriendList=function(email){
    var friendList=document.getElementsByClassName("friendListBody").item(1);
    var emailDom=document.getElementsByName("hiddenEmail");
    for(i=0;i<emailDom.length;i++){
        if(emailDom.item(i).innerText==email){
            friendList.removeChild(emailDom.item(i).parentNode);
        }
    }
    if(this.windowList[email]){
        if(this.talkingTarget==email){
            var element=this.getTalkingElementByEmail(email);
            this.removeSession(element);
        }
    }
};

MainWindowControl.prototype.isInArray=function(element,array){
    //TODO 加入库方法
    var res=false;

    for(var i=0;i<array.length;i++){
        if(array[i]==element){
            res=true;
            break;
        }
    }
    return res;
};

MainWindowControl.prototype.clickGroupList=function(element){
    var selectEmail=element.getElementsByClassName("emailHidden").item(0).innerText;
    if(this.isInArray(selectEmail,this.groupSelecter)){
        //之前选择过，从list中剔除
        uiControl.setGroupListUnselect(element);
        uiControl.reduceListNum();
        var pos;
        for (var i=0;i<this.groupSelecter.length;i++){
            if(this.groupSelecter[i]==selectEmail){
                pos=i;
                break;
            }
        }
        this.groupSelecter.splice(pos,1);
    }
    else{
        //若之前没选择过
        uiControl.setGroupListSelect(element);
        uiControl.addListNum();
        this.groupSelecter.push(selectEmail);
    }
};

MainWindowControl.prototype.conformCreate=function(){
    netWorkModel.createGroup(this.groupSelecter);
    uiControl.hideCreateGroupList();
    this.clearGroupSelector();

};

MainWindowControl.prototype.createGroup=function(){
    netWorkModel.getOnlineList();
    uiControl.showCreateGroupList();
};

MainWindowControl.prototype.clearGroupSelector=function(){
    delete this.groupSelecter;
    this.groupSelecter=[];
    uiControl.setGroupSelectNumZero();

};

MainWindowControl.prototype.closeGroupCreateList=function(){
    uiControl.hideCreateGroupList();
    this.clearGroupSelector();
};

MainWindowControl.prototype.getNewHead=function(sender){
  //选择了新的头像
    if( !sender.value.match( /.jpg|.png/i ) ){
        uiControl.showAlertMsg('图片格式无效,请使用PNG图像或JPG图像');
        return false;
    }
    else{

        uiControl.showWaitingMsg("头像处理中。。");
        if (sender.files) {
            //兼容chrome、火狐等，HTML5获取路径
            if (typeof FileReader !== "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("headCanvas").setAttribute("src", e.target.result);
                    uiControl.hideWaitingMsg();
                };
                reader.readAsDataURL(sender.files[0]);
            } else if (browserVersion.indexOf("SAFARI") > -1) {
                uiControl.showAlertMsg("暂时不支持Safari浏览器!");
                uiControl.hideWaitingMsg();
            }
        }

        return true;
    }
};







/*@全局函数
--------------------------------------------------------------------------------------------------------------- */
function closeTalkingWindow(){
    mainWindowControl.closeWindow();
}
function removeListItem(element){
    mainWindowControl.removeSession(element);
}

function clickFriendList(domElement){
    mainWindowControl.friendOpenWithDom(domElement);

}

function clickTalkingList(domElement){
    mainWindowControl.friendOpenWithDom(domElement);
    mainWindowControl.clearAlertNumber(domElement);
}

function saveInfo(){
    var name=document.getElementById('selfSetting').getElementsByTagName("input").item(0).value;
    var signature=document.getElementById('selfSetting').getElementsByTagName("input").item(1).value;
    console.log(name+' '+signature);
    netWorkModel.changeUserInform(name,signature);
}
function sendMessage(){
    mainWindowControl.clickSend();
}

function groupSendMessage(roomid){
    mainWindowControl.groupSend();
}

function moveFriendListNav(navItem){
    mainWindowControl.moveFriendListNav(navItem);
}

function takingHeadMouseDown(e){

    var x= e.clientX;
    var y= e.clientY;
    mainWindowControl.setTouchPointOnTalking(x,y);
}

function takingHeadMouseMove(e){
    var x= e.clientX;
    var y= e.clientY;
    mainWindowControl.moveTalkingWindow(x,y);
}

function takingHeadMouseUP(e){

    mainWindowControl.mouseUpOnTalkingWindow();
}


function showAddFriends(){
    uiControl.showAddFriend();
}

function hideAddFriends(){
    uiControl.hideAddFriend();
}

function addFriends(){
    netWorkModel.addFriends(document.getElementById("friendsEmail").value);
    uiControl.hideAddFriend();
}


function startVideoChat(){
    //首先询问对方是否接受视频聊天
    netWorkModel.requestVideoChat();
    uiControl.showVideoWrapper();
    uiControl.showWaitingMsg("等待对方接受中");
}


function clickDeleteFriend(domELment){
    mainWindowControl.deleteFriend(domELment);
    //IE：
    window.event.cancelBubble = true;//停止冒泡
    window.event.returnValue = false;//阻止事件的默认行为

    //Firefox：
    event.preventDefault();// 取消事件的默认行为
    event.stopPropagation(); // 阻止事件的传播

}

function selectFile(sender){
   mainWindowControl.getNewHead(sender);
}




function createGroupSession(){
    mainWindowControl.createGroup();
}

function conformCreateGroup(){
    mainWindowControl.conformCreate();
}


function closeGroupCreateList(){
    mainWindowControl.closeGroupCreateList();
}

function closeVideoChat(){
    $("#videoWrapper").fadeOut(200);
    socket.emit('videoclose',1);
}
/*@测试用函数 :todo 测试完成后请删除
------------------------------------------------------------------------------------------------ */
//全局对象
headBaseUrl="image/";
headType=".png";
var uiControl=new UiControl();
var netWorkModel=new NetWorkModel();
var videoControl=new VideoControl();
var mainWindowControl=new MainWindowControl();

if(window.location.href.match("GroupTalking")){
    mainWindowControl.groupInit(document.location.href.split('=')[1],window.localStorage.getItem("email"),headBaseUrl,headType,window.localStorage.getItem("username"));
}else{
    mainWindowControl.init(window.localStorage.getItem("email"),window.localStorage.getItem("username"),
        window.localStorage.getItem("signature"),headBaseUrl,headType);
}

