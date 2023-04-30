const mongoose = require('mongoose');
const CategorySchema = require('../schemas/category');

// CategorySchema를 기반으로 한 Category Mongoose 모델 생성
const Category = mongoose.model('categories', CategorySchema);

class CategoryModel {

  // 카테고리 ID를 사용하여 카테고리 찾기
  async findById(categoryId) {
    const category = await Category.findById(categoryId);
    return category;
  }

  // 새로운 카테고리 생성
  async create(categoryInfo) {
    const newCategory = await Category.create(categoryInfo);
    return newCategory;
  }

  // 카테고리 정보 업데이트
  async findByIdAndUpdate(categoryId, updateData, options) {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, options);
    return updatedCategory;
  }

  // 카테고리 삭제
  async findByIdAndDelete(categoryId) {
    const result = await Category.findByIdAndDelete(categoryId);
    return result;
  }
}

// CategoryModel 인스턴스 생성
const categoryModel = new CategoryModel();

// categoryModel 내보내기
module.exports = categoryModel;
