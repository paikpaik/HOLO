const express = require("express");
const ProductService = require("../services/productService");
const ProductInquiryService = require("../services/productInquiryService");
class ProductRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // 관리자 페이지에서 모든 상품 조회
    this.router.get("/admin/products", async (req, res) => {
      try {
        const products = await ProductService.getAllProducts();
        console.log("모든 상품 조회 성공!");
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 조회 중 오류가 발생했습니다." });
      }
    });

    // 관리자 페이지에서 특정 상품 조회
    this.router.get("/admin/products/:productId", async (req, res) => {
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

    // 관리자 페이지에서 상품 등록
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

    // 관리자 페이지에서 상품 정보 수정
    this.router.put("/admin/products/:productId", async (req, res) => {
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

    // 관리자 페이지에서 상품 삭제
    this.router.delete("/admin/products/:productId", async (req, res) => {
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

    // 상품 상세페이지로 이동
    this.router.get("/product/:productId", async (req, res, next) => {
      const productId = req.params.productId;
      try {
        const product = await ProductService.getProductById(productId);
        res.json(product);
      } catch (error) {
        next(error);
      }
    });

    // 모든 상품 문의 조회
    this.router.get("/inquiries", async (req, res) => {
      const inquiries = await ProductInquiryService.getAllProductInquiries();
      res.json(inquiries);
    });

    // 상품 문의 생성
    this.router.post("/inquiries", async (req, res) => {
      const inquiry = req.body;
      const savedInquiry = await ProductInquiryService.createProductInquiry(
        inquiry
      );
      res.json(savedInquiry);
    });

    // 상품 문의 수정
    this.router.put("/inquiries/:inquiryId", async (req, res) => {
      const inquiryId = req.params.inquiryId;
      const updatedInquiry = req.body;
      const updated = await ProductInquiryService.updateProductInquiry(
        inquiryId,
        updatedInquiry
      );
      res.json(updated);
    });

    // 상품 문의 삭제
    this.router.delete("/inquiries/:inquiryId", async (req, res) => {
      const inquiryId = req.params.inquiryId;
      await ProductInquiryService.deleteProductInquiry(inquiryId);
      res.sendStatus(204); // No Content
    });
  }
}

module.exports = new ProductRouter().router;
