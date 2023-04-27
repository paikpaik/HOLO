const mongoose = require("mongoose");
const ProductSchema = require("../schemas/product");
const Product = mongoose.model("Product", ProductSchema);

class ProductModel {
  async getProductById(productId) {
    const product = await Product.findById(productId);
    return product;
  }

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

//OrderModel 인스턴스 생성
const productModel = new ProductModel();

// orderModel 내보내기
module.exports = productModel;
