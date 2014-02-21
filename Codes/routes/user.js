
var application = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
};
module.exports = User;

User.prototype.save = function save(callback) {
// 存入数据库的文档
    var user = {
        name: this.name,
        password: this.password
    };
    application.open(function(err, db) {
        if (err) {
            return callback(err);
        }
// 读取 users 集合
        db.collection('users', function(err, collection) {
            if (err) {
                application.close();
                return callback(err);
            }
// 为 name 属性添加索引
            collection.ensureIndex('name', {unique: true});
// 写入 user 文档
            collection.insert(user, {safe: true}, function(err, user) {
                application.close();
                callback(err, user);
            });
        });
    });
};

//登陆检查，阻塞，有返回

User.get = function get(username, callback) {
    application.open(function(err, db) {
        if (err) {
            return callback(err);
        }
// 读取 users 集合
        db.collection('users', function(err, collection) {
            if (err) {
                application.close();
                return callback(err);
            }
// 查找 name 属性为 username 的文档
            collection.findOne({name: username}, function(err, doc) {
                application.close();
                if (doc) {
// 封装文档为 User 对象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};


//成功为true，失败为false
exports.logincheck_return=function(email,password){}

//注册检查，阻塞，有返回
//成功为true,失败为false，主要检查邮箱名是否存在
//参数未填！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
exports.registercheck_return=function(){}
 
 
 
 
//获取用户个人信息，阻塞，有返回
exports.getUserInfo_return=function(email){}

//获取用户好友信息，阻塞，有返回
exports.getUserFriends_return=function(email){}


//获取用户个人信息，不阻塞，在调用success函数的时候传入参数
exports.getUserInfo=function(email,success,fail){}


//获取用户好友信息，不阻塞，在调用success函数的时候传入参数
exports.getUserFriends=function(email,success,fail){}


//添加好友，不阻塞
exports.addFriend=function(myemail,youremail,success,fail){}


//删除，不阻塞
exports.deleteFriend=function(myemail,youremail,success,fail){}

