const express = require("express");
const router = express.Router();
const { createApiKey } = require("../services/apiKey-service.js");

// Generate API Key
router.post("/", (req, res) => {
  const { name } = req.body;

  const newKey = createApiKey(name);

  res.json({
    success: true,
    apiKey: newKey.apiKey,
    createdAt: newKey.createdAt
  });
});

module.exports = router;