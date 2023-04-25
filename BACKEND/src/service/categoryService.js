const Product = require('../models/product-model');

//카테고리ID가 category인 모든 상품 조회하여 반환
async function getProductsByCategory(category) {
  try {
    const products = await Product.find({ categoryId: category }).exec();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error('상품 조회에 실패했습니다.');
  }
}

module.exports = { getProductsByCategory };

