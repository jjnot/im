/**
 * Created by Fiffy on 13-11-22.
 */


function UserListController(){
    this.listBody=document.getElementsByClassName("friendListBody").item(0);
    this.onlineList=document.getElementById("onlineList");
}

UserListController.prototype.constructor=UserListController;





UserListController.prototype.getListData=function(listElement){
    var userCalled=listElement.getElementsByTagName("h1").item(0).innerText;
    var alertNumber=listElement.getElementsByClassName("alertNumber").item(0).innerText;
    var email=listElement.getElementsByClassName("hiddenEmail").item(0).innerText;
    return {
        userCalled:userCalled,
        alertNumber:alertNumber,
        email:email
    };
};


UserListController.prototype.popUpListByEmail=function(email,isOpen,userCalled){
    //分两种情况，有在聊天列表中则直接POPUP,没有则添加

    //检索列表
    var check=this.isInTalkingList(email);
    if(check.result){
        var listElement=check.listElement;
        if(listElement!=this.listBody.childNodes.item(0)){
            this.popUpByElement(listElement);
        }
        if(!isOpen){
            this.addAlertNumberByElement(listElement);
        }

    }
    else{
        this.addNewItemToList(headBaseUrl+email+headType,email,userCalled)
    }

}


UserListController.prototype.addNewItemToList=function(photoUrl,userCalled,email,sign){
    var ListArea=this.listBody;
    var newList=document.createElement("div");
    newList.className="OneList";
    var newHeadPhoto=document.createElement("img");
    newHeadPhoto.className="headPhoto";
    newHeadPhoto.src=photoUrl;
    newHeadPhoto.onerror=function(){
        uiControl.onHeadImgError(newHeadPhoto);
    };
    newList.appendChild(newHeadPhoto);

    var newUserCalled=document.createElement("h1");
    newUserCalled.innerText=userCalled;
    newList.appendChild(newUserCalled);



    var deleteIcon=document.createElement("div");
    deleteIcon.className="deleteIcon";
    deleteIcon.onclick=function(){
        removeListItem(this);
    };
    newList.appendChild(deleteIcon);

    var alertNumber=document.createElement("div");
    alertNumber.className="alertNumber";
    alertNumber.innerText=0;
    alertNumber.style.display="none";
    newList.appendChild(alertNumber);

    var emailHidden=document.createElement("div");
    emailHidden.className="emailHidden";
    emailHidden.innerText=email;
    newList.appendChild(emailHidden);

    var signBlock=document.createElement("div");
    signBlock.className="sign";
    signBlock.innerText=sign;
    newList.appendChild(signBlock);




    ListArea.insertBefore(newList,this.listBody.childNodes.item(0));

    newList.onmouseover=function(){
        changeBackgroundBlue(this);};

    newList.onmouseout=function(){
        changeBackgroundWhite(this);
    };
    newList.onclick=function(){
        clickTalkingList(this);
    }
};


UserListController.prototype.popUpByElement=function(element){
    this.listBody.removeChild(element);
    this.listBody.insertBefore(element,this.listBody.childNodes.item(0));
}

UserListController.prototype.addAlertNumberByElement=function(element){
    var alertNumberDom=element.getElementsByClassName("alertNumber").item(0);
    alertNumberDom.innerText++;
    alertNumberDom.style.display="block";
};


UserListController.prototype.isInTalkingList=function(email){
    var talkingLists=this.listBody.getElementsByClassName("OneList");
    var listElement=null;
    for (var i=0;i<talkingLists.length;i++){
        if(talkingLists.item(i).getElementsByClassName("emailHidden").item(0).innerText==email){
            listElement=talkingLists.item(i);
            break;
        }
    }
    if (!listElement){
        return {
            result:false,
            listElement:null
        };
    }
    else{
        return {
            result:true,
            listElement:listElement
        };
    }
};

UserListController.prototype.deleteItem=function(element){
    event.stopPropagation();
    event.preventDefault();
    var thisTemp=this;
    var item=element.parentNode;
    $(element).parent().animate({height:'-=80px'},150,function(){
        thisTemp.listBody.removeChild(item);
    });
};


