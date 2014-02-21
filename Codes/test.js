
var dbURL = 'mongodb://222.201.132.52/im/Codes/test';
var db = require('mongoose').connect(dbURL);
var um= require('./routes/usermodel');

var user= require('./models/user');


var instance=new user();
var app=require('express').createServer();
app.listen(3000);


//user.update({"email":"280171478@qq.com"},{"$set":{"gender":"aaaeeeo@qq.com"}});

    user.findOne({email:"280171478@qq.com"}, function(err, docs) {
        if (err) {
            return console.log("err");
        }
        //instance.email="aafsaeeeo@qq.com"
        //instance.save();
        //user.create(instance,function(err){if(err){console.log("ERR!")}})
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
        docs=docs;
        docs.gender="男";
        //docs.friends.push("sdafasfasfsdf");
        //instance.friends=["nzb@qq.com","nzb@qq.com","d@ds.vom"];
        //instance.friends[0]="aaaeeeo@qq.com";
        //instance.friends[1]="aaaeeeo@qq.com";
        //instance.friends.splice(1,1);
        docs.save();
        um.deleteFriend_model('nzbnizebin@163.com',"280171478@qq.com");

        //console.log(docs);
        //console.log(arr);
        //console.log(arr.length);
       // console.log(instance.save());
        var crypto = require('crypto');
        var sha1 = crypto.createHash('sha1');
        sha1.update("123456");
        console.log(sha1.digest('hex'));

    });