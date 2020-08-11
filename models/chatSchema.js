const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

const chatSchema = new Schema({
    message : String,
    messageBy : String,
    timestamp : String,
    visibleoption : [
    {    
      option_name : String          
    }
    ],    
    belowoptions :[  
    {    
      option_name : String      
    },
    {    
      option_name : String      
    }
  ]
});

autoIncrement.initialize(mongoose.connection); // This is important. You can remove initialization in different file

// chatSchema.plugin(autoIncrement.plugin,  {
//     model: 'chatOptions',
//     field: 'otp_id',
//     //startAt: 1000,
//     incrementBy: 1
//     }
// );

module.exports = mongoose.model("chatOptions",chatSchema);