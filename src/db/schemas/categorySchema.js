const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const categorySchema = new Schema({
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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
