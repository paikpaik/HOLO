const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        unique: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    userName: {
        type: String,
        required: true,
    },
    termsAgreed: {
        type: Boolean,
        required: true,
    }
});

