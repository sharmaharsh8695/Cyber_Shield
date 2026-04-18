const { detectAttack } = require("../services/ruleEngine");
const logService = require("../services/logs-service");

async function idsMiddleware(req, res, next) {
  try {
    const payload = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const result = detectAttack(payload);

    // 🚫 BLOCK
    if (result.detected) {
      await logService.log({
        apiKey: req.apiKey,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        type: result.type,
        action: "BLOCKED"
      });

      return res.status(403).json({
        success: false,
        blocked: true,
        reason: result.type,
        message: "Request blocked by IDS"
      });
    }

    // ✅ ALLOW
    await logService.log({
      apiKey: req.apiKey,
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      type: "NORMAL",
      action: "ALLOWED"
    });

    next();

  } catch (err) {
    console.error("IDS Error:", err);
    next(); // fail open
  }
}

module.exports = { idsMiddleware };