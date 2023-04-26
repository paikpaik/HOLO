const { Router } = require('express');
const router = Router();
const adminService = require('../service/adminService'); // admin 서비스 불러오기
const loginRequired = require('../middlewares/login-required'); // 로그인 확인 미들웨어 불러오기 (로그인이 필요한 기능이 있을시 해당 라우터에 사용됨)
const isAdmin = require('../middlewares/isAdmin'); // isAdmin 미들웨어 불러오기

// 모든 사용자 정보 조회 라우터
// loginRequired와 isAdmin 미들웨어를 사용하여 로그인한 관리자만 접근 가능하도록 제한
router.get('/all-users', loginRequired, isAdmin, async (req, res) => {
    try {
        const users = await adminService.getAllUsers();

        // 조회된 사용자 정보 반환
        res.status(200).json({ users });
    } catch (error) {

        // 오류 발생 시, 서버 오류 메시지 반환
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 사용자 회원 정보 삭제 라우터
router.delete('/delete-user/:userId', loginRequired, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        await adminService.deleteUser(userId);

        res.status(200).json({ message: '회원 정보가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 모든 주문 정보 조회 라우터
// loginRequired와 isAdmin 미들웨어를 사용하여 로그인한 관리자만 접근 가능하도록 제한
router.get('/all-orders', loginRequired, isAdmin, async (req, res) => {
    try {
        const ordersWithUser = await adminService.getAllOrders();

        // 조회된 주문 정보 반환
        res.status(200).json({ ordersWithUser });
    } catch (error) {

        // 오류 발생 시, 서버 오류 메시지 반환
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
});

// 주문 삭제 라우터
router.delete('/delete-order/:orderId', loginRequired, isAdmin, async (req, res) => {
    try {
        const { orderId } = req.params;
        await adminService.deleteOrder(orderId);

        res.status(200).json({ message: '주문이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 관리자가 주문 상태 변경하는 라우터
router.patch('/updatedStatus/:orderId', loginRequired, isAdmin, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: '주문 상태를 입력해주세요.' });
        }

        await adminService.updateOrderStatus(orderId, status);

        res.status(200).json({ message: '주문 상태가 성공적으로 변경되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
