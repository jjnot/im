/**
 * Created by Fiffy on 13-12-3.
 */
var qvgaConstraints  = {
    video: {
        mandatory: {
            maxWidth: 320,
            maxHeight: 240
        }
    },audio:true
};
function VideoControl(){
    this.mainVideo=document.getElementById("main_video");
    this.localVideo=document.getElementById("local_small_video");
    this.localSteam=null;
    this.isCameraOpen=false;
    this.status=null;
    this.pc=null
    this.pc_config=null;
}
VideoControl.prototype.setStatusRemote=function(){
    //1为接收端
    this.status=1;
};

VideoControl.prototype.setStatusCall=function(){
    //0为发起端
    this.status=0;
};

VideoControl.prototype.doGetUserMedia=function(){
    //获取视频音频流
    uiControl.showWaitingMsg("请接收浏览器调用请求");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var tempThis=this;
    var constraints ={ audio: true, video: true };
    navigator.getUserMedia(qvgaConstraints, function(stream){
          tempThis.onUserMediaSuccess(stream);
    },
        function(stream){
          tempThis.errorCallback(stream);
        }
    );
};

VideoControl.prototype.onUserMediaSuccess=function(stream){
    //获取视频音频流成功
    console.log("获取视频流成功.");
    uiControl.changeWaitingMsg("正在建立视频连接");
    console.log(this.localVideo);
    this.localVideo.src=window.webkitURL.createObjectURL(stream);
    this.localStream=stream;
    this.isCameraOpen=true;

    if(this.status==1){
        //如果是接收端，则发送acceptvideochat
        console.log("接受者发送成功消息1");
        netWorkModel.acceptVideoChat(mainWindowControl.talkingTarget);
    }
    else{
        //发起者视频也获取完成，可以开始视频聊天
        this.doCall();
        netWorkModel.sendVideoReady();
    }
};

VideoControl.prototype.errorCallback=function(e){
    //获取视频音频流失败
    uiControl.showAlertMsg(e.toString());
    //:todo 关闭视频窗口
};


VideoControl.prototype.acceptVideoChat=function(acceptTarget){
    //接受视频聊天
    //在此之前应该先打开自己的摄像头
    //还要切换聊天窗口，并且打开摄像聊天界面
    var inform=mainWindowControl.getInformByEmail(acceptTarget);
    mainWindowControl.friendOpenWithInformation(inform.userCalled,acceptTarget,inform.sign);
    uiControl.showVideoWrapper();
    this.setStatusRemote();
    this.doGetUserMedia();
};

VideoControl.prototype.doCall=function(){
  //两边视频获取完毕，正式开始聊天
    this.pc = new webkitRTCPeerConnection(this.pc_config);
    this.pc.onicecandidate =this.onIceCandidate;
    var tempThis=this;
    this.pc.onnegotiationneeded = function () {
        if(tempThis.status==0){
            //发送端createOffer
            tempThis.pc.createOffer(function(sessionDescription){
                tempThis.setLocalAndSendMessage(sessionDescription);
            });
        }
        else{
            // 什么都不用干
        }
    };

    this.pc.onaddstream = function(evt){
        tempThis.onRemoteStreamAdded(evt);
        uiControl.hideWaitingMsg();
    };


    console.log("add stream"+this.status);
    //  pc.onremovestream = onRemoteStreamRemoved;
    try{
        this.pc.addStream(this.localStream);
        console.log("add success");
    }
    catch(e){
        console.log("add error");
    }
};

VideoControl.prototype.onIceCandidate=function(event){
    if (event.candidate) {
        //发送candidate信息
        socket.emit('candidate', {type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            fromemail:mainWindowControl.selfEmail,
            toemail:mainWindowControl.talkingTarget
        });

    } else {
        console.log("NO Candidate");
        console.log("End of candidates.");
    }
};



VideoControl.prototype.setLocalAndSendMessage=function(sessionDescription) {
    // Set Opus as the preferred codec in onnegotiationneeded if Opus is present.
    //sessionDescription.sdp = preferOpus(sessionDescription.sdp);
    console.log("Offer from localPeerConnection: \n" + sessionDescription.sdp);
    this.pc.setLocalDescription(sessionDescription);
    //发送sdp信息
    socket.emit('sdp',{
        sdp:sessionDescription,
        fromemail:mainWindowControl.selfEmail,
        toemail:mainWindowControl.talkingTarget
    });
};

VideoControl.prototype.onRemoteStreamAdded=function(evt){
    console.log("addStream");
    this.mainVideo.src = URL.createObjectURL(evt.stream);

};

VideoControl.prototype.stop=function(){
    this.localSteam.pause();
}