const router  = require('express').Router();
const {authMiddleware} = require('../middleware/auth-middleware');
const logService = require('../services/logs-service');

router.get("/", authMiddleware, (req, res) => {
  const logs = logService.getLogsByApiKey(req.apiKey);

  res.json({
    success : true,
    count: logs.length,
    data: logs
  });
});
module.exports = router;