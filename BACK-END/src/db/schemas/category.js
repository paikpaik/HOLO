const mongoose = require('mongoose')
const { Schema } = mongoose;

const categorySchema = new Schema(
  { 
    // 블록 변수 충돌로 name으로 정했습니다.
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
