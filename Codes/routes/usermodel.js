
var user= require('../models/user');
var async=require('async');
exports.DBconnect=function()
{
    var dbURL = 'mongodb://localhost/im';
    var db = require('mongoose').connect(dbURL);
    return db;
}

exports.DBdisconnect=function(db)
{
    db.disconnect();
}

//sha1加密
function encrypt(str)
{
    console.log("encrypt: original: "+str);
    var crypto = require('crypto');
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);

    var re=sha1.digest('hex');
    console.log("encrypt: encrypted: "+re);
    return re;
}

//登陆检查
exports.logincheck_return=function(email,password,success,fail){

    user.findOne({email:email},function(err,record){
        if(err){
            console.log("logincheck_return: db error: "+err);
            fail();return;
        }
        if(!record){
            console.log("logincheck_return: no email found");
            fail();return;
        }

        if(record.password==encrypt(password))
        {
            console.log("logincheck_return: password match");
            success();return;
        }
        else{
            console.log("logincheck_return: password dismatch");
            fail();return;
        }
    })
};

//修改密码
exports.changePassword=function(email,oldpw,newpw,success,fail){

    user.findOne({email:email},function(err,record){
        if(err){
            console.log("changePassword: db error: "+err);
            fail();return;
        }
        if(!record){
            console.log("changePassword: no email found");
            fail();return;
        }
        if(record.password==encrypt(oldpw))
        {
            console.log("changePassword: old password dismatch");
            fail();return;
        }
        else
        {
            record.password=encrypt(newpw);
            record.save();
            console.log("changePassword: succeed");
            success();return;
        }
    });
}

//注册检查
exports.registercheck_return=function(req,success,fail){

    var instance=new user();
    instance.email=req.body.email;
    instance.username=req.body.username;
    instance.signature=req.body.signature;
    instance.password=encrypt(req.body.password);

    user.create(instance,function(err){
        if(err)
        {
            console.log("registercheck_return: create failed: "+err);
            fail();return;
        }
        else{
            console.log("registercheck_return: create succeed");
            success();return;
        }
    })
}


//修改个人信息
exports.editPersonalInfo=function(req,success,fail){

    user.findOne({email:req.body.email},function(err,record){
        if(err) {
            console.log("editPersonalInfo: db error: "+err);
            fail();return;
        }
        if(!record) {
            console.log("editPersonalInfo: no email found");
            fail();return;
        }
        else {
//            record.address=req.body.address;
//            record.age=req.body.age;
//            record.birthday=req.body.birthday;
//            record.gender=req.body.gender;
//            record.school=req.body.school;
            record.username=req.body.username;
            record.signature=req.body.signature;
            record.save();
            console.log("editPersonalInfo: edit succeed");
            success();return;
        }
    });
}

 
//获取用户个人信息
exports.getUserInfo_return=function(email,success,fail){

   user.findOne({email:email},function(err,record){
        if(err) {
            console.log("getUserInfo_return: db error: "+err);
            fail();return;
        }
        if(!record){
            console.log("getUserInfo_return: no email found");
            fail();return;
        }
        else{
            var rs={email:record.email,username:record.username,signature:record.signature};
            console.log("getUserInfo_return: succeed: "+rs);
            success(rs);
       }
    });
}

/*
//获取用户好友信息，阻塞，有返回 数组
exports.getUserFriends_return=function(email){
    return user.findOne({email:email},function(err,record){
        if(err) {return false;}
        var rs=new Array();
        var friends=record.friends;

        for(var i=0;i<friends.length;i++)
        {
            user.findOne({email:friends[i]},function(err,record){
                rs[i]={email:record.email,username:record.username,signature:record.signature};
            });
        }
        return rs;
    });
}*/


//获取用户个人信息（详细），不阻塞，在调用success函数的时候传入参数
exports.getUserInfoDetail=function(email,success,fail){

    user.findOne({email:email},function(err,record){
        if(err) {
            console.log("getUserInfoDetail: db error: "+err);
            fail();return;
        }
        if(!record){
            console.log("getUserInfoDetail: no email found");
            fail();return;
        }
        else {
            console.log("getUserInfoDetail: succeed: "+record);
            success(record);
        }
    });
}


//获取用户好友信息（简单），不阻塞，在调用success函数的时候传入参数
exports.getUserFriends=function(email,success,fail){

    user.findOne({email:email},function(err,record){
        if(err) {
            console.log("getUserFriends: db error: "+err);
            fail();return;
        }
        if(!record){
            console.log("getUserFriends: no record found for host email");
            fail();return;
        }

        var rs=new Array();
        var friends=record.friends;

        var i = 0;
        async.whilst(
            function() { return i < friends.length },
            function(cb) {
                user.findOne({email:friends[i]},function(err,record){
                    if(err) {
                        console.log("getUserFriends: db error: "+err);
                        fail();return;
                    }
                    if(!record){
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!!!!");
                        console.log("getUserFriends: no record found for friends"+i+": "+friends[i]);
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!!!!");
                        fail();
                    }
                    else{
                        rs.push({email:record.email,username:record.username,signature:record.signature});
                        console.log("getUserFriends: get one friend: "+rs[i]);}
                        i++;
                        setTimeout(cb, 100);

                })
            },
            function(err) {
                console.log("getUserFriends: succeed");
                success(rs);
                // 3s have passed
                //log('1.1 err: ', err); // -> undefined
            }
        );
        /*
        for(var i=0;i<friends.length;i++)
        {
                 user.findOne({email:friends[i]},function(err,record){
                if(err) {fail()};
                rs.push({email:record.email,username:record.username,signature:record.signature});
                console.log(rs[i]);
                return true;
                //rs[i]="{email:'"+record.email+"',username:'"+record.username+"',signature:'"+record.signature+"'}";
            });
        }*/
    });
}

exports.getListInfo=function(emails,success,fail){
var i = 0;
    var rs = new Array();
async.whilst(
    function() { return i < emails.length },
    function(cb) {
        user.findOne({email:emails[i]},function(err,record){
            if(err) {
                fail();return;
            }
            if(!record){
                fail();
            }
            else{
                rs.push({email:record.email,username:record.username});
                console.log("getListInfo: get one user: "+rs[i]);}
            i++;
            setTimeout(cb, 100);

        })
    },
    function(err) {
        console.log("getListInfo: succeed");
        success(rs);
        // 3s have passed
        //log('1.1 err: ', err); // -> undefined
    }
);
}

//添加好友，双向添加
exports.addFriend_model=function(myemail,youremail,success,fail){

    addFriendSingle_model(youremail,myemail,
        function(){
            console.log("addFriend_model: one succeed");
            addFriendSingle_model(myemail,youremail,
                function(){
                    console.log("addFriend_model: two succeed");
                    success();return;
                },
                function(){
                    console.log("!!!!!!!!!!WARNING!!!!!!!!!!");
                    console.log("addFriend_model: two failed");
                    console.log("!!!!!!!!!!WARNING!!!!!!!!!!");
                })
    },
        function(){
            console.log("addFriend_model: one failed");
            fail();return;
    })
}

//添加好友，单向添加
function addFriendSingle_model(myemail,youremail,success,fail){

     user.findOne({email:myemail},function(err,record){
         if(err) {
             console.log("addFriendSingle_model: db error: "+err);
             fail();return;
         }
         if(!record) {
             console.log("addFriendSingle_model: no record for email: "+myemail);
             fail();return;
         }
         //console.log(myemail==youremail);
         if(myemail==youremail)
         {
             console.log("addFriendSingle_model: myemail==youremail");
             fail();return;
         }
         //检查是否已经好友
         for(var i in record.friends)
         {
             if(youremail==record.friends[i])
             {
                 console.log("addFriendSingle_model: duplicate friend: "+youremail);
                 fail();return;
             }
         }
         record.friends.push(youremail);
         record.save();
         console.log("addFriendSingle_model: succeed: "+myemail+"+"+youremail);
         success();return;
     });
    }

//删除好友，双向删除
exports.deleteFriend_model=function(myemail,youremail,success,fail){

    deleteFriendSingle_model(youremail,myemail,
        function(){
            console.log("deleteFriend_model: one succeed");
            deleteFriendSingle_model(myemail,youremail,
                function(){
                    console.log("deleteFriend_model: two succeed");
                    success();return;
                },
                function(){
                    console.log("!!!!!!!!!!!!WARNING!!!!!!!!!!!");
                    console.log("deleteFriend_model: two failed");
                    console.log("!!!!!!!!!!!!WARNING!!!!!!!!!!!");
                })
        },
        function(){
            console.log("deleteFriend_model: one failed");
            fail();return;
        })
}

//删除好友，单向删除
function deleteFriendSingle_model(myemail,youremail,success,fail){

        user.findOne({email:myemail},function(err,record){
            if(err) {
                console.log("deleteFriendSingle_model: db error: "+err);
                fail();return;
            }
            if(!record) {
                console.log("deleteFriendSingle_model: no record for email: "+myemail);
                fail();return;
            }
            for(var i=0;i<record.friends.length;i++)
            {
                if(record.friends[i]==youremail)
                {
                    record.friends.splice(i,1);
                    record.save();
                    console.log("deleteFriendSingle_model: succeed: "+myemail+"-"+youremail);
                    success();return;
                    break;
                }
            }
            console.log("deleteFriendSingle_model: no target friend found: "+youremail);
            fail();return;
        });
}