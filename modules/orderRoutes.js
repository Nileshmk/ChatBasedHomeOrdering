var userSchema = require("../models/userSchema");
let app = require('../config/firebase');
// var chatOptionSchema = require("../models/chatSchema");
var orderSummarySchema = require("../models/OrderSummary");
var allocationSchema = require("../models/allocationSchema");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const storeProductsSchema = require("../models/storeProductsSchema");
const ObjectId = require("mongodb").ObjectID;
const jsonQuery = require("json-query");
const grpc = require('grpc');

function getOrder(call, callback){
    const {storeid, orderid} = call.request;
    try{
        roomSchema.findOne({storeid:storeid,"orders.orderid":orderid},"",async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                msg = {
                    "orderid": orderid,
                    "products": r.products,
                    "itemSubtotal":r.itemSubtotal,
                    "GST":r.GST,
                    "delCharges":r.delCharges,
                    "serviceCharges":r.serviceCharges,
                    "TotalAmount":r.TotalAmount
                }
                return callback(null,msg);
            }
            else{
                return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
            }
        });
    }
    catch(err){
        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
    }
}

function updateOrder(call, callback){
    const {orderid, products,itemSubtotal,GST,delCharges,serviceCharges,TotalAmount,msg} = call.request;
    console.log(products);
    console.log(orderid);
    try{
        roomSchema.findOne({"orders.orderid":orderid},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                r.products = products;
                r.itemSubtotal = itemSubtotal;
                r.GST = GST;
                r.delCharges = delCharges;
                r.serviceCharges = serviceCharges;
                r.TotalAmount = TotalAmount;
                var rr =  await jsonQuery("userlist[id="+msg.userid+"]", {data: r}).value;
                storeResult = await storeProductsSchema.findOne({storeid:roomResult.storeid});
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

function getOrderSummary(call, callback){
    const {storeid, orderid} = call.request;
    try{
        roomSchema.findOne({storeid:storeid,"orders.orderid":orderid},"",async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                delete r["messages"];
                console.log(r);
                return callback(null,r);
            }
            else{
                return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
            }
        });
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

module.exports = {getOrder,updateOrder,getOrderSummary};
