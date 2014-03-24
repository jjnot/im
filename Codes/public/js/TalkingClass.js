/**
 * Created by Fiffy on 13-11-21.
 */
function NormalSession(selfEmail,targetEmail,selfPhoto,targetPhoto,targetSign,targetName,selfName){
    this.selfEmail=selfEmail;
    this.targetEmail=targetEmail;
    this.talkingRecord=new Array();
    //窗口状态，开启为TRUE,关闭为FALSE
    this.windowStatus=false;
    //提醒数量，初始化为0
    this.alertNumber=0;
    if(!targetSign){
        this.targetSign="无";
    }else{
        this.targetSign=targetSign;
    }


    this.targetName=targetName;
    this.lastTime=0;
    this.selfName=selfName;
    this.selfPhoto=(selfPhoto===undefined?null:selfPhoto);
    this.targetPhoto=(targetPhoto===undefined?null:targetPhoto);
    this.saveNumber=10;
}


NormalSession.prototype={
    constructor:NormalSession,
    appendNewRecord:function(message,fromEmail,toEmail,time){
        var recorderLength=this.talkingRecord.length;
        var newRecorder={
            message:message,
            fromEmail:fromEmail,
            toEmail:toEmail,
            time:time
        }
        /*客户端维护长度为10的聊天记录数组,若未打开消息大于10则可以更多*/
        if(recorderLength<this.saveNumber||this.alertNumber>this.saveNumber){

            this.talkingRecord.push(newRecorder);
        }
        else{
            this.talkingRecord.shift();
            this.talkingRecord.push(newRecorder);
        }
    },
    sendMessageToSever:function(){
        var myDate = new Date();

        var catchMessage=document.getElementById("wordInput").value;
        var catchTime=myDate.toLocaleString();


        var tempThis=this;
        socket.emit('text',{
            fromemail:tempThis.selfEmail,
            toemail:tempThis.targetEmail,
            message:catchMessage,
            time:catchTime
        },function(result){
            if(result){
                tempThis.appendNewRecord(catchMessage,tempThis.selfEmail,tempThis.targetEmail,catchTime);
                tempThis.showNewMessageOnWindow(catchMessage,catchTime,true);
                tempThis.clearInput();
            }
            else{
                alert("因网络原因，消息"+message+"发送失败")

            }
        }); /*@:todo 有Socket之后请使用这些代码
        this.appendNewRecord(catchMessage,this.selfEmail,this.targetEmail,catchTime);
        this.showNewMessageOnWindow(catchMessage,catchTime,true);
        this.clearInput();*/

    },
    /////////////////////////LZM////////////////////////
    sendGroupMessageToSever:function(){
        var myDate = new Date();

        var catchMessage=document.getElementById("wordInput").value;
        var catchTime=myDate.toLocaleString();


        var tempThis=this;


         var username=window.localStorage.getItem("username");
        var url=document.location.href.split('=');
        socket.emit('grouptext',{
            roomid:url[1],
            name:username,
            fromemail:tempThis.selfEmail,
            message:catchMessage,
            time:catchTime
        },function(result){
            //if(result){
                //tempThis.appendNewRecord(catchMessage,tempThis.selfEmail,tempThis.targetEmail,catchTime);
                //console.log(username);
                tempThis.showNewMessageOnWindow(catchMessage,catchTime,true,username,tempThis.selfEmail);
                tempThis.clearInput();
            //}
            //else{
            //    alert("因网络原因，消息"+message+"发送失败")

            //}
        }); /*@:todo 有Socket之后请使用这些代码
         this.appendNewRecord(catchMessage,this.selfEmail,this.targetEmail,catchTime);
         this.showNewMessageOnWindow(catchMessage,catchTime,true);
         this.clearInput();*/

    },
    //接到消息，具体网络要在全局定义
    receiveMessageRomeSever:function(message,time){
       //分两种情况，窗口开着或者关着
       if(this.windowStatus){
           //显示消息
           this.showNewMessageOnWindow(message,time,false);
           //存入记录
           this.appendNewRecord(message,this.targetEmail,this.selfEmail,time);
       }
       else{
           this.alertNumber++;
           this.appendNewRecord(message,this.targetEmail,this.selfEmail,time);
       }

    },
    openSessionWindow:function(){
        this.windowStatus=true;
        //设置头像为目标头像,签名,昵称
        var head=document.getElementById('talkingWindowTopHead');
        head.src=this.targetPhoto;
        head.onerror=function(){
            uiControl.onHeadImgError(head);
        };
        document.getElementById('talkingWindowTopName').innerText=this.targetName;

        document.getElementById('talkingWindowTopSign').innerText=this.targetSign;
        //清空记录
        document.getElementsByClassName("talkingWindowBody").item(0).innerHTML="";

        //显示历史记录
        var messageAppendNumber=(this.alertNumber>this.saveNumber?this.alertNumber:this.saveNumber);
        messageAppendNumber=(messageAppendNumber>this.talkingRecord.length?this.talkingRecord.length:messageAppendNumber);

        for(i=0;i<messageAppendNumber;i++){
            if(this.talkingRecord[i].fromEmail==this.selfEmail){
                this.showNewMessageOnWindow(this.talkingRecord[i].message,this.talkingRecord[i].time,true);
            }
            else{
                this.showNewMessageOnWindow(this.talkingRecord[i].message,this.talkingRecord[i].time,false);
            }

        }
        //将历史记录数组回归到10
        if(messageAppendNumber>this.saveNumber){
            this.talkingRecord.splice(0,messageAppendNumber-this.saveNumber);
        }
        this.alertNumber=0;

        //检测窗口若是隐藏状态，则打开,后期可以再添加动画
        //:todo 目前因为外部样式的问题，暂不检测
        $("#TalkingWindowFrame").show();
    },
    closeSessionWindow:function(){
        this.windowStatus=false;
        //清空面板
        document.getElementsByClassName("talkingWindowBody").item(0).innerHTML="";
        this.clearInput();
        this.lastTime=0;

        //关闭窗口，可添加动画
        $("#TalkingWindowFrame").hide();

    },
    clearInput:function(){
        document.getElementById("wordInput").value="";
    },
    showNewMessageOnWindow:function(message,time,isFromSelf,name,email){
        if(this.lastTime==0){
            this.showTimeOnWindow(time);
            this.lastTime=1;
        }
        console.log(name);
        //添加消息的DOM
        var talkingWindowBody=document.getElementsByClassName("talkingWindowBody").item(0);
        var newSession=document.createElement("div");
        newSession.className="oneSession";
        var headTd=document.createElement("div");
        headTd.className="headTd";
        var headImg=document.createElement("img");
        headImg.className="headPhotoforTalking";
        headUrl=headBaseUrl+email+headType;
        headImg.src=headUrl;
        headImg.onerror=function(){
            uiControl.onHeadImgError(headImg);

        };
        headTd.appendChild(headImg);
        var SessionContent=document.createElement("div");
        SessionContent.className="SessionContent";
        var username=document.createElement("span");
        username.className="username";
        console.log(name);
        if(name){

            username.innerText=name;
        }
        bubbleSan=document.createElement("div");
        bubbleSan.className="bubbleSan";
        bubbleWord=document.createElement("div");
        bubbleWord.className="bubbleWord";
        bubbleWord.innerHTML=message;
        newSession.appendChild(headTd);
        SessionContent.appendChild(username);
        SessionContent.appendChild(bubbleSan);
        SessionContent.appendChild(bubbleWord);
        newSession.appendChild(SessionContent);
        if(isFromSelf){
            headImg.src=this.selfPhoto;
            $(newSession).addClass("mySession");
        }
        else{
           // headImg.src=this.targetPhoto;
        }
        talkingWindowBody.appendChild(newSession);
        //让滚动条滚到底部
        talkingWindowBody.scrollTop = talkingWindowBody.scrollHeight;

    },
    showTimeOnWindow:function(time){
        var talkingWindowBody=document.getElementsByClassName("talkingWindowBody").item(0);
        var newTimeBlock=document.createElement("div");
        newTimeBlock.className="timeBlock";
        var newTimeA=document.createElement("a");
        newTimeA.innerText=time;
        newTimeBlock.appendChild(newTimeA);
        talkingWindowBody.appendChild(newTimeBlock);
    },
    setWindowStatusClose:function(){
        this.windowStatus=false;
    },
    setWindowStatusOpen:function(){
        this.windowStatus=true;
    }
};