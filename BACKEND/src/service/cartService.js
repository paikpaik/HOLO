const cartModel = require('../db/models/cartModel'); // cart 모델 불러오기
//const Product = require('../db/models/productModel'); // product 모델 불러오기

class CartService {
  static async getCartByUserId(userId) {
    try {
      const cart = await cartModel.findOrCreateCartByUserId(userId);
      return cart;
    } catch (error) {
      throw new Error('Error while getting cart by user ID: ' + error.message);
    }
  }

 static async addCartItem(userId, cartItem) {
    try {
      const cart = await cartModel.addCartItem(userId, cartItem);
      return cart;
    } catch (error) {
      throw new Error('Error while adding cart item: ' + error.message);
    }
  }

  static async updateCartTotalPrice(cart) {
    try {
      await cart.updateCartTotalPrice();
      return cart;
    } catch (error) {
      throw new Error('Error while updating cart total price: ' + error.message);
    }
  }
}
// const cartService = new CartService();
module.exports = CartService;