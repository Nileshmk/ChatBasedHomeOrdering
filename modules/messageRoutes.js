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
const storeProductsSchema = require('../models/storeProductsSchema');
const _ = require('lodash');

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
                            timestamptemp = new Date();
                            var temp = {
                                messageid: roomResult.lastMessageId+1,
                                userid:msg.userid,
                                orderstatuscode:msg.orderstatuscode,
                                message: msg.message,
                                messagetype:msg.messagetype,
                                timestamp: timestamptemp,
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
                            storeProductsSchema.findOne({storeid:roomResult.storeid},async(err,storeResult)=>{
                                if(err) throw err;
                                if(storeResult){
                                    var temp1 = {
                                        messageid:roomResult.lastMessageId,
                                        roomId:roomResult.roomId,
                                        optionsVersion:storeResult.optionsVersion,  
                                        storeid:storeResult.storeid, 
                                        storeName:storeResult.storeName,
                                        storetype:storeResult.storeCategory,
                                        storeLogoUrl:storeResult.storeLogoUrl,
                                        orderid:orderid,
                                        userid:msg.userid,
                                        orderstatuscode:msg.orderstatuscode,
                                        message:msg.message,
                                        messagetype:msg.messagetype,
                                        timestamp: timestamptemp,
                                        firstName:msg.firstName,
                                        lastName:msg.lastName,
                                        profilePicUrl:msg.profileUrl,
                                        orderType:r.orderType,
                                        orderEnd:r.endtime,
                                        senderUserType:msg.senderUserType,
                                        colorCode:r.colorCode
                                    }
                                    return callback(null,temp1);
                                }
                                else{
                                    return callback({
                                        code: grpc.status.NOT_FOUND,
                                        details: 'store not found'
                                    });                
                                }
                            });
                        }
                    }
                    // return callback(null,{ message : "some error in backend", "response_code" : 405 });
                }
                else{
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: 'order not found'
                    });
                }
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
            else{
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: 'room not found'
                });
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
        });
    }
    catch(err){
        return callback({
            code: grpc.status.NOT_FOUND,
            details: 'server error'
        });
    }
}

function getAllMessages(call,callback){
    const  {userid} =  call.request;
    try{
        roomSchema.find({"orders.userlist.id":userid},async(err,roomResults)=>{
            if(err) throw err;
            if(roomResults.length!=0){
                for(let i = 0;i<roomResults.length;i++){
                    roomResult = roomResults[i];
                    await storeProductsSchema.findOne({storeid:roomResult.storeid},async(err,storeResult)=>{
                        if(err) throw err;
                        if(storeResult){
                            for(let j = 0;j<roomResult.orders.length;j++){
                                let cas = false;
                                for(let k = 0;k<roomResult.orders[j].userlist.length;k++){
                                    if(roomResult.orders[j].userlist[k].id==userid){
                                        cas = true;
                                        break;
                                    }
                                }
                                console.log(cas);
                                if(cas){
                                    for(let k = 0;k<roomResult.orders[j].messages.length;k++){
                                        let msg = JSON.parse(JSON.stringify(roomResult.orders[j].messages[k]));
                                        msg.roomId = roomResult.roomId;
                                        msg.orderid = roomResult.orders[j].orderid;
                                        msg.orderType = roomResult.orders[j].orderType;
                                        msg.orderEnd = roomResult.orders[j].endtime;
                                        msg.colorCode = roomResult.orders[j].colorCode;
                                        msg.optionsVersion=storeResult.optionsVersion;  
                                        msg.storeid=storeResult.storeid;
                                        msg.storeName=storeResult.storeName;
                                        msg.storetype=storeResult.storeCategory;
                                        msg.storeLogoUrl=storeResult.storeLogoUrl;
                                        console.log(msg);
                                        await call.write(msg);
                                    }
                                }
                            }
                        }   
                        else{
                            return call.end();
                        } 
                    })
                    if(i==(roomResults.length-1)){
                        console.log("came to end");
                        return call.end();
                    }   
                }
            }
            else{
                return call.end();
            }
        });
    }
    catch(err){
        return call.end();
    }
}

async function getRecentMessageUpdate(call,callback){
    const  { userid, updates } =  call.request;
    try{
        _.each(updates, async function (update) {
            console.log(update);
            await roomSchema.findOne({roomId:update.roomId},async (err,roomResult)=>{
                if(err) throw err; 
                if(roomResult){
                    await storeProductsSchema.findOne({storeid:roomResult.storeid},async (err,storeResult)=>{
                        if(err) throw err;
                        if(storeResult){
                            _.each(roomResult.orders, function (order) {
                                _.each(order.userlist, function (user) {
                                    if(user.id==userid){
                                        console.log("done");
                                        _.each(order.messages, function (message) {
                                            if(message.messageid>update.lastMessageId){
                                                let msg = JSON.parse(JSON.stringify(message));
                                                msg.roomId = roomResult.roomId;
                                                msg.orderid = order.orderid;
                                                msg.orderType = order.orderType;
                                                msg.orderEnd = order.endtime;
                                                msg.colorCode = order.colorCode;
                                                msg.optionsVersion=storeResult.optionsVersion;  
                                                msg.storeid=storeResult.storeid;
                                                msg.storeName=storeResult.storeName;
                                                msg.storetype=storeResult.storeCategory;
                                                msg.storeLogoUrl=storeResult.storeLogoUrl;
                                                console.log(msg);
                                                call.write(msg);
                                            }
                                        })
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
        call.end();
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