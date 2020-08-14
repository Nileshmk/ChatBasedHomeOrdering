let app = require('../config/firebase');
var userSchema = require("../models/userSchema");
// var otpSchema = require("../models/otpSchema");
// var chatOptionSchema = require("../models/chatSchema");
var orderSummarySchema = require("../models/OrderSummary");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectID;
var jsonQuery = require('json-query');

function createMessage(call,callback){
    // roomid, orderid, userid, msg
    const  { roomid, orderid, userid, msg } =  call.request;
    roomSchema.findOne({roomID:roomID},(err,roomResult)=>{
        if(err) throw err;
        if(roomResult){
            var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
            if(r==null){
                for(let i = 0;i<r.userlist;i++){
                    if(r.userlist[i].id==userid){
                        r.messages.push(msg);
                        var roomModel = roomResult.save();
                        if(roomModel=== roomResult){
                            for(let j = 0;j<r.userlist;j++){
                                if(j!=i){
                                    sendFcm(r.userlist[i].firebaseuserid,"updated",(err,result)=>{
                                        if(err) throw err;
                                        if(result==null){
                                            return callback(null,{ message : "some error", "response_code" : 405 }); 
                                        }
                                    });
                                }
                            }
                            return callback(null,{ message : "success", "response_code" : 200 });            
                        }
                        else{
                            return callback(null,{ message : "some error in backend", "response_code" : 405 });            
                        }    
                        break;
                    }
                }
                return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
            return callback(null,{ message : "some error in backend", "response_code" : 405 });
        }
        else{
            return callback(null,{ message : "some error in backend", "response_code" : 405 });
        }
    });
}

function readMessageStream(call,callback){
    const  { roomid, orderid, userid, msgindex } =  call.request;
    roomSchema.findOne({roomID:roomID},(err,roomResult)=>{
        if(err) throw err;
        if(roomResult){
            var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
            if(r==null){
                for(let i = 0;i<r.userlist;i++){
                    if(r.userlist[i].id==userid){
                        for(let j = msgindex;j<r.mesages.length;j++){
                            call.write(r.messages[i]);
                        }
                        return call.end();
                    }
                }
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
                return call.end();
            }
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            return call.end();
        }
        else{
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            return call.end();
        }
    });
}

function readOrdersStream(call,callback){
    const  { roomid, orderid, userid, msgindex } =  call.request;
    roomSchema.findOne({roomID:roomID},(err,roomResult)=>{
        if(err) throw err;
        if(roomResult){
            var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
            if(r==null){
                for(let i = 0;i<r.userlist;i++){
                    if(r.userlist[i].id==userid){
                        for(let j = msgindex;j<r.mesages.length;j++){
                            call.write(r.messages[i]);
                        }
                        return call.end();
                    }
                }
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
                return call.end();
            }
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            return call.end();
        }
        else{
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            return call.end();
        }
    });
}

// function createMessage(call, callback){
//     try{
//         roomSchema.findOne({roomID:call.request.room.roomID},(err,result)=>{
//             if(err) throw err;
//             if(result){
//                 let msg = {
//                     timestamp: new Date(),
//                     messageid:result.messages.length+1,
//                     messageText:call.request.msg.messageText,
//                     userid:call.request.msg.userid,
//                     firstName:call.request.msg.firstName,
//                     lastName:call.request.msg.lastName
//                 }
//                 result.messages.push(msg);
//                 const store = result.save();
//                 sendFcm("fik_cGkcSX6hHyVsRfrp1L:APA91bGPzDTitWgj5jd697L8BgfB4melpitIP2YKTX0mh7NEhbOwE-QZ4XnIUy4XL7HIlqQ3jHtWkOyU1T2h1mMrrVl4uLkDtSCI5ml9klvwEHLWiEZjyknwXfxoxZI3-xO34aLotuJN","updated",(err,result)=>{
//                     if(err) throw err;
//                     if(result){
//                         callback(null,msg);
//                     }
//                     else{
//                         console.log("something problem");
//                     }
//                 });
//             }
//             else{
//                 throw new Error('Exception message');
//             }
//         });
//     }
//     catch(err){
//         let msg = {
//             timestamp: new Date(),
//             messageid:-1,
//             messageText:"hello",
//             userid:call.request.msg.userid,
//             firstName:call.request.msg.firstName,
//             lastName:call.request.msg.lastName
//         }
//         callback(null,msg);
//     }
// }

// function readMessageStream(call,callback){
//     try{
//         roomSchema.findOne({roomID:call.request.room.roomID},(err,result)=>{
//             if(err) throw err;
//             if(result){
//                 for(let i = call.request.index;i<result.messages.length;i++){
//                     console.log(result.messages[i]);
//                     call.write(result.messages[i]);
//                 }
//                 call.end();
//             }
//             else{
//                 throw new Error("roomNotFound");
//             }
//         });
//     }
//     catch(err){
//         let msg = {
//             timestamp: new Date(),
//             messageid:1,
//             messageText:"hello",
//             userid:"hello",
//             firstName:"hello",
//             lastName:"hello"
//         };
//         msgs = [];
//         msgs.push(msg);
//         msgs.forEach(t=> call.write(t));
//         call.end();
//     }
// }

// sending FCM request to one client

function sendFcm(token,box,callback){
    var registrationToken = token;
    var message = {
      data : {
          "message":box
        },
      token: registrationToken
    };
    app.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      return callback(null,response);
    })
    .catch((error) => {
       return callback(error,null);
      // console.log('Error sending message:', error);
    });
}

module.exports = {createMessage,readMessageStream};