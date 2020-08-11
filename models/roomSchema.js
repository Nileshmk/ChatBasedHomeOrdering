const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    roomID:String,
    orderid:String,
    messages:[{
        _id:false,
        timestamp:String,
        messageid:Number,
        messageText:String,
        userid:String,
        firstName:String,
        lastName:String
    }]
});

module.exports = mongoose.model('rooms', roomSchema);
