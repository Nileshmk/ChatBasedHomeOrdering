const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    roomID:String,
    userid:String,
    storeid:String,
    orders:[{
        orderid : String,
        usercontact: String,
        userAddress: {              
            byGoogle : {
                address : String ,
                city : String ,
                state : String ,
                country : String ,
                postalcode : String,
                loc : { type: { type : String } , coordinates : [String] },
            },
            byUser : {
                addressTag : String,
                userAddress : String,
                Landmark : String
            }
        },
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
        endtime:String,
        userlist:[
            {
                id:String,
                firebaseuserid:String
            }
        ],
        messages:[{
            _id:false,
            timestamp:String,
            messageid:Number,
            messageText:String,
            userid:String,
            firstName:String,
            lastName:String
        }]
    }]
});

module.exports = mongoose.model('rooms', roomSchema);
