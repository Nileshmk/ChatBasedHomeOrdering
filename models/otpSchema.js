const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

const otpSchema = new Schema({
    otp_id: 
        {
            type: Number, 
            autoIncrement : true
        },
    device_mac : 
        {   
            type: String, 
            unique: true, 
            required: true
        },
    otp: String,
    contact:
        {   
            type: String, 
            unique: true, 
            required: true
        },
    msg: 
        {
            type: String,
            maxlength : 160
        },
    userid: 
        {
            type: String, 
            unique: true 
        },
    status :
        {
            type:String,
            default:"notVerified"
        }
    }
);

autoIncrement.initialize(mongoose.connection); // This is important. You can remove initialization in different file

otpSchema.plugin(autoIncrement.plugin,  {
    model: 'otpSchema',
    field: 'otp_id',
    //startAt: 1000,
    incrementBy: 1
    }
);


module.exports = mongoose.model("OTP",otpSchema);

