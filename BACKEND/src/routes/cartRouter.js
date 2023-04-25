const { Router } = require('express');
const router = Router();
const CartService = require('../service/cartService');
const cartService = new CartService();


router.post('/add', async (req, res) => {
  const { userId, cartItem } = req.body;
  try {
    const cart = await cartService.addCartItem(userId, cartItem);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '카트에 상품을 추가하지 못했습니다.' });
  }
});


module.exports = router;


// // 장바구니 조회 라우터
// router.get('/api/carts', async (req, res)=> {
//     const cartView = req.body;

//     try {
//         await cartService.presentCart(cartView);
//         res.status(200).send();
//     } catch (err) {
//         console.log(err);
//         res.status(500).send(`${err}`);
//     }
// });

// // 장바구니 삭제 라우터
// router.delete('/api/carts', async (req, res)=> {
//     const cartInfo = req.body;

//     try {
//         await cartService.cancelCart(cartInfo);
//         res.status(200).send();
//     } catch (err) {
//         console.log(err);
//         res.status(500).send(`${err}`);
//     }
// });

