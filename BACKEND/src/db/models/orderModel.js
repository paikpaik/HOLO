const mongoose = require("mongoose");
const { OrderSchema } = require("../schemas/order");

//Order 모델 생성
const Order = mongoose.model("orders", OrderSchema);
class OrderModel {
    // 주문 생성
    async createOrder(orderInfo) {
        const createNewOrder = await Order.create(orderInfo);
        return createNewOrder;
    };
    // 주문 조회 (이메일과 orderId로 주문 조회)
    async getOrder(orderId, email) {
        if (!email || !orderId) {
            throw new Error("이메일과 주문번호를 모두 입력해주세요.");
        }

        const order = await Order.findOne({ _id: orderId, email }).lean();

        if (!order) {
            throw new Error("일치하는 주문이 없습니다.");
        }

        return order;
    };

    // 주문 수정 (이메일과 orderId로 주문 조회)
    async updateOrder(orderId, email, updateInfo) {
        if (!email || !orderId) {
            throw new Error("이메일과 주문번호를 모두 입력해주세요.");
        }

        const order = await Order.findOne({ _id: orderId, email }).lean();

        if (!order) {
            throw new Error("일치하는 주문이 없습니다.");
        }

        // updateInfo 객체에 들어있는 속성만 업데이트 하도록 { $set: updateInfo } 객체를 만듭니다.
        const updateDoc = { $set: updateInfo };

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateDoc, {
            new: true,
        }).lean();

        return updatedOrder;
    };

    // 회원 주문 수정 (login-required)
    async updateUserOrder(orderId, currentUserId, updateInfo) {
        // 주문 정보 조회
        const order = await Order.findOne({ _id: orderId }).lean();

        // 주문이 존재하면 업데이트 진행
        if (order) {
        // 현재 사용자의 주문인지 확인
        if (order.userId !== currentUserId) {
            throw new Error("해당 주문에 대한 권한이 없습니다.");
        }

        const updatedOrder = await this.updateOrder(
            orderId,
            order.email,
            updateInfo
        );
        return updatedOrder;
        }

        // 주문이 존재하지 않으면 에러 발생
        throw new Error("일치하는 주문이 없습니다.");
    };

    // 주문 취소 (이메일과 orderId로 주문 조회)
    async cancelOrder(orderId, email) {
        if (!email || !orderId) {
        throw new Error("이메일과 주문번호를 모두 입력해주세요.");
        }

        const order = await Order.findOne({ _id: orderId, email }).lean();

        if (!order) {
        throw new Error("일치하는 주문이 없습니다.");
        }

        const updateDoc = { $set: { status: "canceled" } };

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateDoc, {
        new: true,
        }).lean();

        return updatedOrder;
    };

    // 사용자 (회원) 주문 조회
    async find(filter) {
        const orders = await Order.find(filter);
        return orders;
    };

    // 주문 번호와 사용자ID를 이용해 주문 찾기
    async findOne(filter) {
        const order = await Order.findOne(filter);
        return order;
    };

    // 주문 상태 업데이트
    async updateOne(filter, updateDoc) {
        await Order.updateOne(filter, updateDoc);
    };

    // orderId 를 사용하여 주문 삭제
    async deleteByOrderId(orderId) {
        const filter = ({ _id: orderId });
        const result = await Order.findOneAndDelete(filter);
        return result;
    };
};

//OrderModel 인스턴스 생성
const orderModel = new OrderModel();

// orderModel 내보내기
module.exports = orderModel;