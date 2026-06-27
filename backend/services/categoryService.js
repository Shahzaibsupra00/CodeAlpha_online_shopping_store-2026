const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

/**
 * Category Service — business logic for categories
 */
class CategoryService {
  async getAllCategories() {
    return Category.find().sort({ name: 1 });
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  async createCategory(data, file) {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw ApiError.conflict('Category already exists');
    }

    const image = file ? `/uploads/${file.filename}` : '';
    return Category.create({ ...data, image });
  }

  async updateCategory(id, data, file) {
    if (file) {
      data.image = `/uploads/${file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  async deleteCategory(id) {
    // Check if products use this category
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete category. ${productCount} products are using it.`
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }
}

module.exports = new CategoryService();
