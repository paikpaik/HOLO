const cartModel = require("../db/models/cartModel"); // cart 모델 불러오기

class CartService {
  // 카트 조회
  async getCart(cartId) {
    try {
      const cart = await cartModel.getCart(cartId);
      if (cart === "장바구니 없음") {
        throw new Error("장바구니를 찾을 수 없습니다.");
      }
      return cart;
    } catch (err) {
      console.error(err);
      throw new Error("카트 조회에 실패했습니다.");
    }
  }

  // 카트 아이템 추가
  async addCartItem(cartId, cartItem, userId) {
    try {
      const { productId, quantity } = cartItem;
      const cart = await cartModel.addCartItem(
        cartId,
        {
          userId,
          productId,
          quantity: parseInt(quantity),
        },
        userId
      );
      return cart;
    } catch (err) {
      console.error(err);
      throw new Error("카트 아이템 추가에 실패했습니다.");
    }
  }

  // 카트 아이템 삭제
  async removeCartItem(cartId, cartItemId) {
    try {
      const cart = await cartModel.removeCartItem(cartId, cartItemId);
      if (cart === null) {
        throw new Error("해당 카트 아이템이 존재하지 않습니다.");
      }
      return cart;
    } catch (err) {
      console.error(err);
      throw new Error("카트 아이템 삭제에 실패했습니다.");
    }
  }

  // 카트 아이템 수량 수정
  async updateCartItemQuantity(cartId, cartItemId, quantity) {
    try {
      const cart = await cartModel.updateCartItemQuantity(
        cartId,
        cartItemId,
        quantity
      );
      if (cart === null) {
        throw new Error("해당 카트 아이템이 존재하지 않습니다.");
      }
      return cart;
    } catch (err) {
      console.error(err);
      throw new Error("카트 아이템 수량 수정에 실패했습니다.");
    }
  }
}

const cartService = new CartService();
module.exports = cartService;
