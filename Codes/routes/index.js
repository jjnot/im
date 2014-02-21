var usermodel = require('./usermodel');
//登陆处理，不用考虑session
exports.login=function(req,res,next){

	var email=req.body.email;
	var password=req.body.password;
   usermodel.logincheck_return(email,password,function(){next();},function(){res.render('login');});


	
	}
	
	
//注册处理，不用考虑session	
exports.register=function(req,res,next){
	
	//usermodel.registercheck_return();

    //var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    usermodel.registercheck_return(req,function(){
        //success
        next();
    },function(){
        //fail
    });

}
//{myemail:xxxx,youremail:xxxx}
//如果成功res.send(200)
exports.addFriend_control=function(req,res){
    usermodel.addFriend_model(req.body.myemail,req.body.youremail,function(){
        res.send(200);
    },function(){
        //res.send()
    })


}
//{myemail:xxxx,youremail:xxxx}
//如果成功res.send(200)
exports.deleteFriend_control=function(req,res){
    usermodel.deleteFriend_model(req.body.myemail,req.body.youremail,function(){
        res.send(200);
    },function(){
        //failed
    })

}
//{youremail:xxxx}

exports.getPersonalInfo=function(req,res){
    var email=req.params.email;
    usermodel.getUserInfoDetail(email,function(record){
        res.send(200,record);
    },function(){console.log('getUserInfoDetail fail')});



}