let app = require('../config/firebase');
const grpc = require('grpc');
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
    const  { roomId, orderid, userid, msg } =  call.request;
    try{
        roomSchema.findOne({roomId:roomId},(err,roomResult)=>{
            console.log(roomResult);
            if(err) throw err;
            if(roomResult){
                var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                if(r!=null){
                    for(let i = 0;i<r.userlist.length;i++){
                        if(r.userlist[i].id==userid){
                            var temp = {
                                messageid: roomResult.lastMessageId+1,
                                userid:msg.userid,
                                orderstatuscode:msg.orderstatuscode,
                                message: msg.message,
                                messagetype:msg.messagetype,
                                timestamp: new Date(),
                                firstName:msg.firstName,
                                lastName:msg.lastName,
                                profilePicUrl:msg.profilePicUrl,
                                senderUserType:msg.senderUserType
                            };
                            // console.log(r.messages);
                            r.messages.push(temp);
                            // console.log(r.messages);
                            roomResult.lastMessageId = roomResult.lastMessageId+1;
                            var roomModel = roomResult.save();
                            for(let j = 0;j<r.userlist.length;j++){
                                if(j!=i){
                                    sendFcm(r.userlist[j].firebaseuserid,"updated",(err,result)=>{
                                        if(err) throw err;
                                    });
                                }
                            }
                            
                            // tt = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                            return callback(null,temp);
                        }
                    }
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: 'Not found'
                    });
                    // return callback(null,{ message : "some error in backend", "response_code" : 405 });
                }
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'Not found'
                });
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
            else{
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'Not found'
                });
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
        });
    }
    catch(err){
        return callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        });
    }
}

function getAllMessages(call,callback){
    const  {userid} =  call.request;
    try{
        roomSchema.find({"orders.userlist.id":userid},async(err,roomResults)=>{
            if(err) throw err;
            for(let i = 0;i<roomResults.length;i++){
                roomResult = roomResults[i];
                for(let j = 0;j<roomResult.orders.length;j++){
                    let cas = false;
                    for(let k = 0;k<roomResult.orders[j].userlist.length;k++){
                        if(roomResult.orders[j].userlist[k].id==userid){
                            cas = true;
                        }
                    }
                    if(cas){
                        for(let k = 0;k<roomResult.orders[j].messages.length;k++){
                            let msg = JSON.parse(JSON.stringify(roomResult.orders[j].messages[k]));
                            msg.roomId = roomResult.roomId;
                            msg.orderid = roomResult.orders[j].orderid;
                            msg.orderType = roomResult.orders[j].orderType;
                            msg.orderEnd = roomResult.orders[j].endtime;
                            msg.colorCode = roomResult.orders[j].colorCode;
                            await call.write(msg);
                        }
                    }
                }
            }
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
        });
        return call.end();
    }
    catch(err){
        call.end();
    }
}

// function receiveOrder(call,callback){
//     const  { userid, storeid } =  call.request;
//     try{
//         roomSchema.findOne({userid:userid,storeid},async(err,roomResult)=>{
//             if(err) throw err;
//             if(roomResult){
//                 for(let i = 0;i<roomResult.orders.length;i++){
//                     await call.write(roomResult.orders[i]);
//                 }
//                 // return callback(null,{ message : "some error in backend", "response_code" : 405 });
//                 return call.end();
//             }
//             else{
//                 // return callback(null,{ message : "some error in backend", "response_code" : 405 });
//                 return call.end();
//             }
//         });
//     }
//     catch(err){
//         call.end();
//     }
// }

function getRecentMessageUpdate(call,callback){
    const  { userid, updates } =  call.request;
    try{
        for(let i = 0;i<updates.length;i++){
            roomSchema.findOne({roomId:updates[i].roomId},async(err,roomResult)=>{
                if(err) throw err;
                if(roomResult){
                    for(let j=0;j<roomResult.orders.length;j++){
                        let cas = false;
                        for(let k = 0;k<roomResult.orders[j].userlist.length;k++){
                            if(roomResult.orders[j].userlist[k]==userid) cas = true;
                        }
                        if(cas){
                            for(let k = 0;k<roomResult.orders[j].messages.length;k++){
                                if(roomResult.orders[j].messages[k].messageid>updates[i].lastMessageId){
                                    let msg = JSON.parse(JSON.stringify(roomResult.orders[j].messages[k]));
                                    msg.roomId = roomResult.roomId;
                                    msg.orderid = roomResult.orders[j].orderid;
                                    msg.orderType = roomResult.orders[j].orderType;
                                    msg.orderEnd = roomResult.orders[j].endtime;
                                    msg.colorCode = roomResult.orders[j].colorCode;
                                    await call.write(msg);
                                }
                            }
                        }
                    }
                }
                    // var r = jsonQuery("orders.messages", {data: result}).value;
                });
            }
        return call.end();
    }
    catch(err){
        call.end();
    }
}

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

module.exports = {createMessage,getAllMessages,getRecentMessageUpdate};