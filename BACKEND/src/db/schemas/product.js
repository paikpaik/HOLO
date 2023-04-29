// product 스키마
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountRate: {
    type: Number,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
  },
  longDesc: {
    type: String,
  },
  imagePaths: [
    {
      type: String,
    },
  ],
  purchaseNum: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 10,
  },
});

module.exports = productSchema;
