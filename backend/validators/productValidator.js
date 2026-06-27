/**
 * Product validation schemas
 */

const createProductSchema = {
  title: {
    required: true,
    label: 'Title',
    minLength: 2,
    maxLength: 200,
  },
  description: {
    required: true,
    label: 'Description',
    minLength: 10,
    maxLength: 2000,
  },
  price: {
    required: true,
    label: 'Price',
    min: 0,
  },
  category: {
    required: true,
    label: 'Category',
  },
  stock: {
    required: true,
    label: 'Stock',
    min: 0,
  },
};

const updateProductSchema = {
  title: {
    required: false,
    label: 'Title',
    minLength: 2,
    maxLength: 200,
  },
  price: {
    required: false,
    label: 'Price',
    min: 0,
  },
};

module.exports = {
  createProductSchema,
  updateProductSchema,
};
