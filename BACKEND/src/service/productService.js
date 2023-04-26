const { Category } = require("../db/models/categoryModel");
const { Product } = require("../db/models/productModel");
const errorHandler = require("../middlewares/error-handler");

const productService = {
  // 관리자 카테고리 추가
  async addCategory(req, res, next) {
    try {
      const category = req.body.category;
      if (!category) {
        throw new Error("추가할 카테고리가 존재하지 않습니다.");
      }
      const existingCategory = await Product.distinct("category");
      if (existingCategory.includes(category)) {
        throw new Error("해당 카테고리가 이미 존재합니다.");
      }

      const newCategory = await Category.create({ category: category });
      res
        .status(201)
        .json({ message: "카테고리 추가 성공", data: newCategory });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 관리자 카테고리 수정
  async updateCategory(req, res, next) {
    try {
      const { category, newCategory } = req.body;
      const updateCategory = await Category.findOneAndUpdate(
        { category: category },
        { category: newCategory },
        { new: true }
      );
      if (!updateCategory) {
        throw new Error("수정할 카테고리가 존재하지 않습니다.");
      }
      res
        .status(201)
        .json({ message: "카테고리 수정 성공", data: updateCategory });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 관리자 카테고리 삭제
  async deleteCategory(req, res, next) {
    try {
      const { category } = req.body;
      const deletedCategory = await Category.findOneAndDelete({
        category: category,
      });
      if (!deletedCategory) {
        throw new Error("삭제할 카테고리가 존재하지 않습니다.");
      }
      res.status(200).json({ message: "카테고리 삭제 성공" });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 관리자 상품 추가
  async addProduct(req, res, next) {
    try {
      const {
        productNo,
        productName,
        category,
        price,
        discountRate,
        shortDesc,
        longDesc,
        imageUrl,
        purchaseNum,
        stock,
        originLabel,
      } = req.body;
      const createInfo = {
        productNo,
        productName,
        category,
        price,
        discountRate,
        shortDesc,
        longDesc,
        imageUrl,
        purchaseNum,
        stock,
        originLabel,
      };
      // 상품명이 중복인지 확인
      const existingProduct = await Product.findOne({ productName });
      if (existingProduct) {
        throw new Error("이미 존재하는 상품입니다.");
      }
      const newProduct = new Product(createInfo);
      const createdProduct = await newProduct.save();
      res.status(201).json({ message: "상품 추가 성공", data: createdProduct });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 관리자 상품 수정
  async updateProduct(req, res, next) {
    try {
      const productId = req.params.productId;
      const {
        productNo,
        productName,
        category,
        price,
        discountRate,
        shortDesc,
        longDesc,
        imageUrl,
        purchaseNum,
        stock,
        originLabel,
      } = req.body;
      const createInfo = {
        productNo,
        productName,
        category,
        price,
        discountRate,
        shortDesc,
        longDesc,
        imageUrl,
        purchaseNum,
        stock,
        originLabel,
      };
      // 같은 상품이 존재하는지 확인
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw new Error("해당 상품을 찾을 수 없습니다.");
      }
      // 상품명이 중복인지 확인
      const isDuplicateName = await Product.findOne({
        productName,
        _id: { $ne: productId },
      });
      if (isDuplicateName) {
        throw new Error("이미 존재하는 상품입니다.");
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        createInfo,
        { new: true }
      );
      res.status(200).json({ message: "상품 수정 성공", data: updatedProduct });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 관리자 상품 삭제
  async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error("존재하지 않는 상품입니다.");
      }
      res.status(200).json({ message: "상품 삭제 성공", data: deletedProduct });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 사용자 카테고리 조회
  async getCategoryList(req, res, next) {
    try {
      const foundCategories = await Product.distinct("category");
      if (!foundCategories) {
        throw new Error("카테고리 목록을 찾을 수 없습니다.");
      }
      res
        .status(200)
        .json({ message: "카테고리 목록 조회 성공", data: foundCategories });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 사용자가 특정 카테고리를 선택시 카테고리의 속한 모든 상품을 조회
  async getProductList(req, res, next) {
    try {
      const { categoryId } = req.params;
      const productList = await Product.find({ category: categoryId });
      res
        .status(200)
        .json({ message: "상품 목록 조회 성공", data: productList });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 사용자가 할인상품 카테고리를 선택시 discountRate 30%이상인 모든 상품을 조회
  async getDiscountedProducts(req, res, next) {
    try {
      // discountRate가 30 이상인 상품 조회
      const discountedProducts = await Product.find({
        discountRate: { $gte: 30 },
      });
      if (discountedProducts.length === 0) {
        return res
          .status(404)
          .json({ message: "조회된 할인 상품이 없습니다." });
      }
      res
        .status(200)
        .json({
          message: "할인 상품 목록 조회 성공",
          data: discountedProducts,
        });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 사용자가 인기상품 카테고리를 선택시 purchaseNum 10이상인 모든 상품을 조회
  async getPopularProducts(req, res, next) {
    try {
      // purchaseNum이 10 이상인 상품 조회
      const popularProducts = await Product.find({ purchaseNum: { $gte: 10 } });
      res
        .status(200)
        .json({ message: "인기상품 조회 성공", data: popularProducts });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },

  // 사용자가 상품 상제정보 확인
  async getProductDetail(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("존재하지 않는 상품입니다.");
      }
      res.status(200).json({ message: "상품 조회 성공", data: product });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  },
};

module.exports = productService;
