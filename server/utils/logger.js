// A simple wrapper, could be replaced by Winston in production
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`.cyan),
  success: (msg) => console.log(`[SUCCESS] ${msg}`.green),
  error: (msg) => console.log(`[ERROR] ${msg}`.red),
  warn: (msg) => console.log(`[WARN] ${msg}`.yellow),
};
module.exports = logger;