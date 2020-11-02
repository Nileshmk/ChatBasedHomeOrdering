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
const timeslotSchema = require("../models/timeslotSchema");
const jsonQuery = require("json-query");
const grpc = require('grpc');

async function searchStore(call, callback){
    const {searchWord} = call.request;
    try{
        await storeProductsSchema.find({storeName:{ $regex: searchWord, $options: 'ix' }},'storeid storeName storeCategory storeAddress',async(err,storeResult)=>{
            if(err) console.log(err);
            if(storeResult.length!=0){
              let obj = [];
              for(let i = 0;i<storeResult.length;i++){
                let temp = JSON.parse(JSON.stringify(storeResult[i]));
                await timeslotSchema.find({storeid:storeResult[i].storeid,timeslottype:"Pickup"},async(err,timeslotResult)=>{
                  if(err) throw err;
                  if(timeslotResult.length>0){
                    let ca = true;
                    for(let j = 0;j<timeslotResult.length;j++){
                      if(timeslotResult[j].onOrOff==true){
                        ca = false;
                      }
                    }
                    if(ca == false){
                      temp["isPickup"] = true;
                    }
                    else{
                      temp["isPickup"] = false;
                    }
                  }
                  else{
                    temp["isPickup"] = false;
                  }
                  await timeslotSchema.find({storeid:storeResult[i].storeid,timeslottype:"Delivery"},async(err,timeslotResult)=>{
                    if(err) throw err;
                    if(timeslotResult.length>0){
                      let ca = true;
                      for(let j = 0;j<timeslotResult.length;j++){
                        if(timeslotResult[j].onOrOff==true){
                          ca = false;
                        }
                      }
                      if(ca == false){
                        temp["isDelivery"] = true;
                      }
                      else{
                        temp["isDelivery"] = false;
                      }
                    }
                    else{
                      temp["isDelivery"] = false;
                    }
                    obj.push(temp);
                    if(i==storeResult.length-1){
                      return callback(null,{"stores":obj});
                    }
                  });  
                });
              }
            }
            else{
                return callback(null,{"stores":[]});
            }
        })
    }
    catch(err){
        return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
    }
}

async function searchProduct(call, callback){
    const {searchWord} = call.request;
    try{
        await storeProductSchema.find({},async(err,result)=>{
          if(err) console.log(err);
          let arr = [];
          for(let i = 0;i<result.length;i++){
            var r = jsonQuery("storeProductCategories[*].subCategory[*].subCategoryProducts[*productName~/^chakki/i]", {data: result[i],allowRegexp:true}).value;
            console.log(r);
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

module.exports = {searchStore};
