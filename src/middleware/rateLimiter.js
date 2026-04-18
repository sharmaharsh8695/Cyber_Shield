const requestMap = new Map();
const logService = require('../services/logs-service');
// config
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

async function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requestMap.has(ip)) {
    requestMap.set(ip, []);
  }

  const timestamps = requestMap.get(ip);


  // remove old requests
  const validRequests = timestamps.filter(
    (time) => now - time < WINDOW_SIZE
  );

  validRequests.push(now);
  requestMap.set(ip, validRequests);



  if (validRequests.length > MAX_REQUESTS) {

    await logService.log({
        apiKey: req.apiKey,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        type: "RATE_LIMIT_EXCEEDED",
        action: "BLOCKED"
    });

    return res.status(429).json({
      success: false,
      blocked: true,
      reason: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests"
    });
  }

  next();
}

module.exports = { rateLimiter };