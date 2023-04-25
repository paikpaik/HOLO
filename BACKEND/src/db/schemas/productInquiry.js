const mongoose = require('mongoose')
const { Schema } = mongoose;

const productInquirySchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inquiryNum: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    answerStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    inquiryTitle: {
      type: String,
      required: true,
    },
    inquiryContent: {
      type: String,
      required: true,
    },
    publicStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
    password: {
      type: String,
    },
  },{
    timestamps: true,
  }
);

