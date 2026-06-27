const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 12,
    maxLimit: 100,
  },
};

module.exports = config;
