/**
 * Application-wide constants
 */
module.exports = {
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },
  ORDER_STATUS: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  },
  PAYMENT_METHODS: {
    COD: 'Cash on Delivery',
    CARD: 'Credit/Debit Card',
    PAYPAL: 'PayPal',
    BANK: 'Bank Transfer',
  },
  SORT_OPTIONS: {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    PRICE_LOW: 'price_low',
    PRICE_HIGH: 'price_high',
    NAME_AZ: 'name_az',
    NAME_ZA: 'name_za',
    RATING: 'rating',
  },
};
