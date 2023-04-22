const mongoose = require("mongoose");
const OrderSchema = require("../schemas/order");

//Order 모델 생성
const Order = mongoose.model("Order", OrderSchema);

class OrderModel {
  // 주문하기
  async addOrder(
    userId,
    cartId,
    orderItems,
    shippingAddress,
    totalPrice,
    totalDiscount
  ) {
    try {
      const newOrder = new Order({
        userId,
        cartId,
        orderItems,
        shippingAddress,
        totalPrice,
        totalDiscount,
      });
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  // 주문수정
  async updateOrder(orderId, status, orderItems, shippingAddress) {
    try {
      const order = await Order.findById(orderId);
      if (order.status !== "processing") {
        throw new Error("배송이 시작되어 주문 수정이 불가합니다.");
      }
      // 상태 업데이트
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      // 주문상품 업데이트
      if (orderItems) {
        const updatedOrderItems = [];
        for (const item of orderItems) {
          const existingItem = order.orderItems.find(
            (orderItem) => orderItem.productId.toString() === item.productId
          );
          if (existingItem) {
            // 이미 주문한 상품인 경우 수량 업데이트
            existingItem.quantity += item.quantity;
            updatedOrderItems.push(existingItem);
          } else {
            // 새로운 상품인 경우 추가
            updatedOrderItems.push(item);
          }
        }
        updatedOrder.orderItems = updatedOrderItems;
        await updatedOrder.save();
      }

      // 배송주소 업데이트
      if (shippingAddress) {
        updatedOrder.shippingAddress = shippingAddress;
        await updatedOrder.save();
      }

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  // 주문조회
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId).populate([
        { path: "userId", select: ["name", "email"] },
        { path: "orderItems", select: ["productId", "quantity", "price"] },
      ]);
      const totalPrice = order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return { ...order.toObject(), totalPrice };
    } catch (error) {
      throw error;
    }
  }

  // 주문삭제
  async cancelOrder(orderId) {
    try {
      const canceledOrder = await Order.findByIdAndDelete(orderId);
      return canceledOrder;
    } catch (error) {
      throw error;
    }
  }
}

// OrderModel 인스턴스 생성
const orderModel = new OrderModel();

// orderModel 내보내기
module.exports = orderModel;
