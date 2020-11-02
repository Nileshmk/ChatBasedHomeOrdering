const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: String,  
    qtyCategory: [
        {
        quantity: String,
        mrpprice: Number,
        dsprice: Number,
        default_v: Boolean,
        outofstock : Boolean,
        total_quantity : String
        }
    ],
    packing:{
        weight: Number,
        length: Number,
        breath: Number
    },
    description:{
        modelNumber: String,
        type: String,
        color: String
    },
    features:[{
        key:String,
        value: String
    }],
    searchKeywords:[String],
    mainImage:[String],
    subImages:{
        approved:[{
            name:String,
            time:Date,
            url:String
        }],
        archived:[{
            name:String,
            time:Date,
            url:String
        }],
        neither:[{
            name:String,
            time:Date,
            url:String
        }]
    },
    maxOrderQuantity: Number
});

module.exports = mongoose.model('products', productSchema);