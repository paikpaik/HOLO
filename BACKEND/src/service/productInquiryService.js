const { ProductInquiry } = require('../db/models/productInquiryModel');
// // 모든 상품 문의 조회
// async function getAllProductInquiries() {
//   const inquiries = await ProductInquiry.find();
//   return inquiries;
// }

// 상품 문의 생성
async function createProductInquiry(inquiry) {
  const newInquiry = new ProductInquiry(inquiry);
  const savedInquiry = await newInquiry.save();
  return savedInquiry;
}

// 상품 문의 수정
async function updateProductInquiry(inquiryId, updatedInquiry) {
  const updated = await ProductInquiry.findByIdAndUpdate(
    inquiryId,
    updatedInquiry,
    // 업데이트 된 문의 객체를 반환
    { new: true }
  );
  return updated;
}

// 상품 문의 삭제
async function deleteProductInquiry(inquiryId) {
  await ProductInquiry.findByIdAndDelete(inquiryId);
}

module.exports = { getAllProductInquiries, createProductInquiry, updateProductInquiry, deleteProductInquiry}
