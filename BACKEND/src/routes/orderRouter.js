const { Router } = require('express');
const router = Router();
const orderService = require('../service/orderService'); // order 서비스 불러오기
const loginRequired = require('../middlewares/login-required'); // 로그인 확인 미들웨어 불러오기 (로그인이 필요한 기능이 있을시 해당 라우터에 사용됨)

//주문 생성 라우터 (기능테스트완료)
router.post("/create-order", async (req, res) => {
    const orderInfo = req.body;
    try {
      const newOrder = await orderService.createOrder(orderInfo);
      // 주문 완료 페이지로 리다이렉트
      // res.redirect("/order-completed");
  
      // 테스트를 위한 코드
      res.status(201).json({
        message: "주문이 완료되었습니다",
        order: newOrder,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  });
  
  //주문 조회 라우터 (기능테스트완료)
  router.get("/find-orders/:orderId", async (req, res, next) => {
    try {
      const { email } = req.body;
      const { orderId } = req.params;
  
      // 주문 조회
      const findOrder = await orderService.getOrder(orderId, email);
      // 테스트를 위한 코드
      res.status(200).json({
        message: `${email}님의 주문입니다.`,
        order: findOrder,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
  });
  
  // 비회원 주문 수정 (기능테스트 완료)
  router.patch("/update-order/:orderId", async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { email, updateInfo } = req.body;
  
      const updatedOrder = await orderService.updateOrder({
        orderId,
        email,
        updateInfo,
      });
      console.log("업데이트 정보: " + updateInfo);
      console.log("이메일: " + email);
      // 테스트를 위한 코드
      res.status(200).json({
        message: `${email}님의 주문이 아래와 같이 수정되었습니다.`,
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  });
  
  // 회원 주문 수정 (login-required - 이용/전체머지후 테스트예정)
  router.patch("/update-userOrders/:orderId", loginRequired, async (req, res) => {
    try {
      const orderId = req.params.id;
      const updateInfo = req.body;
  
      const updatedOrder = await orderService.updateUserOrder({
        orderId,
        updateInfo,
        currentUserId: req.currentUserId,
      });
  
      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: err.message });
    }
  });
  
  // 비회원 주문 취소 (기능테스트 완료)
  router.post("/cancel-order", async (req, res) => {
    try {
      const { orderId, email } = req.body;
      console.log(orderId, email);
      const updatedOrder = await orderService.cancelOrder(orderId, email);
      res.status(200).json({
        message: `${email}님의 취소된 주문입니다.`,
        order: updatedOrder,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
  

// 사용자의 주문 정보 조회 라우터
router.get('/find-orders', loginRequired, async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUserId(req.currentUserId);
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message }); // JSON 형식으로 에러 메시지 반환
    }
});

// 주문 취소 라우터 (회원)
router.post('/find-orders/:orderId/cancel', loginRequired, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const canceledOrder = await orderService.cancelOrder(orderId, req.currentUserId);
        res.json({ message: '주문이 취소되었습니다.', order: canceledOrder });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message }); // JSON 형식으로 에러 메시지 반환
    }
});

module.exports = router;
