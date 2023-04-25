const mongoose = require('mongoose');
const { Schema } = mongoose;

//장바구니 아이템은 장바구니에 담긴 물건이 하나 이상일 수 있기 때문에 먼저 상품과 수량을 받습니다. 
const CartItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    userId:{
        type: String,
        required: true, 
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
        required: true,
      }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
},
{
    timestamps: true,
});