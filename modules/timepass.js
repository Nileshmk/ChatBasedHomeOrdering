var allocationSchema = require("../models/allocationSchema");
var roomSchema = require("../models/roomSchema");
const mongoose = require("mongoose");
const keys = require("../config/keys");
const jsonQuery = require("json-query");
mongoose.connect(keys.mongodb.dbOrg, () => {
    console.log("connected to mongodb..");
  },{ useFindAndModify: false });

roomSchema.find({},(err,result)=>{
    // var r = jsonQuery("timeslots[timeslotid="+"5f2593f37f505c0034b60c18"+"]", {data: result}).value;
    // console.log(r.perSlotBookingNumber);
    console.log(JSON.stringify(result));
});

// roomSchema.deleteMany({},(err,result)=>{
//   console.log("deleted");
// })