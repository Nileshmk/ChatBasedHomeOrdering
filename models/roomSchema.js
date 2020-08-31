const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    roomId:{
        type: String,
        unique: true,
        index: true,
        required: true
    },
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
            quantityName : String,
            quantityId : String,
            orderQuantity : Number,
            dsPrice : Number,
            mrpPrice : Number,
            outOfStock:false,
            total_quantity : Number,
            issueQuantity: Number,
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
            messageid:Number,
            userid:String,
            orderstatuscode:Number,
            message:String,
            messagetype:String,
            timestamp:String,
            firstName:String,
            lastName:String,
            profilePicUrl:String,
            senderUserType:String
        }],
        colorCode:String
    }],
    lastMessageId:Number
});

module.exports = mongoose.model('rooms', roomSchema);
