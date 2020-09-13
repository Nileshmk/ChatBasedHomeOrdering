var userSchema = require("../models/userSchema");
let app = require('../config/firebase');
// var chatOptionSchema = require("../models/chatSchema");
var orderSummarySchema = require("../models/OrderSummary");
var allocationSchema = require("../models/allocationSchema");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectID;
const storeProductsSchema = require("../models/storeProductsSchema");
const jsonQuery = require("json-query");
const grpc = require('grpc');

function getDutyEmployees(call, callback){
    const {storeid, Duty} = call.request;
    let temp = {storeid:storeid};
    if(Duty=="Pickup"){
        tt = "userType.packingHelper";
    }
    else{
        tt = "userType.delivery";
    }
    
    temp[tt] = true;
    console.log(temp);
    try{
        employeeSchema.find(temp,"employeeid firstName lastName onduty taskAssigned",async(err,employeesResult)=>{
            if(err) throw err;
            console.log(employeesResult);
            if(employeesResult.length!=0){
                return callback(null,{"employees":employeesResult});
            }
            else{
                return callback(null,{"employees":[]});
            }
        });
    }
    catch(err){
        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
    }
}

function assignEmployeeTask(call, callback){
    const {employeeid,orderid,storeid,job,msg} = call.request;
    try{
        roomSchema.findOne({storeid:storeid,"orders.orderid":orderid},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                await employeeSchema.findOne({storeid:storeid,employeeid:employeeid},async(err,employeeResult)=>{
                    if(err) throw err;
                    if(employeeResult){
                        employeeResult.taskAssigned[job]=employeeResult.taskAssigned[job]+1;
                        employeeResult.save();
                        var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                        r.userlist.push({
                            id:employeeResult.employeeid,
                            firebaseuserid:employeeResult.firebaseuserid,
                            userType:job
                        });
                        // for(let i = 0;i<r.userlist.length;i++){
                        //     if(r.userlist[i].firebaseuserid!=null){
                        //         await sendFcm(r.userlist[i].firebaseuserid,"updated",(err,result)=>{
                        //             // if(err) throw err;
                        //         });
                        //     }
                        // }
                        storeResult = await storeProductsSchema.findOne({storeid:roomResult.storeid});
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
                                if(r.userlist.id!=msg.userid){
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
                        // await roomResult.save();
                        // return callback(null,{message:"success",response_code:200});
                    }
                    else{
                        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                    }
                });
                await roomResult.save();
            }
            else{
                return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
            }
        })
    }
    catch(err){
        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
    }
}

function sendFcm(token,box,callback){
    if(token==null){
    return callback(error,null);
  }
    console.log(token);
    console.log(box);
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

module.exports = {getDutyEmployees,assignEmployeeTask};
