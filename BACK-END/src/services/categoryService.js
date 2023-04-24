const { Product } = require('../db/models/productModel');
const { Category } = require('../db/models/categoryModel');

//카테고리ID가 category인 모든 상품 조회하여 반환
async function getProductsByCategory(categoryNo) {
  try {
    const products = await Product.find({ categoryNo }).exec();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error('상품 조회에 실패했습니다.');
  }
}

// 할인율에 따른 할인상품 조회
async function getDiscountedProductsByCategory(categoryId, discountRate) {
  const products = await Product.find({ 
    categoryNo: categoryId, 
    discountRate: { $gte: discountRate },
    // 필드간의 비교를 위해 expr 사용, 문자열과 숫자를 비교하기 위해 toDouble을 사용해서 숫자로 형변환후 형일치
    $expr: {
      $gt: [{ $toDouble: "$discountRate" }, 0.3]
    }
  });

  if (products.length === 0) {
    throw new Error('30% 이상 할인된 상품이 존재하지 않습니다.');
  }

  return products;
}

// 구매수가 10 이상인 인기 상품 조회
async function getPopularProductsByCategory(categoryId) {
  const products = await Product.aggregate([
    {
      // 카테고리번호와 카테고리아이디가 일치하는지 확인
      $match: { categoryNo: categoryId }
    },
    {
      // 구매율이 10 이상인 상품만 조회
      $match: { purchaseNum: { $gte: 10 } }
    }
  ]);

  if (products.length === 0) {
    throw new Error('조회된 상품이 없습니다.');
  }

  return products;
}

module.exports = { getProductsByCategory, getDiscountedProductsByCategory, getPopularProductsByCategory };

