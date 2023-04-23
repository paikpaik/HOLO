const Product = require('../models/productModel');

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

// 할인율에 따른 할인상품 조회
async function getDiscountedProductsByCategory(categoryId, discountRate) {
  const products = await Product.find({ categoryNo: categoryId, discountRate: { $gte: discountRate } });
  return products;
}

// 구매수가 10 이상인 인기 상품 조회
async function getPopularProductsByCategory(categoryId) {
  const products = await Product.find({ categoryNo: categoryId, purchaseNum: { $gte: 10 } });
  return products;
}

module.exports = { getProductsByCategory, getDiscountedProductsByCategory, getPopularProductsByCategory };

