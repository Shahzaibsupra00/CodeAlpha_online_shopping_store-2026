const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { requestLogger } = require('./middlewares/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ── Security Middleware ──
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());

// ── Body Parser ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
app.use(requestLogger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Rate Limiting ──
app.use('/api', apiLimiter);

// ── Static Files ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// ── Serve Frontend Pages ──
// Catch-all for frontend HTML pages (SPA-style)
app.get('*.html', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', '404.html'));
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Error Handling ──
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

module.exports = app;
