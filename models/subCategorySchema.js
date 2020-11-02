const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    subCategoryName : String, 
    subCategoryAvailable : Boolean
});

module.exports = mongoose.model('subCategorys', subCategorySchema);
