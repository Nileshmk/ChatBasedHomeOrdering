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
    const {orderid, products} = call.request;
    try{
        roomSchema.findOne({storeid:storeid,"orders.orderid":orderid},async(err,roomResult)=>{
            if(err) throw err;
            if(roomResult){
                var r = await jsonQuery("orders[orderid="+orderid+"]", {data: roomResult}).value;
                r.products = products;
                roomResult.save()
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
