const router  = require('express').Router();

const {getLogs} = require('../services/logs-service');

router.get("/", authMiddleware, (req, res) => {
  const logs = logService.getLogsByApiKey(req.apiKey);

  res.json({
    count: logs.length,
    data: logs
  });
});