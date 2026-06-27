/**
 * Category validation schemas
 */

const createCategorySchema = {
  name: {
    required: true,
    label: 'Category name',
    minLength: 2,
    maxLength: 100,
  },
};

module.exports = { createCategorySchema };
