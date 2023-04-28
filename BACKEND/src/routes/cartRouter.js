const { Router } = require("express");
const router = Router();
const cartService = require("../service/cartService");

// 카트 조회
router.get("/:cartId", async (req, res) => {
  try {
    const cart = await cartService.getCart(req.params.cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// 카트 아이템 추가
router.post("/:cartId/items", async (req, res) => {
  try {
    const cartItem = req.body;
    console.log(cartItem);
    const cart = await cartService.addCartItem(req.params.cartId, cartItem);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// 카트 아이템 삭제
router.delete("/:cartId/items/:cartItemId", async (req, res) => {
  try {
    const cart = await cartService.removeCartItem(
      req.params.cartId,
      req.params.cartItemId
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// 카트 아이템 수량 수정
router.patch("/:cartId/items/:cartItemId", async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const cart = await cartService.updateCartItemQuantity(
      req.params.cartId,
      req.params.cartItemId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
