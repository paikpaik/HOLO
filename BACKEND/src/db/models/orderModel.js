const mongoose = require('mongoose');
const OrderSchema = require('../schemas/order');

//Order 모델 생성
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
