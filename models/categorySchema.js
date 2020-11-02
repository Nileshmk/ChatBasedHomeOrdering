const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName : String, 
    categoryAvailable : Boolean
});

module.exports = mongoose.model('categorys', categorySchema);
