/**
 * Created by fcl on 13-11-27.
 */

var mongoose = require('mongoose');


var recSchema = new mongoose.Schema({
    fromEmail: {type : String, required:true },
    toEmail: {type : String, required:true },
    message: { type : String },
    time: { type : String ,default: Date.now().toString() }
});


var chatRec = mongoose.model('chatrec', recSchema);


//var chatRec = mongoose.model('chatRec', recSchema);

exports.chatRec= chatRec;

var msgSchema = new mongoose.Schema({
    fromEmail: {type : String, required:true },
    toEmail: {type : String, required:true },
    message: { type : String },
    time: { type : String ,default: Date.now().toString() }
});

var offMsg = mongoose.model('offmsg', msgSchema);

exports.offMsg= offMsg;

var sysMsgSchema = new mongoose.Schema({
    myEmail: {type : String, required:true },
    yourEmail: {type : String, required:true },
    type: { type : String },
    time: { type : String ,default: Date.now().toString() }
});

var sysMsg = mongoose.model('sysmsg', sysMsgSchema);

exports.sysMsg= sysMsg;