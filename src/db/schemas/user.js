const { Schema } = require('mongoose');

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
    },
    termsAgreed: {
        type: Boolean,
        required: true,
    }
});


module.exports = UserSchema;