const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    product : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product'
    }],
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const CartModel = new mongoose.model('cart', CartSchema);
module.exports = CartModel;