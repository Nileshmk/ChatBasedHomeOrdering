var userSchema = require("../models/userSchema");
let app = require('../config/firebase');
// var chatOptionSchema = require("../models/chatSchema");
var orderSummarySchema = require("../models/OrderSummary");
var allocationSchema = require("../models/allocationSchema");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const optionSchema = require("../models/optionSchema");

const storeProductsSchema = require("../models/storeProductsSchema");
const ObjectId = require("mongodb").ObjectID;
const jsonQuery = require("json-query");
const grpc = require('grpc');

function getOptionVersion(call, callback){
    const {optionVersion,storetype} = call.request;
    try{
        optionSchema.findOne({optionVersion:optionVersion,storetype:storetype},async(err,optionResult)=>{
            if(err) throw err;
            if(optionResult){
                return callback(null,optionResult);
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

module.exports = {getOptionVersion};
