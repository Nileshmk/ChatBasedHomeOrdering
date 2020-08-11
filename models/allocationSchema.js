const mongoose = require('mongoose');
const storeProductsSchema = require('./storeProductsSchema');
const allocationSchema = mongoose.Schema({
    storeid:String,
    date: Date,
    timeslottype:String,
    timeslots:[{
        timeslotid:String,
        starttime:String,
        endtime:String,
        onOrOff:Boolean,
        perSlotBookingNumber:Number,
        // allocatedPerson:[String],
        _id: false,
        id: false
    }]
});

module.exports = mongoose.model('allocations', allocationSchema);
//