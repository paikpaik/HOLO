const mongoose = require("mongoose");
const OrderSchema = require("../schemas/order");

//Order 모델 생성
const Order = mongoose.model("Order", OrderSchema);

class OrderModel {
  // 주문 생성
  async createOrder(
    orderItems,
    shippingAddress,
    totalPrice,
    totalDiscount,
    email = null,
    userId = null
  ) {
    try {
      // userId 값이 전달되지 않은 경우, 새로운 아이디를 생성하여 추가합니다.
      if (!userId) {
        userId = userId || Math.random().toString(36).substring(2, 15);
      }

      let defaultEmail = "";
      let defaultShippingAddress = "";

      // 비회원의 경우 이메일과 주소 입력받기
      if (!email) {
        email = await this.promptEmail();
      }

      if (!shippingAddress) {
        shippingAddress = await this.promptShippingAddress();
      }

      // userId를 가진 사용자의 주소 정보 조회
      const user = await User.findOne({ _id: userId });
      if (user) {
        defaultShippingAddress = user.address;
        defaultEmail = user.email;
      }

      const newOrder = new Order({
        userId,
        email: email || defaultEmail,
        orderItems,
        shippingAddress: shippingAddress || defaultShippingAddress,
        totalPrice,
        totalDiscount,
        status: "pending", // 주문 상태 초기값 설정
      });

      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  //이메일 입력 함수
  async promptEmail() {
    const email = prompt("이메일 주소를 입력해주세요.");
    if (!email) {
      return this.promptEmail();
    }
    return email;
  }

  //배송 주소 입력 함수
  async promptShippingAddress() {
    const shippingAddress = prompt("배송 주소를 입력해주세요.");
    if (!shippingAddress) {
      return this.promptShippingAddress();
    }
    return shippingAddress;
  }

  // 주문 수정
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

      // 주문 상품 업데이트
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

      // 배송 주소 업데이트
      if (shippingAddress) {
        updatedOrder.shippingAddress = shippingAddress;
        await updatedOrder.save();
      }

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }
}

//OrderModel 인스턴스 생성
const orderModel = new OrderModel();

// orderModel 내보내기
module.exports = orderModel;
