const mongoose = require('mongoose');
const PaymentSchema = require('../schemas/payment');

//Product 모델 생성
exports.Payment = mongoose.model('Payment', PaymentSchema);