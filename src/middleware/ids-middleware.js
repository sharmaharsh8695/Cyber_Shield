const { detectAttack } = require("../services/ruleEngine");
const logService = require("../services/logs-service");
const { analyzeWithAI } = require("../services/ai-service.js");

async function idsMiddleware(req, res, next) {
  try {
    const payload = {
      body: req.body,
      query: req.query,
      params: req.params
    };
const result = detectAttack(payload);

    let decision = "ALLOW";
    let reason = "NORMAL";
    let risk = "LOW";

    // 🔴 Rule-based detection
    if (result.detected) {
      decision = "BLOCK";
      reason = result.type;
      risk = "HIGH";
    } else {
      // 🧠 AI-based analysis
      const aiResult = await analyzeWithAI(payload);

      if (aiResult.classification === "MALICIOUS") {
        decision = "BLOCK";
      } else if (aiResult.classification === "SUSPICIOUS") {
        decision = "FLAG";
      } else {
        decision = "ALLOW";
      }

      reason = aiResult.reason;
      risk = aiResult.risk;
    }

    // 🔴 BLOCK
    if (decision === "BLOCK") {
      await logService.log({
        apiKey: req.apiKey,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        type: reason,
        action: "BLOCKED",
        risk
      });

      return res.status(403).json({
        success: false,
        blocked: true,
        decision,
        reason,
        risk
      });
    }

    // 🟡 FLAG
    if (decision === "FLAG") {
      await logService.log({
        apiKey: req.apiKey,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        type: reason,
        action: "FLAGGED",
        risk
      });

      res.setHeader("X-IDS-Warning", "Suspicious request detected");
      return next();
    }

    // 🟢 ALLOW
    await logService.log({
      apiKey: req.apiKey,
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      type: "NORMAL",
      action: "ALLOWED",
      risk
    });

    next();

  } catch (err) {
    console.error("IDS Error:", err.message);
    next(); // fail-open
  }
}

module.exports = { idsMiddleware };