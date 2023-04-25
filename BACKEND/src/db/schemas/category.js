const mongoose = require('mongoose')
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    categoryNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
  },{
    timestamps: true,
  }
);
