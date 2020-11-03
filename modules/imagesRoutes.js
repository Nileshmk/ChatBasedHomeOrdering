var userSchema = require("../models/userSchema");
var orderSummarySchema = require("../models/OrderSummary");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectID;

// storage function
const fs = require('fs');
const path = require('path');

function UploadImage(call, callback){
  var myBuffer = [];
  let writable = fs.createWriteStream("image.jpg");
    call.on('data', function(image){
      console.log(image)
      writable.write(image.data);
      t = JSON.parse(JSON.stringify(image));
      // myBuffer.push(t.data);
    });

    call.on('end',function(){
      console.log(myBuffer);
      writable.end();
      callback(null,{"id":"1","size":3})
    });
}

module.exports = {UploadImage};

