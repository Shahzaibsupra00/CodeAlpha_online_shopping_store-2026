const categoryService = require('../services/categoryService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Category Controller
 */
const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories();
      ApiResponse.success(res, categories);
    } catch (error) {
      next(error);
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      ApiResponse.success(res, { category });
    } catch (error) {
      next(error);
    }
  },

  createCategory: async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.body, req.file);
      ApiResponse.created(res, { category }, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body,
        req.file
      );
      ApiResponse.success(res, { category }, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      await categoryService.deleteCategory(req.params.id);
      ApiResponse.success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
