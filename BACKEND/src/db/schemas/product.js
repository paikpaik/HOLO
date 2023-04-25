const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    categoryNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      trim: true,
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
  },{
    timestamps: true,
  }
);

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrls: [
    {
      type: String,
      required: true,
    },
  ],
});
