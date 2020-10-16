const mongoose = require('mongoose');
const storeProductsSchema = require('./storeProductsSchema');
const timeslotSchema = mongoose.Schema({
	timeslotid: String,
	storeid: String,
    timeslottype:String,
	starttime:String,
	endtime:String,
	weekdays:[String],
	// orderBefore:{
	// 	date:Number,
	// 	hour:Number,
	// 	min:Number
	// },
	onOrOff:{
		type: Boolean,
		default: true
	}
	// perSlotBookingNumber:Number
});

module.exports = mongoose.model('timeslots', timeslotSchema);
//
