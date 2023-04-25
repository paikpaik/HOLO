const mongoose = require('mongoose');
const ProductSchema = require('../schemas/product');

//Product 모델 생성
exports.Product = mongoose.model('Product', ProductSchema);