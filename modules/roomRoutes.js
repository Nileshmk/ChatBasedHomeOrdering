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

function placeOrder(call, callback){
    const {storeid, userid,timeslotid,order} = call.request;
    console.log(order);
    const { orderid, usercontact,userAddress,timestamp , products, itemSubtotal,GST,delCharges,serviceCharges, TotalAmount, allocationid,orderType,starttime,endtime } =  order;
    try{
        userSchema.findOne({_id:userid},async(err,userResult)=>{
            if(err) throw err;
            if(userResult){
                await roomSchema.findOne({userid:userid,storeid:storeid},async(err,roomResult)=>{
                    if(err) throw err;
                    if(roomResult){
                        var orderModel = {
                            orderid : new ObjectId(),
                            usercontact: usercontact,
                            userAddress: userAddress,
                            timestamp: new Date(),
                            products: products,
                            itemSubtotal : itemSubtotal,
                            GST: GST,
                            delCharges: delCharges,
                            serviceCharges: serviceCharges,
                            TotalAmount: TotalAmount,
                            allocationid: allocationid,
                            orderType: orderType,
                            starttime: starttime,
                            endtime:endtime,
                            userlist:[roomResult.orders[0].userlist[0],roomResult.orders[0].userlist[1]],
                            messages:[{
                                timestamp: new Date(),
                                messageid:roomResult.lastMessageId+1,
                                message:"Your Order has been Placed",
                                messagetype:"info",
                                userid:userid,
                                firstName:userResult.firstname,
                                lastName:userResult.lastname,
                                orderstatuscode:201,
                                profilePicUrl:userResult.profileUrl,
                                senderUserType:"customer"
                            }],
                            colorCode: getColor()
                        };
                        roomResult.lastMessageId = roomResult.lastMessageId+1;
                        roomResult.orders.push(orderModel);
                        var tempo = await roomResult.save();
                        if(tempo===roomResult){
                            await allocationSchema.findOne({_id:allocationid},async(err,allocationResult)=>{
                                console.log(allocationResult);
                                var r = await jsonQuery("timeslots[timeslotid="+timeslotid+"]", {data: allocationResult}).value;
                                console.log(r);
                                if(r!=null && r.perSlotBookingNumber>0){
                                    r.perSlotBookingNumber = r.perSlotBookingNumber-1;
                                    await allocationResult.save();
                                    await storeProductsSchema.findOne({storeid:storeid},async(err,storeResult)=>{
                                        if(err) throw err;
                                        if(storeResult){
                                            sendFcm(roomResult.orders[0].userlist[1].firebaseuserid,"updated",(err,result)=>{
                                                if(err) throw err;
                                                let msg={
                                                    messageid:roomResult.lastMessageId,
                                                    roomId:roomResult.roomId,
                                                    optionsVersion:storeResult.optionsVersion,  
                                                    storeid:storeResult.storeid, 
                                                    storeName:storeResult.storeName,
                                                    storetype:storeResult.storeCategory,
                                                    storeLogoUrl:storeResult.storeLogoUrl,
                                                    orderid:orderModel.orderid,
                                                    userid:userid,
                                                    orderstatuscode:201,
                                                    message:"Your Order has been Placed",
                                                    messagetype:"info",
                                                    timestamp: roomResult.orders[roomResult.orders.length-1].messages[0].timestamp.toISOString(),
                                                    firstName:userResult.firstname,
                                                    lastName:userResult.lastname,
                                                    profilePicUrl:userResult.profileUrl,
                                                    orderType:orderModel.orderType,
                                                    orderEnd:orderModel.endtime,
                                                    senderUserType:"customer",
                                                    colorCode:orderModel.colorCode
                                                };
                                                console.log(msg);
                                                return callback(null,msg);   
                                            });   
                                        }
                                        else{
                                        return callback({code: grpc.status.NOT_FOUND,details: 'store not found'});
                                        }
                                    })
                                }
                                else{
                                    roomResult.orders.pop();
                                    let tempo = await roomResult.save();
                                    if(tempo===roomResult){
                                        return callback({code: grpc.status.NOT_FOUND,details: 'empty slot'});
                                    }
                                    else{
                                        return callback({code: grpc.status.NOT_FOUND,details: 'server error'});
                                    }
                                }
                            });
                        }
                        else{
                            return callback({code: grpc.status.NOT_FOUND,details: 'server error'});
                        }
                    }
                    else{
                        await storeProductsSchema.findOne({storeid:storeid},async(err,storeResult)=>{
                            if(err) throw err;
                            if(storeResult){
                                await employeeSchema.findOne({storeid:storeid,"userType.manager":true},async(err,managerResult)=>{
                                    if(err) throw err;
                                    if(managerResult){
                                        var temp = new ObjectId();
                                        var orderModel = new roomSchema({
                                            roomId: temp,
                                            storeid: storeResult.storeid,
                                            userid: userResult._id,
                                            orders:[{
                                                orderid:new ObjectId(), 
                                                usercontact: usercontact,
                                                userAddress: userAddress,
                                                timestamp: new Date(),
                                                products: products,
                                                itemSubtotal : itemSubtotal,
                                                GST: GST,
                                                delCharges: delCharges,
                                                serviceCharges: serviceCharges,
                                                TotalAmount: TotalAmount,
                                                allocationid: allocationid,
                                                orderType: orderType,
                                                starttime: starttime,
                                                endtime:starttime,
                                                userlist:[{
                                                    id:userResult._id,
                                                    firebaseuserid:userResult.firebaseuserid
                                                },{
                                                    id:managerResult._id,
                                                    firebaseuserid:managerResult.firebaseuserid
                                                }],
                                                messages:[{
                                                    timestamp: new Date(),
                                                    messageid:1,
                                                    message:"Your Order has been Placed",
                                                    messagetype:"info",

                                                    userid:userid,
                                                    firstName:userResult.firstname,
                                                    lastName:userResult.lastname,
                                                    orderstatuscode:201,
                                                    profilePicUrl:userResult.profileUrl,
                                                    senderUserType:"customer"
                                                }],
                                                colorCode:getColor()
                                            }],
                                            lastMessageId:1
                                        });
                                        ordersave = await orderModel.save();
                                        if(ordersave===orderModel){
                                            await allocationSchema.findOne({_id:allocationid},async(err,allocationResult)=>{
                                                console.log(allocationResult);
                                                var r = await jsonQuery("timeslots[timeslotid="+timeslotid+"]", {data: allocationResult}).value;
                                                console.log(r);
                                                if(r!=null && r.perSlotBookingNumber>0){
                                                    r.perSlotBookingNumber = r.perSlotBookingNumber-1;
                                                    await allocationResult.save();
                                                    sendFcm(ordersave.orders[0].userlist[1].firebaseuserid,"updated",(err,result)=>{
                                                        if(err) throw err;
                                                        console.log(ordersave.orders[0].messages[0].timestamp);
                                                        console.log(ordersave.orders[0].messages[0].timestamp.toISOString());
                                                        let msg={
                                                            messageid:1,
                                                            roomId:temp,
                                                            optionsVersion:storeResult.optionsVersion,  
                                                            storeid:storeResult.storeid, 
                                                            storeName:storeResult.storeName,
                                                            storetype:storeResult.storeCategory,
                                                            storeLogoUrl:storeResult.storeLogoUrl,
                                                            orderid:ordersave.orders[0].orderid,
                                                            userid:userid,
                                                            orderstatuscode:201,
                                                            message:"Your Order has been Placed",
                                                            messagetype:"info",
                                                            timestamp: ordersave.orders[0].messages[0].timestamp.toISOString(),
                                                            firstName:userResult.firstname,
                                                            lastName:userResult.lastname,
                                                            profilePicUrl:userResult.profileUrl,
                                                            orderType:ordersave.orders[0].orderType,
                                                            orderEnd:ordersave.orders[0].endtime,
                                                            senderUserType:"customer",
                                                            colorCode:ordersave.orders[0].colorCode
                                                        };
                                                        return callback(null,msg);    
                                                    });
                                                    // return callback(null,{message :"success","response_code":200});   
                                                }
                                                else{
                                                    await orderSchema.deleteOne({roomId:temp});
                                                    return callback({code: grpc.status.NOT_FOUND,details: 'empty time slot'});
                                                }
                                            });
                                        }
                                        else{
                                            return callback({code: grpc.status.NOT_FOUND,details: 'server error'});
                                        }
                                    }
                                    else{
                                        return callback({code: grpc.status.NOT_FOUND,details: 'manager not found'});
                                    }
                                });
                                
                            }
                            else{
                                return callback({code: grpc.status.NOT_FOUND,details: 'store not found'});
                            }
                        });
                    }
                });
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

function getColor(){
    var letters = "0123456789abcdef"; 
    // "0xfff06292"
    // html color code starts with # 
    var color = '0x'; 
  
    // generating 6 times as HTML color code consist 
    // of 6 letter or digits 
    for (var i = 0; i < 8; i++) 
       color += letters[(Math.floor(Math.random() * 16))]; 
    return color;
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

module.exports = {placeOrder};
