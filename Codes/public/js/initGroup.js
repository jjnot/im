/**
 * Created by Fiffy on 13-12-11.
 */
headBaseUrl="image/";
headType=".jpg";
var uiControl=new UiControl();

//TODO 测试后删除
var tk=new NormalSession();
function test(){
    uiControl.showGroupVideoWindow();
}

function test2(){
    uiControl.appendNewVideoToGroupVideo();
}


socket.on('grouptext',function(data){
    mainWindowControl.groupList.showNewMessageOnWindow(data.message,data.time,false,data.name,data.fromemail)
});

function getOwnCamera(){
    uiControl.showGroupVideoWindow();
    doGetUserMedia();

}


//socket.on('grouptext',function(data){
//   uiControl.showAcceptMsg("对方邀请你群体视频聊天",function(){
//
//       }
//       ,function(){
//           uiControl.hideAcceptMsg();
//       }
//   );
//});

var roomid=1;
function init(){
    console.log("init"+roomid);
    mainWindowControl.groupInit(roomid);
}

var dockf=true;
var listf=false;
function setFace(p){
    if(!uiControl.getFlag())
        return;
    var list = document.getElementById("friendListFrame");
    var dock = document.getElementById("listDock");
    if(p==1)
    {
        dockf=false;
        listf=true;
        list.style.cssText = "display:block;";
        dock.style.cssText = "display:none;";
    }
    else if(p==0)
    {
        dockf=true;
        listf=false;
        list.style.cssText = "display:none;";
        dock.style.cssText = "display:block;";
    }
    $("#friendListFrame").animate({left:'30px'},100);
}


window.onload=function(){
    var pageHeight=document.body.clientHeight;
    document.getElementsByClassName("talkingWindowBody").item(0).style.height=pageHeight-200+"px";
    document.getElementsByClassName("ListContent").item(0).style.height=pageHeight-200+"px";
};
