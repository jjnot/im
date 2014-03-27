
/**
 * Module dependencies.
 */
//var audio = require('./routes/audio');
//var filetransfer = require('./routes/filetransfer');
var textcontrol=require('./routes/textControl');
var textmodel=require('./routes/textModel');
//var video=require('./routes/one_to_onevideo');
//var groupvideo=require('./routes/groupvideo');
var usercontrol=require('./routes/usercontrol');
//var grouptext=require('./routes/grouptext');
var express = require('express');
var routes = require('./routes');
var usermodel = require('./routes/usermodel');
var http = require('http');
var path = require('path');
var io=require('socket.io');
var async=require('async');
var app = express();
usermodel.DBconnect();

//var maxroom=0;
 //用一个大型数组来表示来记录用户关键信息
var userlist=new Array();
var roomlist=new Array();
// all environments
app.configure(function(){
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/image' }));
app.use(express.methodOverride());
app.use(express.cookieParser('my secret string'));
app.use(express.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
server=http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

 io= io.listen(server);

//至此以上代码可以不用管
io.sockets.on('connection',function(socket){
		socket.on('login',function(msg){
			var email=msg.email;
            if(email&&userlist[email]&&(email==userlist[email].email)){
                socket.set('email',email,function(err){
                    if(err) throw err;
                    userlist[email].socket=socket;
                    console.log(3333);
                    console.log(userlist[email].socket==null);
                    //console.log(userlist[email].socket);
        })

    }
});
			
		socket.on('text',function(event,fn){
			var toemail=event.toemail;
            console.log(toemail);
            //console.log('text message form '+event.fromemail);
			//什么意思？
            //console.log(userlist[toemail].socket==null);
            fn(1);
            if(userlist[toemail])
			    textcontrol.textMessage(event,socket,userlist[toemail].socket);
            else
                textcontrol.textMessage(event,socket,null);

			});

	 // {email:xxxxx}
		socket.on('offline',function(event,fn){

			var myemail=event.email;
            fn(1);
			textcontrol.getMyOfflineMessage(myemail,socket);
			})

      //{myemail:xxxx,fromemail:xxxx}
        socket.on('chatrecord',function(evt){
              if(userlist[myemail].socket==socket)
                textcontrol.getChatRecord_control(myemail,fromemail,socket);

        })

        //发起视频会话的准备
       //{fromemail:xxxx,toemail:xxxx}
       socket.on('video',function(evt,fn){
           //判断对方是否在线
           var myemail=evt.fromemail;
           var toemail=evt.toemail;
               if(userlist[toemail]){if(userlist[toemail].socket){
                          fn(1);
                          var tosocket=userlist[toemail].socket;
                           tosocket.emit('video',evt);     }}


       })
    //{sdp:sessionDescription,fromemail:userName,toemail:newUser}
        socket.on('sdpfromoffer',function(evt){
            var fromemail=evt.fromemail;
            var toemail=evt.toemail;
            if(userlist[toemail]){
            if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
                var tosocket = userlist[toemail].socket;
                tosocket.emit('sdpfromoffer',evt);
            }}

        })
    //{sdp:sessionDescription,fromemail:userName,toemail:newUser}
        socket.on('sdpfromanswer',function(evt){
            var fromemail=evt.fromemail;
            var toemail=evt.toemail;

            if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
                  var tosocket = userlist[toemail].socket;
                    tosocket.emit('sdpfromanswer',evt);

            }
        })
         socket.on('candidate',function(evt){
             var fromemail=evt.fromemail;
             var toemail=evt.toemail;
             if(userlist[toemail]){
             if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
                 var tosocket = userlist[toemail].socket;
                 tosocket.emit('candidate',evt);

             }
             }
         })
        socket.on('wantedvideochat',function(evt){
            var fromemail=evt.fromemail;
            var toemail=evt.toemail;
            if(userlist[toemail]){
            if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
                var tosocket = userlist[toemail].socket;
                tosocket.emit('wantedvideochat',evt);

            }
            }
        });
    socket.on('acceptvideochat',function(evt){
        var fromemail=evt.fromemail;
        var toemail=evt.toemail;
        if(userlist[toemail]){
        if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
            var tosocket = userlist[toemail].socket;
            tosocket.emit('acceptvideochat',evt);

        }
        }
    });
    socket.on('videoChatReady',function(evt){
        var fromemail=evt.fromemail;
        var toemail=evt.toemail;
        if(userlist[toemail]){
        if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
            var tosocket = userlist[toemail].socket;
            tosocket.emit('videoChatReady',evt);

        }
        }
    });
    socket.on('sdp',function(evt){
        var fromemail=evt.fromemail;
        var toemail=evt.toemail;
        if(userlist[toemail]){
        if(userlist[toemail].socket&&userlist[toemail]&&userlist[fromemail].socket==socket){
            var tosocket = userlist[toemail].socket;
            tosocket.emit('sdp',evt);

        }
        }
    });
//    socket.on('hello',function(data){console.log('test hello');})
    socket.on('loginbygroup',function(data){
        var email=data.email;
        var roomid=data.roomid;
        if(email!=null&&roomid!=null&&io.checkRoomid(roomid)&&io.checkRoomidAndClient(roomid,userlist[email].socket.id)){
            roomid='//'+roomid;
            socket.join(roomid);

        }
    })
    socket.on('disconnect',function(){


    })
    socket.on('grouptext',function(data,fn){
        var roomid='//'+data.roomid;
        console.log('roomid '+roomid);
        fn(1);
        socket.broadcast.to(roomid).emit('grouptext',data);

    })
    socket.on('anyone?',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('anyone?',msg);

    })
    socket.on('yes,here',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('yes,here',msg);
    })
    socket.on('enter',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('enter',msg);
    })
    socket.on('group_candidate',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('group_candidate',msg);
    })
    socket.on('OkResponse',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('OkResponse',msg);
    })
    socket.on('group_sdpfromoffer',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('group_sdpfromoffer',msg);
    })
    socket.on('group_sdpfromanswer',function(msg){
        var roomid='//'+msg.roomid;
        socket.broadcast.to(roomid).emit('group_sdpfromanswer',msg);
    })
    socket.on('videoclose',function(data){
        console.log(8888888888888888);
        socket.broadcast.emit('videoclose',data);
    })
});
//这个函数只判断
function check(req,res,next){
    if(req.session.email){
        next();
    }

    else
          res.redirect("/login");


	}
	
//这个函数用来添加两个session信息,
//一个是cookie，一个是userlist数组
function addsession(req,res){
	var email=req.body.email;
    console.log(email);
	if(email){

		req.session.email=email;
		if(!userlist[email]){

			userlist[email]={email:email,socket:null};
            //console.log(userlist[email].email+userlist[email].socket);
            usermodel.getUserInfo_return(email,function(rs){
                console.log(77777);
                res.send(200,{username:rs.username,signature:rs.signature});

            },function(){console.log("查询无此人");return;})

            }
		}
	}

app.get('/', check,usercontrol.index);
app.get('/login',showLogin);
app.get('/register',showRegister);
app.get('/home',showHome);
app.get('/GroupTalking',GroupTalking);
//获取个人信息 {youremail:xxxx}
app.get('/getinfo/:email',routes.getPersonalInfo);
app.post('/login',routes.login,addsession);
app.post('/register',routes.register,usercontrol.copyDefaultHead,addsession);
app.post('/addfriend',addFriend_control);
app.post('/deletefriend',deleteFriend_control);
app.post('/getOnlineList',getOnlinelist_control);
app.post('/createRoom',createRoom);
app.post('/joinRoom',checkJoin);
app.post('/upload',usercontrol.uploadHead);
app.post('/modify',usercontrol.modify);
function showLogin(req,res){
    res.render('login');
}
function showRegister(req,res){
    res.render('register');
}
function showHome(req,res){
    res.render('frame');
}
function GroupTalking(req,res){

    var email=req.session.email;
    var roomid=req.query.id;

    console.log('GroupTalking: '+email+roomid);
    if(roomid==null||(!io.checkRoomid(roomid))){
        res.send(200,"你访问的房间不存在。");
    }
    else if(!io.checkRoomidAndClient(roomid,userlist[email].socket.id)){
        res.send(200,"你没被邀请。");
    }
    else{
        usermodel.getListInfo(roomlist[roomid],function(rs){
            res.render('GroupTalking',{friends:rs});
        })

    }
}
function addFriend_control(req,res){
    var youremail=req.body.youremail;
    var myemail=req.body.myemail;
   // var socket=userlist[youremail].socket;
   // console.log(5555);
    usermodel.addFriend_model(req.body.myemail,req.body.youremail,function(){
        console.log(6666);
        if(userlist[youremail]){if(userlist[youremail].socket){
           usermodel.getUserInfo_return(myemail,function(rs){
                userlist[youremail].socket.emit('system',{handle:1,email:rs.email,username:rs.username,signature:rs.signature});
            })
        }}
        else{
            textmodel.addFriendRemind(youremail,myemail);
        }
        var array=usermodel.getUserInfo_return(youremail,function(rs){
            console.log(77777);
            res.send(200,{email:rs.email,username:rs.username,signature:rs.signature});

        })

    },function(){
        res.send(200,{email:youremail,username:null,signature:null})
        //res.send()
    })
}


function deleteFriend_control(req,res){
    var youremail=req.body.youremail;
    var myemail=req.body.myemail;

      usermodel.deleteFriend_model(myemail,youremail,function(){
        if(userlist[youremail]){
        if(userlist[youremail].socket){
                usermodel.getUserInfo_return(myemail,function(rs){
                userlist[youremail].socket.emit('deletedfriend',rs.email,rs.username,rs.signature);
            })
        }}
        usermodel.getUserInfo_return(youremail,function(rs){
            res.send(200,{email:rs.email,username:rs.username,signature:rs.signature});

        })

    },function(){
        res.send(200,{email:youremail,username:null,signature:null})
        //res.send()
    })
}
//email:xxxx
function getOnlinelist_control(req,res){
    var fromemail = req.body.email;
    //console.log(fromemail+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var resr=new Array();
    usermodel.getUserFriends(fromemail,function(rs){
        var friendlength = rs.length;
        for(var i=0;i<friendlength;i++){
            //console.log(rs[i].email+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            if(userlist[rs[i].email]&&userlist[rs[i].email].socket){
                resr.push({
                    email:rs[i].email,
                    username:rs[i].username
                });}
        }
        res.send(200,resr);
    })
}
//email:xxxx数组
function createRoom(req,res){
   var emails=req.body.email;
   var username=null;
    roomlist[emails[0]]=emails;
   usermodel.getUserInfo_return(emails[0],function(rs){
       username = rs.username;
       var myDate = new Date();
       myDate.getSeconds;
       var room=emails[0];
       for(var i=0; i<emails.length-1; i++){
           userlist[emails[i+1]].socket.emit('system',{fromemail:emails[0],username:username,handle:3,id:room});
           userlist[emails[i+1]].socket.join(room);
       }
       userlist[emails[0]].socket.join(room);
       res.send(200,{id:room});
   })


}
//获得email:xxxx和room:xxxx
function checkJoin(req,res){
    var email=req.body.email;
    res.send(200,{permission:1});
    if(userlist[email].socket.rooms[req.body.room])
        res.send(200,{permission:1});
    else
        res.send(200,{permission:0});
}


//mainWindowControl.init(window.localStorage.getItem("email"),window.localStorage.getItem("username"),window.localStorage.getItem("signature"),headBaseUrl,headType);
