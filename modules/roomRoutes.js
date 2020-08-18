var userSchema = require("../models/userSchema");
// var otpSchema = require("../models/otpSchema");
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
const color_code = ["0xffe57373",
    "0xfff06292",
    "0xffba68c8",
    "0xff9575cd",
    "0xff7986cb",
    "0xff64b5f6",
    "0xff4fc3f7",
    "0xff4dd0e1",
    "0xff4db6ac",
    "0xff81c784",
    "0xffaed581",
    "0xffff8a65",
    "0xffd4e157",
    "0xffffd54f",
    "0xffffb74d",
    "0xffa1887f",
    "0xff90a4ae"];
function placeOrder(call, callback){
    const {storeid, userid,timeslotid,order} = call.request;
    console.log(order);
    const { orderid, usercontact,userAddress,timestamp , products, itemSubtotal,GST,delCharges,serviceCharges, TotalAmount, allocationid,orderType,starttime,endtime } =  order;
    try{
        roomSchema.findOne({userid:userid,storeid:storeid},async(err,roomResult)=>{
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
                    messages:[],
                    color_code: color_code[roomResult.orders.length]
                };
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
                            // return callback(null,{message :"success","response_code":200});   
                            return callback(null,{message :"success","response_code":200});   
                        }
                        else{
                            roomResult.order.pop();
                            await orderModel.save();
                            callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                        }
                    });
                }
                else{
                    callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                }
            }
            else{
                await storeProductsSchema.findOne({storeid:storeid},async(err,storeResult)=>{
                    if(err) throw err;
                    if(storeResult){
                        await userSchema.findOne({_id:userid},async(err,userResult)=>{
                            if(err) throw err;
                            if(userResult){
                                await employeeSchema.findOne({storeid:storeid,"userType.manager":true},async(err,managerResult)=>{
                                    if(err) throw err;
                                    if(managerResult){
                                        var temp = new ObjectId();
                                        var orderModel = new roomSchema({
                                            roomID: temp,
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
                                                messages:[],
                                                color_code:color_code[0]
                                            }]
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
                                                    return callback(null,{message :"success","response_code":200});   
                                                }
                                                else{
                                                    await orderSchema.deleteOne({roomID:temp});
                                                    callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                                                }
                                            });
                                        }
                                        else{
                                            callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                                        }
                                    }
                                    else{
                                        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                                    }
                                });
                            }
                            else{
                                return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                            }
                        });
                    }
                    else{
                        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
                    }
                });
            }
        })
        
    }
    catch(err){
        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
    }
}

module.exports = {placeOrder};
