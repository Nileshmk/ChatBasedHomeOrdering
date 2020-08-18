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
    const  { roomID, orderid, userid, msg } =  call.request;
    try{
        roomSchema.findOne({roomID:roomID},(err,roomResult)=>{
            console.log(roomResult);
            if(err) throw err;
            if(roomResult){
                var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                if(r!=null){
                    for(let i = 0;i<r.userlist.length;i++){
                        if(r.userlist[i].id==userid){
                            var temp = {
                                timestamp: new Date(),
                                messageid: r.messages.length+1,
                                messageText: msg.messageText,
                                userid:msg.userid,
                                firstName:msg.firstName,
                                lastName:msg.lastName,
                                status_code:msg.status_code
                            };
                            // console.log(r.messages);
                            r.messages.push(temp);
                            // console.log(r.messages);
                            var roomModel = roomResult.save();
                            for(let j = 0;j<r.userlist.length;j++){
                                if(j!=i){
                                    // sendFcm(r.userlist[j].firebaseuserid,"updated",(err,result)=>{
                                    //     if(err) throw err;
                                    //     if(result==null){
                                    //         return callback({
                                    //             code: grpc.status.NOT_FOUND,
                                    //             details: 'Not found'
                                    //         });
                                    //     }
                                    // });
                                }
                            }
                            tt = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                            return callback(null,tt.messages[tt.messages.length-1]);
                        }
                    }
                    callback({
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

function receiveMessage(call,callback){
    const  { roomID, orderid, userid, msgIndex } =  call.request;
    try{
        roomSchema.findOne({roomID:roomID},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                var r = jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                if(r!=null){
                    for(let i = 0;i<r.userlist.length;i++){
                        if(r.userlist[i].id==userid){
                            for(let j = msgIndex;j<r.messages.length;j++){
                                await call.write(r.messages[j]);
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
    catch(err){
        call.end();
    }
}

function receiveOrder(call,callback){
    const  { userid, storeid } =  call.request;
    try{
        roomSchema.findOne({userid:userid,storeid},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                for(let i = 0;i<roomResult.orders.length;i++){
                    await call.write(roomResult.orders[i]);
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
    catch(err){
        call.end();
    }
}

function receiveAtStartup(call,callback){
    const  { roomID, storeid, userid, updateUpto } =  call.request;
    try{
        roomSchema.findOne({roomID:roomID},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                for(let i = 0;i<updateUpto.length;i++){
                    var r = jsonQuery("orders[orderid="+updateUpto[i].orderid+"]", {data: roomResult}).value;
                    if(updateUpto[i].index<r.messages.length){
                        for(let j = 0;j<r.messages.length;j++){
                            t = {
                                orderid:updateUpto[i].orderid,
                                message:r.messages[j]
                            }
                            await call.write(t);
                        }
                    }
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

module.exports = {createMessage,receiveMessage, receiveOrder};