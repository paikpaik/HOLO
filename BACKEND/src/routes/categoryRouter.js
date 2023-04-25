const express = require("express");
const router = express.Router();
const productService = require("../service/product-service");

router.get("/category/:categoryId", async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await productService.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
