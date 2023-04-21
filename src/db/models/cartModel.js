const mongoose = require("mongoose");
const CartSchema = require("../schemas/cart");

// CartSchema를 기반으로 한 Cart Mongoose 모델 생성
const Cart = mongoose.model("carts", CartSchema);

class CartModel {
  // 카트 조회 및 생성
  async getCart(cartId) {
    // cartId를 기반으로 해당 장바구니 조회
    const cart = await Cart.findOne({ cartId });

    // 조회된 장바구니가 없다면 메시지 반환
    if (!cart) {
      return "장바구니 없음";
    }

    // 장바구니의 cartItems 배열을 확장하여 실제 카트 아이템 객체를 포함시킨다.
    await cart.populate("cartItems").execPopulate();
    return cart;
  }

  //카트 아이템 추가
  async addCartItem(cartId, cartItem) {
    // cartId를 기반으로 해당 장바구니 조회
    const cart = await Cart.findOne({ cartId });

    // 조회된 장바구니가 없다면 새로운 장바구니를 생성한다.
    if (!cart) {
      return await Cart.create({
        cartId,
        userId: cartItem.userId,
        cartItems: [cartItem],
        totalPrice: cartItem.quantity * cartItem.productId.price,
      });
    }

    // 카트 아이템 추가
    cart.cartItems.push(cartItem);
    cart.totalPrice += cartItem.quantity * cartItem.productId.price;

    // 장바구니 업데이트
    await cart.save();

    // 업데이트된 장바구니를 반환
    return cart;
  }

  // 카트 아이템 수량 조정 및 삭제
  async removeCartItem(cartId, cartItemId) {
    // cartId를 기반으로 해당 장바구니 조회
    const cart = await Cart.findOne({ cartId });

    // 조회된 장바구니가 없다면 메시지 반환
    if (!cart) {
      return "삭제할 장바구니 없음";
    }
    // 장바구니에서 카트 아이템 삭제
    const cartItemIndex = cart.cartItems.findIndex(
      (cartItem) => cartItem._id.toString() === cartItemId
    );
    if (cartItemIndex === -1) {
      return null;
    }

    const removedCartItem = cart.cartItems.splice(cartItemIndex, 1)[0];

    // 카트 아이템이 1개 이상인 경우
    if (cart.cartItems.length > 0) {
      cart.totalPrice -=
        removedCartItem.quantity * removedCartItem.productId.price;
    } else {
      cart.totalPrice = 0;
    }

    // 장바구니 업데이트
    await cart.save();

    // 업데이트된 장바구니를 반환
    return cart;
  }
}
// cartModel 인스턴스 생성
const cartModel = new CartModel();

// cartModel 인스턴스 내보내기
module.exports = cartModel;
