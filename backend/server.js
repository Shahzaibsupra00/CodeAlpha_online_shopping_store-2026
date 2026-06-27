const app = require('./app');
const config = require('./config/config');
const connectDB = require('./database/connection');

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`\n🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`📦 API: http://localhost:${config.port}/api`);
      console.log(`🌐 App: http://localhost:${config.port}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

startServer();
