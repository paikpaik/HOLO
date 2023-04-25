const express = require("express");
const ProductService = require("../service/productService");

class ProductRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", async (req, res) => {
      try {
        const products = await ProductService.getAllProducts();
        console.log("모든 상품 조회 성공!");
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 조회 중 오류가 발생했습니다." });
      }
    });

    this.router.get("/:productId", async (req, res) => {
      try {
        const productId = req.params.productId;
        const product = await ProductService.getProductById(productId);
        console.log(`id가 ${productId}인 상품 조회 성공!`);
        res.json(product);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 조회 중 오류가 발생했습니다." });
      }
    });

    this.router.post("/admin/products", async (req, res) => {
      try {
        const data = req.body;
        const product = await ProductService.createProduct(data);
        console.log(`상품 등록 성공!`);
        res.json(product);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 등록 중 오류가 발생했습니다." });
      }
    });

    this.router.put("/:productId", async (req, res) => {
      try {
        const productId = req.params.productId;
        const updateData = req.body;
        const updatedProduct = await ProductService.updateProductById(
          productId,
          updateData
        );
        console.log(`id가 ${productId}인 상품 수정 성공!`);
        res.json(updatedProduct);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 수정 중 오류가 발생했습니다." });
      }
    });

    this.router.delete("/:productId", async (req, res) => {
      try {
        const productId = req.params.productId;
        const deletedProduct = await ProductService.deleteProductById(
          productId
        );
        console.log(`id가 ${productId}인 상품 삭제 성공!`);
        res.json(deletedProduct);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 삭제 중 오류가 발생했습니다." });
      }
    });
  }
}

module.exports = new ProductRouter().router;
