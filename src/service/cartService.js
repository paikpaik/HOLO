const cartModel = require("../db/models/cartModel"); // cart 모델 불러오기

class CartService {
  // 카트 조회
  async getCart(cartId) {
    const cart = await cartModel.getCart(cartId);
    if (cart === "장바구니 없음") {
      throw new Error("장바구니를 찾을 수 없습니다.");
    }
    return cart;
  }

  // 카트 아이템 추가
  async addCartItem(cartId, cartItem) {
    const cart = await cartModel.addCartItem(cartId, cartItem);
    return cart;
  }

  // 카트 아이템 삭제
  async removeCartItem(cartId, cartItemId) {
    const cart = await cartModel.removeCartItem(cartId, cartItemId);
    if (cart === null) {
      throw new Error("해당 카트 아이템이 존재하지 않습니다.");
    }
    return cart;
  }

  // 카트 아이템 수량 수정
  async updateCartItemQuantity(cartId, cartItemId, quantity) {
    const cart = await cartModel.getCart(cartId);
    const cartItem = cart.cartItems.find(
      (item) => item._id.toString() === cartItemId
    );
    if (!cartItem) {
      throw new Error("해당 카트 아이템이 존재하지 않습니다.");
    }
    cartItem.quantity = quantity;
    await cart.save();
    return cart;
  }
}

const cartService = new CartService();
module.exports = cartService;
