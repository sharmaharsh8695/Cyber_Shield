const router  = require('express').Router();

const authRoutes = require('./auth-routes');
const logRoutes =  require('./logs-routes');
const { authMiddleware } = require('../middleware/auth-middleware');
const { idsMiddleware } = require('../middleware/ids-middleware');

router.use('/auth', authRoutes);
router.use('/logs', authMiddleware, logRoutes);

router.use('/protect', authMiddleware, idsMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Request passed IDS 🚀"
  });
});


router.get("/test-log", authMiddleware, (req, res) => {
  const logService = require('../services/logs-service');

  logService.log({
    apiKey: req.apiKey,
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
    type: "NORMAL",
    action: "ALLOWED"
  });

  res.json({ message: "Log created" });
});

module.exports = router;