const mongoose = require('mongoose');
const CategorySchema = require('../schemas/category');

//Category 모델 생성
exports.Category = mongoose.model('Category', CategorySchema);