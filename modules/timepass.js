var allocationSchema = require("../models/allocationSchema");
var roomSchema = require("../models/roomSchema");
var userSchema = require("../models/userSchema");
var storeProductSchema = require("../models/storeProductsSchema");
var employeeSchema = require("../models/employeeSchema");
var allocationSchema = require("../models/allocationSchema");
var optionSchema = require("../models/optionSchema");
const _ = require('lodash');
t = {
  "optionsVersion":1,
  "storetype":"GeneralAll",
  "userRoles":["customer","manager","packing","delivery"],
  "access": [
    {
		"userRole":"customer",
		"belowOptions":
		[
			{
				"statusCode":204,
				"optionName":"Review Order",
				"messagetype":"vieworder",
				"emojiUnicode":"0x1F60A",					
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Order issue has been resolved..",
					"newStatusCode":205,
					"messagetype":"vieworder"
				}
			},
		]
	},
	{
		"userRole":"manager",
		"belowOptions":
		[
			{
				"statusCode":201,
				"optionName":"Accept",
				"messagetype":"info",
				"emojiUnicode":"0x1F60A",					
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Your Order has been accepted.",
					"newStatusCode":202,
					"messagetype":"assign"
				}
			},
			{
				"statusCode":201,
				"optionName":"Reject",
				"messagetype":"info",
				"emojiUnicode":"0x1F60A",
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Your Order has been rejected",
					"newStatusCode":210,
					"messagetype":"info"
				}
			},
			{
				"statusCode":202,
				"optionName":"Assign Packing",
				"messagetype":"assign",
				"emojiUnicode":"0x1F60A",
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Packing Assigned to ",
					"newStatusCode":203,
					"messagetype":"vieworder"
				}
			},
			{
				"statusCode":206,
				"optionName":"Assign Delivery",
				"messagetype":"assign",
				"emojiUnicode":"0x1F60A",
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Delivery Assigned to ",
					"newStatusCode":207,
					"messagetype":"info"
				}
			},
		]
	},
	{
		"userRole":"packing",
		"belowOptions":
		[
			{
				"statusCode":203,
				"optionName":"Start Packing",
				"messagetype":"vieworder",
				"emojiUnicode":"0x1F60A",					
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Packing Completed with Issues",
					"newStatusCode":204,
					"messagetype":"vieworder"
				}
			},
			{
				"statusCode":205,
				"optionName":"Continue Packing",
				"messagetype":"vieworder",
				"emojiUnicode":"0x1F60A",
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Your Order has been packed without Issues..",
					"newStatusCode":206,
					"messagetype":"assign"
				}
			}
		]
	},
	{
		"userRole":"delivery",
		"belowOptions":
		[
			{
				"statusCode":207,
				"optionName":"Start Delivery",
				"messagetype":"info",
				"emojiUnicode":"0x1F60A",					
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Your Order is on its way",
					"newStatusCode":208,
					"messagetype":"info"
				}
			},
			{
				"statusCode":208,
				"optionName":"Delivery Completed",
				"messagetype":"info",
				"emojiUnicode":"0x1F60A",
				"optionBorderColor":"#000000",
				"toSend":
				{
					"message":"Order delivery has been completed",
					"newStatusCode":209,
					"messagetype":"info"
				}
			}
		]
	},
	]	
}

var fs = require('fs');
const mongoose = require("mongoose");
const keys = require("../config/keys");
const jsonQuery = require("json-query");
const storeProductsSchema = require("../models/storeProductsSchema");
mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });


optionSchema.deleteMany({},(err,result)=>{
console.log("deleted");
let model = new optionSchema(t);
model.save();
});

// optionSchema.find({},(err,result)=>{
// 	console.log(result);
// 	fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8',(err,result)=>{
// 		console.log(result);
// 	});
// })

// userSchema.find({},(err,result)=>{
//     console.log(result);
// });

// employeeSchema.find({"userType.packingHelper": true},"employeeid firstName lastName onduty taskAssigned",(err,managerResult)=>{
//     console.log(managerResult);
// });
// storeProductSchema.find({storeid:"5ef1a64cc729500c79aa2db8"},(err,result)=>{
//         console.log(result);
// })
// allocationSchema.findOne({_id:"5f4a14e794100d0034347741"},(err,result)=>{
//   console.log(result);
//   result.timeslots[0].perSlotBookingNumber = 30;
//   result.save();
// })

roomSchema.find({},(err,result)=>{
//   if(err) throw err;
  console.log(result);
  	fs.writeFile('myjsonfile.json', JSON.stringify(result), 'utf8',(err,result)=>{
		console.log(result);
	});
	// fs.close();
});




// console.log(getColor());
// function getColor(){
//   var letters = "0123456789abcdef"; 
//   // "0xfff06292"
//   // html color code starts with # 
//   var color = '0x'; 

//   // generating 6 times as HTML color code consist 
//   // of 6 letter or digits 
//   for (var i = 0; i < 8; i++) 
//      color += letters[(Math.floor(Math.random() * 16))]; 
//   return color;
// }


// updates = [ { roomId: '5f50eefe5a13385557da52fc', lastMessageId: 0 } ];


// userSchema.find({},(err,result)=>{
//     // var r = jsonQuery("timeslots[timeslotid="+"5f2593f37f505c0034b60c18"+"]", {data: result}).value;
//     // console.log(r.perSlotBookingNumber);
//     console.log(result);
// });

// storeProductsSchema.find({},(err,result)=>{
// 	console.log(result);
// 	result[0].optionsVersion = 1;
// 	result[0].storeLogoUrl = null;
// 	result[0].save();
// })
