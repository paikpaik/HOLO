const userModel = require('../db/models/userModel'); // user 모델 불러오기
const orderModel = require('../db/models/orderModel'); // order 모델 불러오기
const sendEmail = require('../utils/sendEmail'); // sendEmail 유틸리티 불러오기

class AdminService {
    // 모든 사용자 정보 조회
    async getAllUsers() {
        const users = await userModel.findAll();
        return users;
    };

    // 사용자의 회원 정보 삭제 및 이메일 전송
    async deleteUser(userId) {
        const user = await userModel.findByUserId(userId);

        if (!user) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }

        // userId로 해당 회원을 검색해 정보 삭제
        await userModel.deleteByUserId(userId);

        // 회원 탈퇴 처리가 완료된 후 이메일로 탈퇴 사실을 알림
        const emailContent =
            `안녕하세요, ${user.name}님.
  
            회원 정보가 성공적으로 삭제되었습니다.
            그동안 저희 'HOLO'를 이용해주셔서 대단히 감사합니다.`;

        await sendEmail({
            to: user.email,
            subject: '[HOLO] 회원 탈퇴 처리 완료',
            text: emailContent,
        });
    };

    // 관리자가 모든 주문 내역 조회 (회원 및 비회원)
    async getAllOrders() {
        const allOrders = await orderModel.find(); // 모든 주문 찾기
        return allOrders;
    };

    // 관리자가 사용자의 주문 삭제 및 이메일 전송
    async deleteOrder(orderId) {
        const order = await orderModel.findOne({ _id: orderId });

        if (!order) {
            throw new Error('해당 주문을 찾을 수 없습니다.');
        }

        const user = await userModel.findByEmail(order.email);

        // 주문 정보 삭제
        await orderModel.deleteByOrderId(orderId);

        // 주문 삭제 처리가 완료된 후 이메일로 삭제 사실을 알림
        const emailContent =
            `안녕하세요, ${user.name}님.
    
        고객님의 요청으로, 주문 번호 ${orderId}의 주문이 성공적으로 삭제되었습니다.
        
        저희 'HOLO'의 서비스를 이용해주셔서 감사합니다.`;

        await sendEmail({
            to: user.email,
            subject: '[HOLO] 주문 삭제 처리 완료',
            text: emailContent,
        });
    };

    // 관리자 주문 상태 변경
    async updateOrderStatus(orderId, status) {
        const order = await orderModel.findOne({ _id: orderId });

        if (!order) {
            throw new Error('해당 주문을 찾을 수 없습니다.');
        }

        const updateDoc = { status }; // 주문 상태를 변경하는 객체
        const filter = { _id: orderId };
        await orderModel.updateOne(filter, updateDoc);
    };
};

const adminService = new AdminService;

module.exports = adminService;
