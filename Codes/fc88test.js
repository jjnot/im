/**
 * Created by fcl on 13-11-28.
 */

var dbURL = 'mongodb://222.201.132.52/im/';
var db = require('mongoose').connect(dbURL);

var chatRec= require('./models/text').chatRec;
var offMsg=  require('./models/text').offMsg;
var textModel=require('./routes/textModel');



var app=require('express').createServer();
app.listen(3000);

//textModel.storeOfflineMessage("lalala","from@email.com","to@email.com","月黑风高");
textModel.getFriendRemind_model("to@email.com",function(array){
    console.log('get system message success!');
    console.log(array);
} ,function(array){

    console.log('get system message failed!');

});



//user.update({"email":"280171478@qq.com"},{"$set":{"gender":"aaaeeeo@qq.com"}});

//offMsg.find({}, function(err, docs) {
//    if (err) {
//        return console.log("err");
//    }
//    console.log(docs);
//
//    var instance=new chatRec();
//    instance.fromEmail="12345@qq.com";
//    instance.toEmail="12345@qq.com";
//    instance.message="fsdsf";
//    instance.time="12345";

chatRec.find({"$or":[{toEmail:"aaaeeeo@qq.com"},{fromEmail:"aaaeeeo@qq.com"}]}).sort({_id:1}).exec(function(err,offArray){
        if (err) {
        return console.log("err");
       }

        console.log(offArray);
    })
        //,null,{sort:[['_id',1]]},
    //});

    //console.log(instance);
    //instance.save();
   // chatRec.create(instance,function(err){if(err){console.log(err)}});
    //instance=" {address: '浙江省宁波市',            age: 20,            birthday: '1993-03-10',            email: 'nzbnizebin@163.com',            gender: '男',            password: 'li0310',            photo: 'default.jpg',            school: '华南理工大学',            signature: '',            username: '正气长存',            friends: [ '280171478@qq.com', 'aaaeeeo@qq.com' ] }";
    //instance.save();
    //instance._id=sdf;
    /*
     instance.address=docs.address;
     instance.age=docs.age;
     instance.birthday=docs.birthday;
     instance.gender=docs.gender;
     instance.school=docs.school;
     instance.username=docs.username;
     instance.signature=docs.signature;
     instance.save();
     */

    //instance=docs;
   // instance.gender="男";
    //instance.friends=["nzb@qq.com","nzb@qq.com","d@ds.vom"];
    //instance.friends[0]="aaaeeeo@qq.com";
    //instance.friends[1]="aaaeeeo@qq.com";
    //instance.friends.splice(1,1);
   // instance.save();

    //console.log(instance);
    //console.log(arr);
    //console.log(arr.length);
    // console.log(instance.save());


//});