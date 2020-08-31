var allocationSchema = require("../models/allocationSchema");
var roomSchema = require("../models/roomSchema");
var userSchema = require("../models/userSchema");
var storeProductSchema = require("../models/storeProductsSchema");
var employeeSchema = require("../models/employeeSchema");

const mongoose = require("mongoose");
const keys = require("../config/keys");
const jsonQuery = require("json-query");
mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

// userSchema.find({},(err,result)=>{
//     console.log(result);
// });

// employeeSchema.findOne({employeeid:"5f0825a4c1474a00343e7bae"},async(err,managerResult)=>{
//     console.log(managerResult);
// });
// storeProductSchema.find({storeid:"5ef1a64cc729500c79aa2db8"},(err,result)=>{
//         console.log(result);
// })
roomSchema.find({},(err,result)=>{
  console.log(result);
  for(let i = 0;i<result[0].orders.length;i++){
    console.log(result[0].orders[i]);
  }
});

// userSchema.find({},(err,result)=>{
//     // var r = jsonQuery("timeslots[timeslotid="+"5f2593f37f505c0034b60c18"+"]", {data: result}).value;
//     // console.log(r.perSlotBookingNumber);
//     console.log(JSON.stringify(result));
// });

