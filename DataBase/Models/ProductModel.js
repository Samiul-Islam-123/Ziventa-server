const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    ProductOwner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    ProductTitle : String,
    ProductDescription : String,
    ProductImages : [String],
    ProductPrice : Number,
    ProductStock : Number,
    ProductMetaData : {
        AgeRange : String,
        PriceRange : String,
        Category : String
    },
    UpdatedAt : Date,
    Reviews : [{
        customer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        review : String,
        Date : String
    }]

})

const ProductModel = new mongoose.model('product', ProductSchema);

module.exports = ProductModel;