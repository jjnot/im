var mongoose = require('mongoose');

/*
var EmailSchema = new mongoose.Schema({
    email: String
});*/

var UserSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true },
    username: String,
    password: {type:String, required:true},
    gender: String,
    age: Number,
    birthday: String,
    school: String,
    address: String,
    signature: String,
    photo: String,
    friends: [String]

});

var user = mongoose.model('user', UserSchema);

module.exports = user;