var usermodel=require("./usermodel");
var fs=require('fs');
exports.index = function(req, res){
    var email=req.session.email;
    usermodel.getUserFriends(email,function(friends){ console.log(friends);res.render('frame',{friends:friends});},function(){});
    //friends=usermodel.getUserFriends_return(email);

};

//这个函数通知该email的在线 好友，该emaiL已经登陆
//对应的socket:socket.emit(‘someonelogin’,{email:xxxx});
//userlist表示当前在线的人的信息
//userlist的结构userlist[email]={email:xxxx,socket:xxxx};

exports.notifyFriends=function(email,userlist){
    var friends=usermodel.getUserFriends_return(email);
    var friendLength=friends.length;
    for(var i=0;i!=friendLength;i++)
    {
        var f=friends[i];
        if(userlist[f.email]!=null)
        {
            userlist[f.email].socket.emit('someoneLogin',{email: f.email});
        }
    }
}

//上传头像
exports.uploadHead=function(req,res){
    console.log('aaaaaaaaaa');
    var obj=req.files.upload;
    var tmp=obj.path;
    var array=obj.name.split('.');
            console.log(obj);console.log(array);
    if(array[1]=="png"||array[1]=="jpg"||array[1]=="bmp"){
        var arr=req.session.email.split('.');

        var s='./Codes/public/image/'+arr[0];
        console.log(s);
          fs.readFile(s,function(err){
              fs.unlink(s,function(err){
                  fs.rename(tmp,'Codes/public/image/'+req.session.email+'.png',function(err){
                      res.send(200);

              })
          })

        })
    }
    else{
        fs.readFile(tmp,function(err){
            if(err)throw err;
            fs.unlink(tmp,function(error){
                if(error) throw error;
                res.send(200,"格式不符");
            })
        })
    }


}

//修改个人资料
exports.modify=function(req,res){

    usermodel.editPersonalInfo(req,function(){
        res.send(200);
    },function(){
        console.log('modify info error');
    })
}