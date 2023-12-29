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
<<<<<<< HEAD
    }
=======
    },
    UpdatedAt : Date,
    Review : [{
        customer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        content : String
    }]
>>>>>>> cf5b0685a21b0c57c3bbc76ac8ce237c7a5bc052

})

const ProductModel = new mongoose.model('product', ProductSchema);

module.exports = ProductModel;