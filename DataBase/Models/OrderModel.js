const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            Qty: Number // Add the Qty field here
        }
    ],
    address : String,
    Phone : String,
    OrderPrice : Number,
    Delivered : Boolean,
    Paid : Boolean,
    OrderStatus : String,
    createdAt: {
        type: String
    },
    ExpectedDeliveryDate : String,
    Payment : Boolean
})
const OrderModel = new mongoose.model('order', OrderSchema);
module.exports = OrderModel;