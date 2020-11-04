var userSchema = require("../models/userSchema");
var orderSummarySchema = require("../models/OrderSummary");
const employeeSchema = require("../models/employeeSchema");
const roomSchema = require("../models/roomSchema");
const orderSchema = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectID;
const { v1: uuidv1 } = require('uuid');
// uuidv1();
// storage function
const fs = require('fs');
const path = require('path');

function UploadImage(call, callback){
  let writable = fs.createWriteStream(uuidv1()+".jpg");
  call.on('data', function(image){
    
    writable.write(image.data);
  });
  call.on('end',function(){
    writable.end();
    callback(null,{"id":"1","size":3})
  });
//   let makingImages = (writable)=>{
//     call.on('data', function(image){
//         writable.write(image.data);
//         // myBuffer.push(t.data);
//       });

//       call.on('end',function(){
//         writable.end();
//         callback(null,{"id":"1","size":3})
//       });
//   }

//   const directoryPath = path.join(__dirname, '../public', 'images');
//     fs.readdir(directoryPath, function (err, files) {
//       console.log(directoryPath)
//       if (files){
//         let fileName = './public/images/Image-' + (files.length+1)+'.jpg';
//         let writable = fs.createWriteStream(fileName);
//         makingImages(writable);
//       }
//       else{
//         let fileName = './public/images/Image-' + 1+'.jpg';
//         let writable = fs.createWriteStream(fileName);
//         makingImages(writable);
//       }
//     });
// }

module.exports = {UploadImage};

