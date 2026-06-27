const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total must be positive'],
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash on Delivery', 'Credit/Debit Card', 'PayPal', 'Bank Transfer'],
      default: 'Cash on Delivery',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for user queries
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
