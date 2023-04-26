const orderModel = require('../db/models/orderModel'); // order 모델 불러오기
const userModel = require('../db/models/userModel'); // user 모델 불러오기
const loginRequired = require("../middlewares/login-required");

class OrderService {
    // 주문생성 (테스트완료)
  async createOrder(req, res) {
    const {
      userId,
      email,
      cartId,
      orderItems = [],
      shippingAddress,
      status,
    } = req;
    console.log(req);

    // totalPrice, totalDiscount 계산
    let totalPrice = 0;
    let totalDiscount = 0;
    orderItems.forEach((item) => {
      totalPrice += item.price;
      totalDiscount += item.price * (item.discountRate / 100);
    });

    // 주문 정보 객체 생성
    const newOrder = await orderModel.createOrder({
      userId,
      email,
      cartId,
      orderItems,
      shippingAddress,
      totalPrice,
      totalDiscount,
      status: "pending",
    });

    // DB에 주문 정보 저장
    return newOrder;
  }
  // 비회원 주문조회 (테스트 완료)
  async getOrder(orderId, email) {
    console.log(orderId);
    if (!email || !orderId) {
      throw new Error("이메일과 주문번호를 모두 입력해주세요.");
    }

    const order = await orderModel.getOrder(orderId, email);

    if (!order) {
      throw new Error("일치하는 주문이 없습니다.");
    }

    return order;
  }
  // 비회원 주문수정 (테스트 완료)
  async updateOrder(req, res) {
    const { orderId, email, updateInfo } = req;

    // 주문 정보 조회
    const order = await orderModel.getOrder(orderId, email);

    if (order) {
      if (order.status === "processing") {
        const updatedOrder = await orderModel.updateOrder(
          orderId,
          email,
          updateInfo
        );
        return updatedOrder;
      } else {
        throw new Error("주문 수정이 불가한 상태의 주문입니다.");
      }
    }
    // 주문이 존재하지 않으면 에러 발생
    throw new Error("일치하는 주문이 없습니다.");
  }
  //회원 주문 수정 (login-required)
  async updateUserOrder(req, res) {
    const { orderId, updateInfo } = req.body;
    const currentUserId = req.currentUserId;
    console.log('orderService' + updateInfo);
    // 주문 정보 조회
    const order = await orderModel.findOne({ _id: orderId }).lean();

    // 주문이 존재하면 업데이트 진행
    if (order) {
      // 현재 사용자의 주문인지 확인
      if (order.userId !== currentUserId) {
        throw new Error("해당 주문에 대한 권한이 없습니다.");
      }
      if (order.status === "processing") {
        const updatedOrder = await orderModel.updateOrder(
          orderId,
          order.email,
          updateInfo
        );
        return updatedOrder;
      }
    } else {
      // 주문이 존재하지 않으면 에러 발생
      throw new Error("일치하는 주문이 없습니다.");
    }
  }
  // 회원 주문 수정 (userID)
  // async updateUserOrder(req, res) {
  //   const { orderId, updateInfo } = req.body;

  //   // 현재 사용자가 로그인한 상태인지 검사
  //   if (!req.user) {
  //     throw new Error("로그인이 필요합니다.");
  //   }

  //   const currentUserId = req.user.id;

  //   // 주문 정보 조회
  //   const order = await Order.findOne({ _id: orderId }).lean();

  //   // 주문이 존재하면 업데이트 진행
  //   if (order) {
  //     // 현재 사용자의 주문인지 확인
  //     if (order.userId !== currentUserId) {
  //       throw new Error("해당 주문에 대한 권한이 없습니다.");
  //     }

  //     const updatedOrder = await Order.updateOrder(
  //       orderId,
  //       order.email,
  //       updateInfo
  //     );
  //     return updatedOrder;
  //   }

  //   // 주문이 존재하지 않으면 에러 발생
  //   throw new Error("일치하는 주문이 없습니다.");
  // }

  // 비회원 주문취소 (테스트 완료)
  async cancelOrder(orderId, email) {
    if (!email || !orderId) {
      throw new Error("이메일과 주문번호를 모두 입력해주세요.");
    }

    // 주문 정보 조회
    const order = await orderModel.getOrder(orderId, email);

    // 주문이 존재하면 주문 취소 진행
    if (order) {
      const updatedOrder = await orderModel.cancelOrder(orderId, email);
      return updatedOrder;
    }

    // 주문이 존재하지 않으면 에러 발생
    throw new Error("일치하는 주문이 없습니다.");
  }



    // 사용자ID를 이용해 주문 정보 조회
    async getOrdersByUserId(userId) {
        const orders = await orderModel.find({ userId });
        if (!orders) {
            throw new Error('주문 내역이 없습니다.')
        }
        return orders;
    };

    // 주문 취소 로직 구현
    async cancelOrder(orderId, userId) {
        // 사용자ID와 주문 번호를 이용해 주문 찾기
        const order = await orderModel.findOne({ _id: orderId, userId });
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
        await orderModel.updateOne(
            { _id: orderId },
            {
                $set: { status: "canceled" },
            }
        );


        // 변경된 주문 데이터를 반환
        const updatedOrder = await orderModel.findOne({ _id: orderId, userId });

        return updatedOrder;
    };
};

const orderService = new OrderService();

module.exports = orderService;
