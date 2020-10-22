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
                if(msg.orderstatuscode==206 || msg.orderstatuscode==209){ // removes user when his work is done like delievery and packing
                    // decrementing the taskAssigned
                    if(msg.orderstatuscode==206){
                        employeeResult = await employeeSchema.findOne({employeeid:msg.userid});
                        if(employeeResult){
                            employeeResult.taskAssigned["Packing"]=employeeResult.taskAssigned["Packing"]-1;
                            await employeeResult.save();
                        }
                    }
                    else{
                        employeeResult = await employeeSchema.findOne({employeeid:msg.userid});
                        if(employeeResult){
                            employeeResult.taskAssigned["Delivery"]=employeeResult.taskAssigned["Delivery"]-1;
                            await employeeResult.save();
                        }
                    }
                    // popping user from chat
                    r.userlist.pop();
                }
                if(msg.orderstatuscode==209 || msg.orderstatuscode==210 || msg.orderstatuscode == 211){ // disabling the messages
                    managerResult = await employeeSchema.findOne({storeid:roomResult.storeid,"userType.manager":true});
                    if(managerResult){
                        var temp = {
                            messageid: roomResult.lastMessageId+1,
                            userid:managerResult.employeeid,
                            orderstatuscode:999,
                            message: "Order Ended",
                            messagetype:"COMPLETE",
                            timestamp: timestamptemp,
                            firstName:managerResult.firstName,
                            lastName:managerResult.lastName,
                            profilePicUrl:managerResult.profileUrl
                        };
                        
                        // decrementing the work of manager
                        managerResult.taskAssigned["Manage"]=managerResult.taskAssigned["Manage"]-1;
                        await managerResult.save();

                        r.messages.push(temp);
                        roomResult.lastMessageId = roomResult.lastMessageId+1;
                        for(let mi=0;mi<r.messages.length-1;mi++){
                            r.messages[mi].visible = false;
                        }
                    }
                    else{
                        return callback({
                            code: 400,
                            message: "invalid input",
                            status: grpc.status.INTERNAL
                        })
                    }
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
                console.log(r.userlist)
                await sendFcmToUser(r.userlist,msg.userid,"updated");
                return; 
                // return callback(null,{ message : "some error in backend", "response_code" : 405 });
            }
            else{
                return callback({
                code: 400,
                message: "invalid input",
                status: grpc.status.INTERNAL
                })
            }
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
        }
        else{
            return callback({
            code: 400,
            message: "invalid input",
            status: grpc.status.INTERNAL
            })
            // return callback(null,{ message : "some error in backend", "response_code" : 405 });
        }
        
    }
    catch(err){
        console.log(err);
        return callback({
            code: 400,
            message: "invalid input",
            status: grpc.status.INTERNAL
            })
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
                                    if(roomResults[i].orders[j].messages[k].visible==false) continue; // if the messages are disable
                                    
                                    let msg =  JSON.parse(JSON.stringify(roomResults[i].orders[j].messages[k]));
                                    delete msg.visible;
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
        dictionary = {};
        for(let i = 0;i<updates.length;i++){
            dictionary[updates[i].roomId] = updates[i].lastMessageId;
        }
        const roomResults = await roomSchema.find({"orders.userlist.id":userid});
        for(let i = 0;i<roomResults.length;i++){
            // const roomResult = await roomSchema.findOne({roomId:updates[i].roomId});
            let roomResult = roomResults[i];
            let limit = 0;
            if(dictionary[roomResult.roomId] !== undefined ){
                limit = dictionary[roomResult.roomId];
            }
            const storeResult = await storeProductsSchema.findOne({storeid:roomResult.storeid});
            if(storeResult){
                for(let j = 0;j<roomResult.orders.length;j++){
                    let cas = false;
                    for(let k = 0;k<roomResult.orders[j].userlist.length;k++){
                        if(roomResults[i].orders[j].userlist[k].id==userid) cas = true;
                        // console.log(roomResult.orders[j].messages[k]);
                    }
                    console.log(cas);
                    if(cas){
                        for(let k = 0;k<roomResult.orders[j].messages.length;k++){
                            console.log(roomResult.orders[j].messages[k].messageid);
                            if(roomResult.orders[j].messages[k].messageid>limit){
                                if(roomResult.orders[j].messages[k].visible==false) continue; // if the messages are disable
                                
                                let msg =  JSON.parse(JSON.stringify(roomResult.orders[j].messages[k]));
                                delete msg.visible;
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

async function sendFcmToUser(userlist,userid,message){
    temp = new Object();
    for(let j = 0;j<userlist.length;j++){
        if(userlist[j].id in temp){

        }
        else{
            if(userlist[j].id!=userid){
                await sendFcm(userlist[j].firebaseuserid,message,(err,result)=>{
                    // if(err) throw err;
                    console.log(`${err} ${result}`)
                });
            }
            temp[userlist[j].id]=1;
        }
    }
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