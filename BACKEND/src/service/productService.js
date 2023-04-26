const { Product } = require("../db/models/productModel");

class ProductService {
  // 새 제품을 생성하고 db에 저장
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // 저장된 모든 제품을 조회하고 정보를 배열로 반환
  async getAllProducts() {
    const products = await Product.find({});
    return products;
  }

  // productId에 해당하는 제품을 조회해서 정보를 반환
  async getProductById(productId) {
    const product = await Product.findOne({ productNo: productId });
    return product;
  }

  // productId에 해당하는 제품을 updateData로 업데이트해서 정보를 반환
  async updateProductById(productId, updateData) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );
    return updatedProduct;
  }

  // productId에 해당하는 제품을 삭제하고 메시지를 반환. 함수를 호출할 때 반환값이 필요없음.
  async deleteProductById(productId) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
      console.log("해당 제품이 삭제되었습니다.");
      return true;
    } else {
      console.log("제품을 삭제하는 데 실패했습니다.");
      return false;
    }
  }
}

module.exports = new ProductService();
