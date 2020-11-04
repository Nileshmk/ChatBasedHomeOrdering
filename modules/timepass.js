const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '../public', 'images');
    fs.readdir(directoryPath, function (err, files) {
      if (files){
        let writable = fs.createWriteStream('../public/images/Image-' + (files.length+1)+'.jpg');
      }
      else{
        let writable = fs.createWriteStream('../public/images/Image-' + 1+'.jpg');
      }
    });
// // // var randomColor = require('randomcolor'); // import the script
// // // k = (randomColor()+"ff").replace("#","0x");
// // // console.log(k)
// // let app = require('../config/firebase');
// // var allocationSchema = require("../models/allocationSchema");
// var roomSchema = require("../models/roomSchema");
// // var userSchema = require("../models/userSchema");
// var storeProductSchema = require("../models/storeProductsSchema");
// var employeeSchema = require("../models/employeeSchema");
// var timeslotSchema = require("../models/timeslotSchema");

// // var allocationSchema = require("../models/allocationSchema");
// // var optionSchema = require("../models/optionSchema");
// // const _ = require('lodash');
// // function sendFcm(token,box,callback){
// //     if(token==null){
// //     return callback(error,null);
// //   }
// //     var registrationToken = token;
// //     var message = {
// //       data : {
// //           "message":box
// //         },
// //       token: registrationToken
// //     };
// //     app.messaging().send(message)
// //     .then((response) => {
// // 		console.log(response);
// //       // Response is a message ID string.
// //       return callback(null,response);
// //     })
// //     .catch((error) => {
// //        return callback(error,null);
// //       // console.log('Error sending message:', error);
// //     });
// // }
// // sendFcm('dNC5l6P-Sqi6-sqKCGAk5a:APA91bEzeEPNQEKw0qq1vA3WrqIX1DZdQIw1pWEtaR60EKhTBhSdm-1U3Q-3CWX7mOyenVe3hPYBE81phDeelUNqm17010maRqZ3dQPlfm0uhm3UAnLKkgy7-g7-TH332xJ3RtERAAbK',"updated",(err,result)=>{
// // console.log(result);
// // })
// // // t = {
// // //   "optionsVersion":1,
// // //   "storetype":"GeneralAll",
// // //   "userRoles":["customer","manager","packing","delivery"],
// // //   "access": [
// // //     {
// // // 		"userRole":"Customer",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":204,
// // // 				"messagetype":"VIEWORDER",
// // // 				"optionName":"Review Order",
// // // 					"messagetype":"VIEWORDER",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Order issue has been resolved..",
// // // 					"newStatusCode":205,
// // // 					"messagetype":"VIEWORDER"
// // // 				}
// // // 			},
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"Manager",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":201,
// // // 				"optionName":"Accept",
// // // 				"messagetype":"INFO",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been accepted.",
// // // 					"newStatusCode":202,
// // // 					"messagetype":"ASSIGN"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":201,
// // // 				"optionName":"Reject",
// // // 				"messagetype":"INFO",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been rejected",
// // // 					"newStatusCode":210,
// // // 					"messagetype":"INFO"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":202,
// // // 				"optionName":"Assign Packing",
// // // 				"messagetype":"ASSIGN",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Packing Assigned to ",
// // // 					"newStatusCode":203,
// // // 					"messagetype":"VIEWORDER"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":206,
// // // 				"optionName":"Assign Delivery",
// // // 				"messagetype":"ASSIGN",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Delivery Assigned to ",
// // // 					"newStatusCode":207,
// // // 					"messagetype":"INFO"
// // // 				}
// // // 			},
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"Packing",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":203,
// // // 				"optionName":"Start Packing",
// // // 				"messagetype":"VIEWORDER",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Packing Completed with Issues",
// // // 					"newStatusCode":204,
// // // 					"messagetype":"VIEWORDER"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":205,
// // // 				"optionName":"Continue Packing",
// // // 				"messagetype":"VIEWORDER",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been packed without Issues..",
// // // 					"newStatusCode":206,
// // // 					"messagetype":"ASSIGN"
// // // 				}
// // // 			}
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"Delivery",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":207,
// // // 				"optionName":"Start Delivery",
// // // 				"messagetype":"INFO",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order is on its way",
// // // 					"newStatusCode":208,
// // // 					"messagetype":"INFO"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":208,
// // // 				"optionName":"Delivery Completed",
// // // 				"messagetype":"INFO",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Order delivery has been completed",
// // // 					"newStatusCode":209,
// // // 					"messagetype":"INFO"
// // // 				}
// // // 			}
// // // 		]
// // // 	},
// // // 	]	
// // // }

// // // model = new optionSchema(t);
// // // model.save();
// // // t = {
// // //   "optionsVersion":1,
// // //   "storetype":"GeneralAll",
// // //   "userRoles":["customer","manager","packing","delivery"],
// // //   "access": [
// // //     {
// // // 		"userRole":"customer",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":204,
// // // 				"optionName":"Review Order",
// // // 				"messagetype":"vieworder",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Order issue has been resolved..",
// // // 					"newStatusCode":205,
// // // 					"messagetype":"vieworder"
// // // 				}
// // // 			},
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"manager",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":201,
// // // 				"optionName":"Accept",
// // // 				"messagetype":"info",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been accepted.",
// // // 					"newStatusCode":202,
// // // 					"messagetype":"assign"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":201,
// // // 				"optionName":"Reject",
// // // 				"messagetype":"info",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been rejected",
// // // 					"newStatusCode":210,
// // // 					"messagetype":"info"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":202,
// // // 				"optionName":"Assign Packing",
// // // 				"messagetype":"assign",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Packing Assigned to ",
// // // 					"newStatusCode":203,
// // // 					"messagetype":"vieworder"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":206,
// // // 				"optionName":"Assign Delivery",
// // // 				"messagetype":"assign",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Delivery Assigned to ",
// // // 					"newStatusCode":207,
// // // 					"messagetype":"info"
// // // 				}
// // // 			},
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"packing",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":203,
// // // 				"optionName":"Start Packing",
// // // 				"messagetype":"vieworder",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Packing Completed with Issues",
// // // 					"newStatusCode":204,
// // // 					"messagetype":"vieworder"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":205,
// // // 				"optionName":"Continue Packing",
// // // 				"messagetype":"vieworder",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order has been packed without Issues..",
// // // 					"newStatusCode":206,
// // // 					"messagetype":"assign"
// // // 				}
// // // 			}
// // // 		]
// // // 	},
// // // 	{
// // // 		"userRole":"delivery",
// // // 		"belowOptions":
// // // 		[
// // // 			{
// // // 				"statusCode":207,
// // // 				"optionName":"Start Delivery",
// // // 				"messagetype":"info",
// // // 				"emojiUnicode":"0x1F60A",					
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Your Order is on its way",
// // // 					"newStatusCode":208,
// // // 					"messagetype":"info"
// // // 				}
// // // 			},
// // // 			{
// // // 				"statusCode":208,
// // // 				"optionName":"Delivery Completed",
// // // 				"messagetype":"info",
// // // 				"emojiUnicode":"0x1F60A",
// // // 				"optionBorderColor":"#000000",
// // // 				"toSend":
// // // 				{
// // // 					"message":"Order delivery has been completed",
// // // 					"newStatusCode":209,
// // // 					"messagetype":"info"
// // // 				}
// // // 			}
// // // 		]
// // // 	},
// // // 	]	
// // // }

// // // var fs = require('fs');
// const mongoose = require("mongoose");
// const keys = require("../config/keys");
// const jsonQuery = require("json-query");
// const storeProductsSchema = require("../models/storeProductsSchema");
// mongoose.connect(keys.mongodb.dbOrg, () => {
//     console.log("connected to mongodb..");
//     const storeid = "5ef1a64cc729500c79aa2db8";
//     searchWord = "kidney beans";
//     storeProductSchema.findOne({storeid:storeid},async(err,storeResult)=>{
//       if(err) console.log(err);
//       if(storeResult){
//         let regex = new RegExp(searchWord,'i');
//         for(let i = 0;i<storeResult.storeProductCategories.length;i++){
//           for(let j = 0;j<storeResult.storeProductCategories[i].subCategory.length;j++){
//             for(let k = 0;k<storeResult.storeProductCategories[i].subCategory[j].subCategoryProducts.length;k++){
//               if(regex.test(storeResult.storeProductCategories[i].subCategory[j].subCategoryProducts[k].productName)){
//                 let temp = {}
//                 temp.categoryName = storeResult.storeProductCategories[i].category;
//                 temp.subCategoryName = storeResult.storeProductCategories[i].subCategory[j].subCategoryName;
//                 temp.productName = storeResult.storeProductCategories[i].subCategory[j].subCategoryProducts[k].productName;
//                 temp.quantity = storeResult.storeProductCategories[i].subCategory[j].subCategoryProducts[k].qtyCategory.map(function(a) {return {"quantityName":a.quantity,"quantityId":a._id};});
//                 console.log(temp);
//             }
//             }
//           } 
//         }
//       }
//       else{
//         return callback({code: grpc.status.NOT_FOUND,details: 'Not found'});
//       }
//     });
//   },{ useFindAndModify: false });


// // // t = {
// // // 	taskAssigned:{
// // // 		Manage:0,
// // // 		Packing:0,
// // // 		Delivery:0
// // // 	}
// // // };
// // // // k = "Packing";
// // // // console.log(t.taskAssigned[k]);
// // // employeeSchema.find({},(err,result)=>{
// // // 	for(let i = 0;i<result.length;i++){
// // // 		result[i].taskAssigned = t.taskAssigned;
// // // 		result[i].save();
// // // 	}
// // // })
// // // // optionSchema.deleteMany({},(err,result)=>{
// // // // console.log("deleted");
// // // // let model = new optionSchema(t);
// // // // model.save();
// // // // });

// // // // optionSchema.find({},(err,result)=>{
// // // // 	console.log(result);
// // // // 	fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8',(err,result)=>{
// // // // 		console.log(result);
// // // // 	});
// // // // })

// // // // userSchema.find({},(err,result)=>{
// // // //     console.log(result);
// // // // });

// // // // employeeSchema.find({"userType.packingHelper": true},"employeeid firstName lastName onduty taskAssigned",(err,managerResult)=>{
// // // //     console.log(managerResult);
// // // // });
// // // // storeProductSchema.find({storeid:"5ef1a64cc729500c79aa2db8"},(err,result)=>{
// // // //         console.log(result);
// // // // })
// // // // allocationSchema.findOne({_id:"5f4a14e794100d0034347741"},(err,result)=>{
// // // //   console.log(result);
// // // //   result.timeslots[0].perSlotBookingNumber = 30;
// // // //   result.save();
// // // // })

// // // // roomSchema.find({},(err,result)=>{
// // // // //   if(err) throw err;
// // // //   console.log(result);
// // // //   	fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8',(err,result)=>{
// // // // 		console.log(result);
// // // // 	});
// // // // 	// fs.close();
// // // // });






// // // // console.log(getColor());
// // // // function getColor(){
// // // //   var letters = "0123456789abcdef"; 
// // // //   // "0xfff06292"
// // // //   // html color code starts with # 
// // // //   var color = '0x'; 

// // // //   // generating 6 times as HTML color code consist 
// // // //   // of 6 letter or digits 
// // // //   for (var i = 0; i < 8; i++) 
// // // //      color += letters[(Math.floor(Math.random() * 16))]; 
// // // //   return color;
// // // // }


// // // // updates = [ { roomId: '5f50eefe5a13385557da52fc', lastMessageId: 0 } ];


// // // // userSchema.find({},(err,result)=>{
// // // //     // var r = jsonQuery("timeslots[timeslotid="+"5f2593f37f505c0034b60c18"+"]", {data: result}).value;
// // // //     // console.log(r.perSlotBookingNumber);
// // // //     console.log(result);
// // // // });

// // // // storeProductsSchema.find({},(err,result)=>{
// // // // 	console.log(result);
// // // // 	result[0].optionsVersion = 1;
// // // // 	result[0].storeLogoUrl = null;
// // // // 	result[0].save();
// // // // })
