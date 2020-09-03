const mongoose = require('mongoose');

const storeProductSchema = mongoose.Schema({
    storeid: String,
    userid : String,
    storeName: String,
    storeAddress: String,
    storeCategory: String,
    optionsVersion: Number,
    storeLogoUrl : String,
    mincharges:{
      type:Number,
      default:null
    },
    onekmcharges:{
      type:Number,
      default:null
    },
    maxkm:{
      type:Number,
      default:null
    },
    freedeliveryafterbillamount:{
      type:Number,
      default:null
    },
    isEnableforFree:{
      type:Boolean,
      default:true
    },
    porderBefore:{
      date:Number,
      hour:Number,
      min:Number
    },
    pmaxshowduration:{
      type:Number,
      default:null
    },
    dorderBefore:{
      date:Number,
      hour:Number,
      min:Number
    },
    dmaxshowduration:{
      type:Number,
      default:null
    },
    loc : { type: { type : String } , coordinates : [] },
    ts_l : String,    
    storeProductCategories: [{
        category: String,
        categoryAvailable : Boolean,
        subCategory : [{
          subCategoryName : String, 
          subCategoryAvailable : Boolean,
          subCategoryProducts : [{
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
            ]               
          }]        
        }],
     }        
        ]
     });

storeProductSchema.index({loc:'2dsphere'});
module.exports = mongoose.model('storeProducts', storeProductSchema);


// const mongoose = require('mongoose');

// const storeProductSchema = mongoose.Schema({
//     storeid: String,
//     userid : String,
//     storeName: String,
//     storeAddress: String,
//     storeCategory: String,
//     loc : { type: { type : String } , coordinates : [] },
//     ts_l : String,
//     products: [{
//         category: String,
//         categoryAvailable : Boolean,
//         subCategoryProducts: [
//           {
//             subCategory : String,
//             subCategoryAvailable: String,
//             productName: String,
//             qtyCategory: [
//               {
//                 quantity: String,
//                 mrpprice: Number,
//                 dsprice: Number,
//                 default_v: Boolean,
//                 outofstock : Boolean,
//                 total_quantity : String
//               }
//             ]
//           }        
//         ]
//      }]
// });

// storeProductSchema.index({loc:'2dsphere'});
// module.exports = mongoose.model('storeProducts', storeProductSchema);