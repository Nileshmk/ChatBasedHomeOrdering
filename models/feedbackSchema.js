const mongoose = require('mongoose');
const feedbackSchema = mongoose.Schema({
	employeeid: {
        type: String,
        unique: true
    },
    feedbacks:[String]
});

module.exports = mongoose.model('feedbacks', feedbackSchema);
//
