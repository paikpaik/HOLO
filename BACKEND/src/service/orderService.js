const orderModel = require("../db/models/orderModel"); // order 모델 불러오기
const userModel = require("../db/models/userModel"); // user 모델 불러오기
const productModel = require("../db/models/productModel"); // product 모델 불러오기
const loginRequired = require("../middlewares/login-required");

class OrderService {
  // 주문생성 (테스트완료)
  // async createOrder(req, res) {
  //   const {
  //     userId,
  //     email,
  //     orderItems = [],
  //     shippingAddress,
  //     shippingMemo,
  //     status,
  //   } = req;
  //   console.log(req);

  //   // totalPrice, totalDiscount 계산
  //   let totalPrice = 0;
  //   let totalDiscount = 0;
  //   let isStockAvailable = true; // 상품 재고 확인용 변수
  //   for (const item of orderItems) {
  //     const product = await productModel.getProductById(item.productId);
  //     if (!product || product.stock < item.quantity) {
  //       // 상품이 없거나 재고가 충분하지 않은 경우
  //       isStockAvailable = false;
  //       break;
  //     }
  //     totalPrice += item.price * item.quantity;
  //     totalDiscount += item.price * (item.discountRate / 100 || 0);
  //   }

  //   // 주문 정보 객체 생성
  //   let newStatus = status;
  //   if (isStockAvailable) {
  //     const newOrder = await orderModel.createOrder({
  //       userId,
  //       email,
  //       orderItems,
  //       shippingAddress,
  //       shippingMemo,
  //       totalPrice,
  //       totalDiscount,
  //       status: newStatus || "pending",
  //     });
  //     // 상품 재고 감소 & 구매수 증가
  //     for (const item of orderItems) {
  //       await productModel.updateProductStock(item.productId, -item.quantity);
  //       await productModel.updatePurchaseNum(item.productId, item.quantity);
  //     }
  //     // DB에 주문 정보 저장
  //     return newOrder;
  //   } else {
  //     throw new Error("상품 재고가 부족합니다.");
  //   }
  // }
  async createOrder(req) {
    const {
      userId,
      email,
      orderItems = [],
      shippingAddress,
      shippingMemo,
      status,
    } = req;
    console.log(req);

    // totalPrice, totalDiscount 계산
    let totalPrice = 0;
    let totalDiscount = 0;
    let isStockAvailable = true; // 상품 재고 확인용 변수
    for (const item of orderItems) {
      const product = await productModel.getProductById(item.productId);
      if (!product || product.stock < item.quantity) {
        // 상품이 없거나 재고가 충분하지 않은 경우
        isStockAvailable = false;
        break;
      }
      totalPrice += item.price * item.quantity;
      totalDiscount += item.price * (item.discountRate / 100 || 0);
    }

    // 디비에서 가져온 가격으로 계산된 totalPrice
    const dbTotalPrice = await calculateTotalPrice(orderItems);

    if (totalPrice !== dbTotalPrice) {
      throw new Error("주문 가격이 일치하지 않습니다.");
    }

    function calculateTotalPrice(orderItems) {
      let totalPrice = 0;
      for (const item of orderItems) {
        totalPrice += item.price * item.quantity;
      }
      return totalPrice;
    }

    // 주문 정보 객체 생성
    let newStatus = status;
    if (isStockAvailable) {
      const newOrder = await orderModel.createOrder({
        userId,
        email,
        orderItems,
        shippingAddress,
        shippingMemo,
        totalPrice,
        totalDiscount,
        status: newStatus || "pending",
      });
      // 상품 재고 감소 & 구매수 증가
      for (const item of orderItems) {
        await productModel.updateProductStock(item.productId, -item.quantity);
        await productModel.updatePurchaseNum(item.productId, item.quantity);
      }
      // DB에 주문 정보 저장
      return newOrder;
    } else {
      throw new Error("상품 재고가 부족합니다.");
    }
  }

  // 주문상태변경
  async updateOrderStatus(orderId, status) {
    await orderModel.updateOrderStatus(orderId, status);
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
    console.log("orderService" + updateInfo);
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
      throw new Error("주문 내역이 없습니다.");
    }
    return orders;
  }

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
  }
}

const orderService = new OrderService();

module.exports = orderService;
