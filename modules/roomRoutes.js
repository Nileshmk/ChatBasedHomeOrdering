var userSchema = require("../models/userSchema");
// var otpSchema = require("../models/otpSchema");
// var chatOptionSchema = require("../models/chatSchema");
var orderSummarySchema = require("../models/OrderSummary");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectID;

function placeOrder(call, callback){
    const { orderid, usercontact,userAddress,timestamp , products, itemSubtotal,GST,delCharges,serviceCharges, TotalAmount, allocationid,orderType,starttime,endtime } =  call.request;
    const storeid = orderid;
    const userid = timestamp;
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
                    userlist:[roomResult.orders[0].userlist[0],orders[0].userlist[1]],
                    messages:[]
                };
                roomResult.order.push(orderModel);
                order = await orderModel.save();
                if(order===orderModel){
                    return callback(null,{message :"success","response_code":200});   
                }
                else{
                    return callback(null,{ message : "some error in backend", "response_code" : 405 });
                }
            }
            else{
                await storeProductsSchema.findOne({storeid:storeid},async(err,storeResult)=>{
                    if(err) throw err;
                    if(storeResult){
                        await userSchema.findOne({_id:userid},async(err,userResult)=>{
                            if(err) throw err;
                            if(userResult){
                                await employeeSchema.findOne({storeid:storeid,userType:{admin:false}},async(err,managerResult)=>{
                                    if(err) throw err;
                                    if(managerResult){
                                        let temp1 = new ObjectId();
                                        var orderModel = new orderSchema({
                                            roomID: new ObjectId(),
                                            storeid: storeResult.storeid,
                                            userid: userResult._id,
                                            order:[{
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
                                                messages:[]
                                            }]
                                        });
                                        order = await orderModel.save();
                                        if(order===orderModel){
                                            return callback(null,{message :"success","response_code":200});   
                                        }
                                        else{
                                            return callback(null,{ message : "some error in backend", "response_code" : 405 });
                                        }
                                    }
                                    else{
                                        return callback(null,{ message : "can't find manager", "response_code" : 404 });
                                    }
                                });
                            }
                            else{
                                return callback(null,{ message : "can't find userid", "response_code" : 404 });
                            }
                        });
                    }
                    else{
                        return callback(null,{ message : "can't find store", "response_code" : 404 });
                    }
                });
            }
        })
        
    }
    catch(err){
        let msg = {
            message:"success",
            code:200
        };
        
        return callback(null,{ message : "Error", "response_code" : 404 });
    }
}

module.exports = {placeOrder};