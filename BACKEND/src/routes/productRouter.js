const { Router } = require("express");
const router = Router();
const productService = require('../service/productService');
const upload = require('../middlewares/multer');
const isAdmin = require('../middlewares/isAdmin');
const loginRequired = require('../middlewares/login-required');

// ********** 관리자 페이지 입니다. **********
// 관리자 카테고리 추가, 됨
router.post('/admin/category', loginRequired, isAdmin, productService.addCategory)

// 관리자 카테고리 수정, 됨
router.patch('/admin/category/:categoryId', loginRequired, isAdmin, productService.updateCategory)

// 관리자 카테고리 삭제, 됨
router.delete('/admin/category/:categoryId', loginRequired, isAdmin, productService.deleteCategory)

// 관리자 상품 추가, 됨
router.post('/admin', loginRequired, isAdmin, upload.array('image', 10), productService.addProduct);

// 관리자 상품 수정, 됨
router.patch('/admin/:productId', loginRequired, isAdmin, upload.array('image', 10), productService.updateProduct);

// 관리자 상품 삭제, 됨
router.delete('/admin/:productId', loginRequired, isAdmin, productService.deleteProduct);

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


module.exports = router;