const { Router } = require("express");
const router = Router();
const orderService = require("../service/orderService"); // order 서비스 불러오기
// const loginRequired = require("../middlewares/login-required"); // 로그인 확인 미들웨어 불러오기 (로그인이 필요한 기능이 있을시 해당 라우터에 사용됨)

// // 사용자의 주문 정보 조회 라우터
// router.get("/find-orders", loginRequired, async (req, res) => {
//   try {
//     const orders = await orderService.getOrdersByUserId(req.currentUserId);
//     res.json(orders);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(`${err}`);
//   }
// });

// 주문 취소 라우터
// router.post("/find-orders/:orderId/cancel", loginRequired, async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const canceledOrder = await orderService.cancelOrder(
//       orderId,
//       req.currentUserId
//     );
//     res.json({ message: "주문이 취소되었습니다.", order: canceledOrder });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(`${err}`);
//   }
// });

// 주문 생성 라우터 (login-required미들웨어 제거상태)
router.post("/create-order", async (req, res) => {
  try {
    const { cartId, orderItems, shippingAddress, totalPrice, totalDiscount } =
      req.body;
    const userId = req.currentUserId;

    const newOrder = await orderService.createOrder(
      userId,
      cartId,
      orderItems,
      shippingAddress,
      totalPrice,
      totalDiscount
    );

    // 주문 완료 페이지로 리다이렉트
    res.redirect("/order-completed");
  } catch (err) {
    console.log(err);
    res.status(400).send(`${err}`);
  }
});

// 주문 수정 라우터(login-required미들웨어 제거상태)
router.patch("/update-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, orderItems, shippingAddress } = req.body;

    const updatedOrder = await orderService.updateOrder(
      orderId,
      status,
      orderItems,
      shippingAddress
    );

    // 주문 수정 완료 페이지로 리다이렉트
    res.redirect("/order-completed");
  } catch (err) {
    console.log(err);
    res.status(400).send(`${err}`);
  }
});

module.exports = router;
