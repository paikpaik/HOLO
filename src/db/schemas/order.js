const mongoose = require("mongoose");
const { Schema } = mongoose;

//주문상품 스키마
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discountRate: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    ShippingAddress: {
      type: String,
      required: true,
      default: function () {
        return this.userId.address;
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
