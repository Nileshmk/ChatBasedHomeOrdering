const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
const orderSummarySchema = new Schema({
        orderid : String,
        storeid: String,
        userid: String,
        products: [{
          productName : String,
          qtyItems: [{
             quantity : String,
             dsPrice : Number,
             mrpPrice : Number,
             total_quantity : Number
          }
          ]
        }],
        itemSubtotal : String,
        GST: String,
        delCharges: Number,
        serviceCharges: String,
        TotalAmount: Number,
        OrderType:{
                type: String, 
                enum : ['Pickup','Delivery'],                 
                default: 'Pickup'                 
        },
        UserAddress: String,
        timeslot:{	
              starttime: Date,
              endtime: Date,
        }
});

module.exports = mongoose.model('OrderSummary',orderSummarySchema);

