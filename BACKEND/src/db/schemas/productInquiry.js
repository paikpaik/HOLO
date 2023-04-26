const mongoose = require('mongoose')
const { Schema } = mongoose;

const productInquirySchema = new Schema(
  {
    productNo: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    inquiryNum: {
      type: Number,
      required: true,
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

module.exports = productInquirySchema;