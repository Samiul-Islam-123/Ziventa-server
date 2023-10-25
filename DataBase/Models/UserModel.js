const mongoose = require('mongoose');

//creating userSchema
const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    otp: {
        type: String
    },
    verified: Boolean
})

//creating user model
const UserModel = new mongoose.model('user', UserSchema);

//exporting userModel
module.exports = UserModel;