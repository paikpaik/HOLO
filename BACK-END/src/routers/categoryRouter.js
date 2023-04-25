// 돌아가면 지울거임

// const express = require('express');
// const router = express.Router();
// const productService = require('../services/productService');

// // categoryId에 해당하는 카테고리로 이동
// router.get('/category/:categoryId', async (req, res, next) => {
//   const categoryId = req.params.categoryId;
//   try {
//     const products = await productService.getProductsByCategory(categoryId);
//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// // discountRate 이상인 상품은 모두 가져오기[현재 30%로 지정]
// router.get('/category/:categoryId/discounted-products/:discountRate', async (req, res, next) => {
//   const { categoryId, discountRate } = req.params;
//   try {
//     const products = await productService.getDiscountedProductsByCategory(categoryId, discountRate);
//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// // purchaseNum 이상인 상품은 모두 가져오기 [현재 10으로 지정]
// router.get('/category/:categoryId/popular-products', async (req, res, next) => {
//   const categoryId = req.params.categoryId;
//   try {
//     const products = await productService.getPopularProductsByCategory(categoryId);
//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;