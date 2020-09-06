const mongoose = require('mongoose');
const optionSchema = mongoose.Schema(
    {
        optionsVersion:Number,
        storetype:String,
        userRoles:[String],
        access: [
          {
            userRole:String,
            belowOptions:
                [
                  {
                    statusCode:Number,
                    optionName:String,
                    emojiUnicode:String,
                    messagetype:String,
                    optionBorderColor:String,
                    toSend:
                      {
                        message:String,
                        messagetype:String,
                        newStatusCode:Number
                      }
                  }
                ]
          }]	
      }
);

module.exports = mongoose.model('options', optionSchema);