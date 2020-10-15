const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    roomId:String,
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
            quantityId : String,
            productName : String,
            quantityName : String,
            dsPrice : Number,
            mrpPrice : Number,
            status : {
                type:String,
                default:""
            },
            orderQuantity : Number,
            issueQuantity: {
                type:Number,
                default:0
            },
            outOfStock:Boolean,
            totalQuantity : Number,
            totalPrice: Number
        }],
        itemSubtotal : Number,
        GST: Number,
        delCharges: Number,
        serviceCharges: Number,
        TotalAmount: Number,
        allocationid: String,
        orderType: String,
        starttime: String,
        endtime:String,
        userlist:[
            {
                id:String,
                firebaseuserid:String,
                userType:String
            }
        ],
        messages:[{
            messageid:Number,
            userid:String,
            orderstatuscode:Number,
            message:String,
            messagetype:String,
            timestamp:Date,
            firstName:String,
            lastName:String,
            profilePicUrl:String,
            visible:{
                type: Boolean,
                default: true
            }
        }],
        colorCode:String
    }],
    lastMessageId:Number
});

module.exports = mongoose.model('rooms', roomSchema);

