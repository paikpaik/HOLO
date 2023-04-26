// product 스키마
const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productNo: {
      type: String,
      required: true,
    },
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
    imageUrl: [
      {
        type: String,
        required: true,
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
    originLabel: {
      type: String,
    },
  }
);

module.exports = productSchema;

// const imageSchema = new Schema({
//   imageUrl: {
//     type: String,
//     required: true
//   },
//   thumbnailUrls: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
// });
