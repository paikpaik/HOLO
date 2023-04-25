const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        default: function() {
            return this.orderId.totalPrice - this.orderId.totalDiscount;
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['네이버페이', '신용카드', '무통장입금']
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'processing', 'success', 'failed']
    }
  }, 
  { timestamps: true 
  });