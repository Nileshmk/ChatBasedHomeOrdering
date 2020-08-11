const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
const orderSchema = new Schema({
        orderid : String,
        storeid: String,
        userid: String,
        usercontact: String,
        userAddress: String,
        timestamp:Date,
        products: [{
            productid:String,
            productName : String,
            quantity : String,
            dsPrice : Number,
            mrpPrice : Number,
            total_quantity : Number,
            total_price: Number
        }],
        itemSubtotal : Number,
        GST: String,
        delCharges: Number,
        serviceCharges: String,
        TotalAmount: Number,
        allocationid: String,
        orderType: String,
        starttime: String,
        endtime:String
});

module.exports = mongoose.model('orders',orderSchema);

