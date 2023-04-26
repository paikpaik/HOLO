const { Router } = require("express");
const router = Router();
const productService = require('../service/productService');
const isAdmin = require('../middlewares/isAdmin');
// ********** 관리자 페이지 입니다. **********
// 관리자 카테고리 추가, 됨
router.post("/admin/category", productService.addCategory);

// 관리자 카테고리 수정, 됨
router.patch("/admin/category/:categoryId", productService.updateCategory);

// 관리자 카테고리 삭제, 됨
router.delete("/admin/category/:categoryId", productService.deleteCategory);

// 관리자 상품 추가, 됨
router.post('/admin', isAdmin, productService.addProduct);

// 관리자 상품 수정, 됨
router.patch("/admin/:productId", productService.updateProduct);

// 관리자 상품 삭제, 됨
router.delete("/admin/:productId", productService.deleteProduct);

// ********** 사용자 관련 페이지 입니다. **********
// 사용자 카테고리목록 조회, 됨
router.get("/", productService.getCategoryList);

// 사용자 카테고리별 상품 조회, 됨
// categoryId는 육류, 채소류 등등 입니다.
router.get("/category/:categoryId", productService.getProductList);

// 사용자 할인상품 조회
router.get("/discount", productService.getDiscountedProducts);

// 사용자 인기상품 조회
router.get("/popular", productService.getPopularProducts);

// 사용자 상품 상세페이지
router.get("/:productId", productService.getProductDetail);

// 상품 문의 생성
router.post("/create-inquiries", async (req, res) => {
  const inquiry = req.body;
  const savedInquiry = await productInquiryService.createProductInquiry(
    inquiry
  );
  res.json(savedInquiry);
});

// 상품 문의 수정
router.patch("/edit-inquiries/:inquiryId", async (req, res) => {
  const inquiryId = req.params.inquiryId;
  const updatedInquiry = req.body;
  const updated = await productInquiryService.updateProductInquiry(
    inquiryId,
    updatedInquiry
  );
  res.json(updated);
});

// 상품 문의 삭제
router.delete("/delete-inquiries/:inquiryId", async (req, res) => {
  const inquiryId = req.params.inquiryId;
  const deletedInquiry = await productInquiryService.deleteProductInquiry(
    inquiryId
  );
  res.status(200).json({
    message: "문의가 삭제되었습니다.",
    order: deletedInquiry,
  });
});

module.exports = router;
