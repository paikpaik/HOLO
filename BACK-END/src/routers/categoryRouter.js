const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/category/:categoryId', async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await productService.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/category/:categoryId/discounted-products/:discountRate', async (req, res, next) => {
  const { categoryId, discountRate } = req.params;
  try {
    const products = await productService.getDiscountedProductsByCategory(categoryId, discountRate);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/category/:categoryId/popular-products', async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await productService.getPopularProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;