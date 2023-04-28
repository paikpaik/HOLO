const mongoose = require("mongoose");
const ProductSchema = require("../schemas/product");

// ProductSchema를 기반으로 한 Product Mongoose 모델 생성
const Product = mongoose.model("products", ProductSchema);

class ProductModel {
  // 모든 카테고리 조회
  async findAllCategories() {
    const categories = await Product.distinct("category");
    return categories;
  }

  // 상품명을 사용하여 상품을 찾기
  async findByProductName(productName) {
    const product = await Product.findOne({ productName });
    return product;
  }

  // 상품 ID를 사용하여 상품 찾기
  async findByProductId(productId) {
    const product = await Product.findById(productId);
    return product;
  }

  // 상품 정보를 사용하여 새로운 상품을 생성
  async createProduct(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  // 상품명을 제외하고 해당 상품명을 가진 다른 상품이 있는지 확인
  async isDuplicateProductName(productName, productId) {
    const product = await Product.findOne({
      productName,
      _id: { $ne: productId },
    });
    return product;
  }

  // 카테고리에 따른 상품 조회
  async findByCategory(category) {
    const products = await Product.find({ category: category });
    return products;
  }


  // 할인율에 따른 상품 조회
  async findByDiscountRate(rate) {
    const products = await Product.find({ discountRate: { $gte: rate } });
    return products;
  }  

  // 구매 수량에 따른 상품 조회
  async findByPurchaseNum(num) {
      const products = await Product.find({ purchaseNum: { $gte: num } });
      return products;
  }

  // 전체 상품 조회
  async findByAll(rate) {
    const products = await Product.find({ discountRate: { $gte: rate } });
    return products;
  } 

  // 상품 정보 업데이트
  async updateById(productId, updateData) {
    const option = { returnOriginal: false, new: true };
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      option
    );
    return updatedProduct;
  }

  // 상품 번호를 사용하여 상품 삭제
  async deleteById(productId) {
    const result = await Product.findByIdAndDelete(productId);
    return result;
  }

  // 상품번호가져오기
  async getProductById(productId) {
    const product = await Product.findById(productId);
    return product;
  }

  // 재고수 감소
  async updateProductStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (quantity > 0) {
      product.stock += quantity;
    } else {
      product.stock -= Math.abs(quantity);
    }
    await product.save();
  }
  
  async updatePurchaseNum(productId, quantity) {
    const product = await Product.findById(productId);
    product.purchaseNum += quantity;
    await product.save();
  }
}


// ProductModel 인스턴스 생성
const productModel = new ProductModel();

// productModel 내보내기
module.exports = productModel;
