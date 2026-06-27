const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Custom request logger middleware
 * Logs request method, URL, status, and response time
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    // Console log
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(`${color}${log}\x1b[0m`);

    // File log
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFile(logFile, log + '\n', (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  });

  next();
};

module.exports = { requestLogger };
