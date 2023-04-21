const Order = require('../db/models/orderModel'); // order 모델 불러오기
const userModel = require('../db/models/userModel'); // user 모델 불러오기

class OrderService {
    // 사용자ID를 이용해 주문 정보 조회
    async getOrdersByUserId(userId) {
        const orders = await Order.find({ userId });
        return orders;
    };

    // 주문 취소 로직 구현
    async cancelOrder(orderId, userId) {

        // 사용자ID와 주문 번호를 이용해 주문 찾기
        const order = await Order.findOne({ _id: orderId, userId });

        // 해당 주문이 없을 경우 에러 메세지 전송
        if (!order) {
            throw new Error('주문을 찾을 수 없습니다.');
        }

        // 주문 상태가 'pending' or 'processing'이 아닐 경우 취소 불가 메세지 전송
        if (order.status !== 'pending' && order.status !== 'processing') {
            throw new Error('이미 배송중인 주문으로 취소할 수 없습니다.');
        }

        // 주문 상태 'canceled'로 변경 후 db 저장
        order.status = 'canceled';
        await order.save();

        // 취소된 주문 db에서 삭제 (삭제할지 'canceled' 상태로 놔둘지 상의 필요, 삭제할거라면 delete 메소드를 사용하는게 좋을지도 ?)
        // await Order.deleteOne({ _id: orderId, userId });

        return order;
    };
};

const orderService = new OrderService();

module.exports = orderService;

