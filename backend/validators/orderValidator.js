/**
 * Order validation schemas
 */

const createOrderSchema = {
  paymentMethod: {
    required: true,
    label: 'Payment method',
    enum: ['Cash on Delivery', 'Credit/Debit Card', 'PayPal', 'Bank Transfer'],
  },
};

module.exports = { createOrderSchema };
