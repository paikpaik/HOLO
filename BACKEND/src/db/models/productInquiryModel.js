const mongoose = require('mongoose');
const ProductInquirySchema = require('../schemas/productInquiry');

//Category 모델 생성
exports.ProductInquiry = mongoose.model('ProductInquiry', ProductInquirySchema);