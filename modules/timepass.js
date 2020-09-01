var allocationSchema = require("../models/allocationSchema");
var roomSchema = require("../models/roomSchema");
var userSchema = require("../models/userSchema");
var storeProductSchema = require("../models/storeProductsSchema");
var employeeSchema = require("../models/employeeSchema");
var allocationSchema = require("../models/allocationSchema");


const mongoose = require("mongoose");
const keys = require("../config/keys");
const jsonQuery = require("json-query");
mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

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
roomSchema.findOne({roomId:"5f4d3cddc117e15ee67d4d8a"},(err,result)=>{
  if(err) throw err;
  console.log(result);
  for(let i = 0;i<result.orders.length;i++){
    console.log(result.orders[i].userlist);
  }
});

// roomSchema.deleteMany({},(err,result)=>{
//   console.log("deleted")
// })

userSchema.find({},(err,result)=>{
    // var r = jsonQuery("timeslots[timeslotid="+"5f2593f37f505c0034b60c18"+"]", {data: result}).value;
    // console.log(r.perSlotBookingNumber);
    console.log(result);
});

