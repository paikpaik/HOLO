const categoryModel = require("../db/models/categoryModel");
const productModel = require("../db/models/productModel");
const fs = require("fs-extra");

class ProductService {
  // 관리자 카테고리 추가
  async addCategory(req, res) {
    const category = req.body.category;
    if (!category) {
      throw new Error("추가할 카테고리가 존재하지 않습니다.");
    }
    const existingCategory = await productModel.findAllCategories();
    if (existingCategory.includes(category)) {
      throw new Error("해당 카테고리가 이미 존재합니다.");
    }
    return categoryModel.create({ category: category });
  }

  // 관리자 카테고리 수정
  async updateCategory(req, res) {
    const categoryId = req.params.categoryId;
    const { newCategory } = req.body;
    const existingCategory = await categoryModel.findById(categoryId);
    if (!existingCategory) {
      throw new Error("해당 카테고리를 찾을 수 없습니다.");
    }
    return categoryModel.findByIdAndUpdate(
      categoryId,
      { category: newCategory },
      { new: true }
    );
  }

  // 관리자 카테고리 삭제
  async deleteCategory(req, res) {
    const categoryId = req.params.categoryId;
    const existingCategory = await categoryModel.findById(categoryId);
    if (!existingCategory) {
      throw new Error("해당 카테고리를 찾을 수 없습니다.");
    }
    return categoryModel.findByIdAndDelete(categoryId);
  }

  // 관리자 상품 추가
  async addProduct(req, res) {
    const {
      productName,
      category,
      price,
      discountRate,
      shortDesc,
      longDesc,
      purchaseNum,
      stock,
    } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const createInfo = {
      productName,
      category,
      price,
      discountRate,
      shortDesc,
      longDesc,
      imagePaths,
      purchaseNum,
      stock,
    };

    const existingProduct = await productModel.findByProductName(productName);
    if (existingProduct) {
      throw new Error("이미 존재하는 상품입니다.");
    }
    return productModel.createProduct(createInfo);
  }

  // 관리자 상품 수정
  async updateProduct(req, res) {
    const productId = req.params.productId;
    const {
      productName,
      category,
      price,
      discountRate,
      shortDesc,
      longDesc,
      purchaseNum,
      stock,
    } = req.body;
    const createInfo = {
      productName,
      category,
      price,
      discountRate,
      shortDesc,
      longDesc,
      purchaseNum,
      stock,
    };
    const existingProduct = await productModel.findByProductId(productId);
    if (!existingProduct) {
      throw new Error("해당 상품을 찾을 수 없습니다.");
    }
    const isDuplicateName = await productModel.isDuplicateProductName(
      productName,
      productId
    );
    if (isDuplicateName) {
      throw new Error("이미 존재하는 상품입니다.");
    }
    const updatedProduct = await productModel.updateById(productId, createInfo);

    // 이미지 업로드
    const imagePaths = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagePath = file.path.replace(/\\/g, "/");
        imagePaths.push(imagePath);
      }
    }

    // 기존 이미지 삭제
    const existingImagePaths = updatedProduct.imagePaths;
    for (const imagePath of existingImagePaths) {
      await fs.unlink(imagePath); // 이미지 파일 삭제
    }
    
    // 새로운 이미지 저장
    const allImagePaths = imagePaths;
    // 이미지 정보 업데이트
    return productModel.updateById(
      productId,
      { imagePaths: allImagePaths }
    );
  }
    
  // 관리자 상품 삭제
  async deleteProduct(req, res){
    const { productId } = req.params;
    const product = await productModel.findByProductId(productId);
    if (!product) {
      throw new Error('해당 상품을 찾을 수 없습니다.');
    }
    // 이미지 파일 삭제
    const existingImagePaths = product.imagePaths;
    for (const imagePath of existingImagePaths) {
      await fs.unlink(imagePath);
    }
    return productModel.deleteById(productId);
  }
    
  // 사용자 카테고리 조회
  getCategoryList(req, res){
    return productModel.findAllCategories();
  }
    
  // 사용자가 특정 카테고리를 선택시 카테고리의 속한 모든 상품을 조회
  getProductList(req, res){
    const { category } = req.params;
    return productModel.findByCategory(category);
  }
    
  // 사용자가 할인상품 카테고리를 선택시 discountRate 30%이상인 모든 상품을 조회
  getDiscountedProducts(req, res){
    return productModel.findByDiscountRate(30);
  }
    
  // 사용자가 인기상품 카테고리를 선택시 purchaseNum 10이상인 모든 상품을 조회
  getPopularProducts(req, res){
    return productModel.findByPurchaseNum(10);
  }

  // 사용자가 전체상품 카테고리를 선택시 모든 상품을 조회
  getAllProducts(req, res){
    return productModel.findByAll(0);
  }
    
  // 사용자가 상품 상제정보 확인
  getProductDetail(req, res){
    const { productId } = req.params;
    return productModel.findByProductId(productId);
  }
}

const productService = new ProductService();

module.exports = productService;
