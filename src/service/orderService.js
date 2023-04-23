const Order = require("../db/models/orderModel"); // order 모델 불러오기
const userModel = require("../db/models/userModel"); // user 모델 불러오기
const mongoose = require("mongoose");

class OrderService {
  //   // 사용자ID를 이용해 주문 정보 조회
  //   async getOrdersByUserId(userId) {
  //     const orders = await Order.find({ userId });
  //     return orders;
  //   }

  //   // 주문 취소 로직 구현
  //   async cancelOrder(orderId, userId) {
  //     // 사용자ID와 주문 번호를 이용해 주문 찾기
  //     const order = await Order.findOne({ _id: orderId, userId });

  //     // 해당 주문이 없을 경우 에러 메세지 전송
  //     if (!order) {
  //       throw new Error("주문을 찾을 수 없습니다.");
  //     }

  //     // 주문 상태가 'pending' or 'processing'이 아닐 경우 취소 불가 메세지 전송
  //     if (order.status !== "pending" && order.status !== "processing") {
  //       throw new Error("이미 배송중인 주문으로 취소할 수 없습니다.");
  //     }

  //     // 주문 상태 'canceled'로 변경 후 db 저장
  //     order.status = "canceled";
  //     await order.save();

  //     // 취소된 주문 db에서 삭제 (삭제할지 'canceled' 상태로 놔둘지 상의 필요, 삭제할거라면 delete 메소드를 사용하는게 좋을지도 ?)
  //     // await Order.deleteOne({ _id: orderId, userId });
  //     return order;
  //   }
  // 주문 생성
  async createOrder(
    userId,
    cartId,
    orderItems = [],
    shippingAddress,
    totalPrice,
    totalDiscount
  ) {
    try {
      const newOrder = await Order.createOrder({
        userId,
        cartId,
        orderItems: orderItems.map((item) => ({
          productId: item.item,
          quantity: item.count,
        })),
        shippingAddress,
        totalPrice: parseFloat(totalPrice),
        totalDiscount: parseFloat(totalDiscount),
        status: "pending", // 주문 상태 초기값 설정
      });

      // 결제 완료 시 주문 상태를 processing으로 업데이트 (아직 결제구조못짜서 주석처리)
      //   const user = await userModel.findByUserId(userId);
      //   if (user.paymentComplete) {
      //     newOrder.status = "processing";
      //     await newOrder.save();
      //   }

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  // 주문 수정
  async updateOrder(orderId, status, orderItems, shippingAddress) {
    try {
      //TypeError: Order.findById is not a function 에러
      const order = await Order.findById(orderId);
      if (order.status !== "processing") {
        throw new Error("주문 수정이 불가한 주문입니다.");
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

const orderService = new OrderService();

module.exports = orderService;

//더미오더생성테스트
const dummyOrder = {
  userId: "john123",
  cartId: "cart123",
  orderItems: [
    { item: "item1", count: 2 },
    { item: "item2", count: 1 },
  ],
  shippingAddress: "123 Main St, Anytown USA",
  status: "pending",
  totalPrice: 100,
  totalDiscount: 5,
};

orderService
  .createOrder(dummyOrder) //더미오더 정상출력
  .then((result) => {
    console.log("새 주문 생성:", result); //{ _id: new ObjectId("644497ebf474bf854119b827"), __v: 0 } 만출력
    console.log(dummyOrder);
  })
  .catch((err) => {
    console.error("Error creating new order:", err);
  });
