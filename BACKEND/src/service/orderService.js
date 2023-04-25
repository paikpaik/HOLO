const Order = require('../db/models/orderModel'); // order 모델 불러오기
const userModel = require('../db/models/userModel'); // user 모델 불러오기

class OrderService {
    // 사용자ID를 이용해 주문 정보 조회
    async getOrdersByUserId(userId) {
        const orders = await Order.find({ userId });
        if (!orders) {
            throw new Error('주문 내역이 없습니다.')
        }
        return orders;
    };

    // 주문 취소 로직 구현
    async cancelOrder(orderId, userId) {
        // 사용자ID와 주문 번호를 이용해 주문 찾기
        const order = await Order.findOne({ _id: orderId, userId });
        const orderObj = order.toObject();

        // 해당 주문이 없을 경우 에러 메세지 전송
        if (!order) {
            throw new Error("주문을 찾을 수 없습니다.");
        }

        // 주문 상태가 'pending' or 'processing'이 아닐 경우 취소 불가 메세지 전송
        if (orderObj.status !== "pending" && orderObj.status !== "processing") {
            throw new Error("이미 배송중인 주문으로 취소할 수 없습니다.");
        }

        // 주문 상태 'canceled'로 변경 후 db 저장
        await Order.updateOne(
            { _id: orderId },
            {
                $set: { status: "canceled" },
            }
        );


        // 변경된 주문 데이터를 반환
        const updatedOrder = await Order.findOne({ _id: orderId, userId });

        return updatedOrder;
    };
};

const orderService = new OrderService();

module.exports = orderService;

