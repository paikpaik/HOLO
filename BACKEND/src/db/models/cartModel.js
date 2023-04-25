const mongoose = require('mongoose');
const CartSchema = require('../schemas/cart');

const Cart = mongoose.model('carts', CartSchema);

class CartModel {
   
    static async findOrCreateCartByUserId(userId) {
        // 유저 ID로 카트 조회
        const cart = await Cart.findOne({ userId });
      
        // 카트가 없을 경우 새로운 카트 생성
        if (!cart) {
          const newCart = new Cart({ userId });
          await newCart.save();
          return newCart;
        }
      
        return cart;
      }

    async updateCartTotalPrice() {
      try {
        let total = 0;
        for (let i = 0; i < this.cartData.cartItems.length; i++) {
          const cartItem = this.cartData.cartItems[i];
          total += cartItem.quantity * cartItem.productId.price;
        }
        this.cartData.totalPrice = total;
        await this.cartData.save();
      } catch (error) {
        throw new Error('Error while updating cart total price: ' + error.message);
      }
    }
  
    static async addCartItem(userId, cartItem) {
        const cart = await Cart.findOrCreateCartByUserId(userId);
    
        // 이미 추가된 상품인 경우 수량 업데이트
        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.productId.toString() === cartItem.productId.toString()
        );
        if (existingItemIndex >= 0) {
          cart.cartItems[existingItemIndex].quantity += cartItem.quantity;
        } else {
          cart.cartItems.push(cartItem);
        }
    
        // 카트 아이템들의 가격 합산하여 카트의 총 가격 업데이트
        let totalPrice = 0;
        cart.cartItems.forEach((item) => {
          totalPrice += item.productId.price * item.quantity;
        });
        cart.totalPrice = totalPrice;
    
        await cart.save();
        return cart;
      }
} 
// cartModel 인스턴스 생성
const cartModel = new CartModel();

// cartModel 인스턴스 내보내기
module.exports = cartModel;
