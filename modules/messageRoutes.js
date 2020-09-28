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

async function createMessage(call,callback){
    // roomid, orderid, userid, msg
    const  { roomId, orderid, msg } =  call.request;
    try{
        roomResult = await roomSchema.findOne({roomId:roomId});
        storeResult = await storeProductsSchema.findOne({storeid:roomResult.storeid});
        if(roomResult && storeResult){
            var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
            var rr =  await jsonQuery("userlist[id="+msg.userid+"]", {data: r}).value;
            if(rr!=null){
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
                    profilePicUrl:msg.profilePicUrl
                };
                r.messages.push(temp);
                roomResult.lastMessageId = roomResult.lastMessageId+1;
                if(msg.orderstatuscode==206 || msg.orderstatuscode==209){
                    r.userlist.pop();
                }
                await roomResult.save();
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
                    timestamp: timestamptemp.toISOString(),
                    firstName:msg.firstName,
                    lastName:msg.lastName,
                    profilePicUrl:msg.profilePicUrl,
                    orderType:r.orderType,
                    orderEnd:r.endtime,
                    userlist:r.userlist,
                    colorCode:r.colorCode
                }
                await callback(null,temp1);
                for(let j = 0;j<r.userlist.length;j++){
                    if(j!=i){
                        await sendFcm(r.userlist[j].firebaseuserid,"updated",(err,result)=>{
                            // if(err) throw err;
                        });
                    }
                }
                return; 
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
        
    }
    catch(err){
        return callback({
            code: grpc.status.NOT_FOUND,
            details: 'server error'
        });
    }
}

async function getAllMessages(call,callback){
        console.log("hello");
        const  {userid} =  call.request;
        const roomResults = await roomSchema.find({"orders.userlist.id":userid});
        if(roomResults.length!=0){
            for(let i = 0;i<roomResults.length;i++){
                // const numFruits = roomResults.map(roomResult => {
                    const storeResult = await storeProductsSchema.findOne({storeid:roomResults[i].storeid});
                    // console.log(result);
                    if(storeResult){
                        for(let j = 0;j<roomResults[i].orders.length;j++){
                            let cas = false;
                            for(let k = 0;k<roomResults[i].orders[j].userlist.length;k++){
                                if(roomResults[i].orders[j].userlist[k].id==userid) cas = true;
                                // console.log(roomResults[i].orders[j].messages[k]);
                            }
                            if(cas){
                                for(let k = 0;k<roomResults[i].orders[j].messages.length;k++){
                                    let msg =  JSON.parse(JSON.stringify(roomResults[i].orders[j].messages[k]));
                                    msg.roomId = roomResults[i].roomId;
                                    msg.orderid = roomResults[i].orders[j].orderid;
                                    msg.orderType = roomResults[i].orders[j].orderType;
                                    msg.orderEnd = roomResults[i].orders[j].endtime;
                                    msg.colorCode = roomResults[i].orders[j].colorCode;
                                    msg.optionsVersion=storeResult.optionsVersion;  
                                    msg.storeid=storeResult.storeid;
                                    msg.storeName=storeResult.storeName;
                                    msg.storetype=storeResult.storeCategory;
                                    msg.storeLogoUrl=storeResult.storeLogoUrl;
                                    msg.userlist = roomResults[i].orders[j].userlist;
                                    call.write(msg);
                                }
                            }
                        }
                    }
                // 	return numFruit
                //   })
                //   console.log(numFruits);
                // async function kada(){
                // }
                // await kada();
            }
            // _.each(roomResults,async (roomResult)=>{
            // 	await storeProductsSchema.findOne({storeid:roomResult.storeid},(err,storeResult)=>{
            // 		if(err) throw err;
            // 		if(storeResult){
            // 			_.each(roomResult.orders,(order)=>{
            // 				_.each(order.userlist,(user)=>{
            // 					if(user.id==userid){
            // 						_.each(order.messages, async(message)=>{
            // 							let msg =  await JSON.parse(JSON.stringify(message));
            // 							msg.roomId = roomResult.roomId;
            // 							msg.orderid = order.orderid;
            // 							msg.orderType = order.orderType;
            // 							msg.orderEnd = order.endtime;
            // 							msg.colorCode = order.colorCode;
            // 							msg.optionsVersion=storeResult.optionsVersion;  
            // 							msg.storeid=storeResult.storeid;
            // 							msg.storeName=storeResult.storeName;
            // 							msg.storetype=storeResult.storeCategory;
            // 							msg.storeLogoUrl=storeResult.storeLogoUrl;
            // 							await console.log(msg);
            // 							// console.lo(msg);
            // 						})
            // 					}
            // 				});   
            // 			});
            // 		} 
            // 	})   
            // });
        }
        console.log("end");
        call.end();
}

async function getRecentMessageUpdate(call,callback){
    console.log("hello");
    const  { userid, updates } =  call.request;
    if(updates.length!=0){
        for(let i = 0;i<updates.length;i++){
            const roomResult = await roomSchema.findOne({roomId:updates[i].roomId});
            const storeResult = await storeProductsSchema.findOne({storeid:roomResult.storeid});
            if(storeResult){
                for(let j = 0;j<roomResult.orders.length;j++){
                    let cas = false;
                    for(let k = 0;k<roomResult.orders[j].userlist.length;k++){
                        if(roomResult.orders[j].userlist[k].id==userid) cas = true;
                        // console.log(roomResult.orders[j].messages[k]);
                    }
                    console.log(cas);
                    if(cas){
                        for(let k = 0;k<roomResult.orders[j].messages.length;k++){
                            console.log(roomResult.orders[j].messages[k].messageid);
                            if(roomResult.orders[j].messages[k].messageid>updates[i].lastMessageId){
                                let msg =  JSON.parse(JSON.stringify(roomResult.orders[j].messages[k]));
                                msg.roomId = roomResult.roomId;
                                msg.orderid = roomResult.orders[j].orderid;
                                msg.orderType = roomResult.orders[j].orderType;
                                msg.orderEnd = roomResult.orders[j].endtime;
                                msg.colorCode = roomResult.orders[j].colorCode;
                                msg.userlist = roomResult.orders[j].userlist;
                                msg.optionsVersion=storeResult.optionsVersion;  
                                msg.storeid=storeResult.storeid;
                                msg.storeName=storeResult.storeName;
                                msg.storetype=storeResult.storeCategory;
                                msg.storeLogoUrl=storeResult.storeLogoUrl;
                                msg.unread=false;
                                console.log(msg);
                                call.write(msg);
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("end");
    call.end();
}

function sendFcm(token,box,callback){
    if(token==null){
    return callback(error,null);
  }
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