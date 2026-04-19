const express = require("express");
const router = express.Router();
const { createApiKey } = require("../services/apiKey-service.js");

// Generate API Key
router.post("/generate-key", (req, res) => {
  const { name ,targetUrl } = req.body;


  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      message: "targetUrl is required"
    });
  }
  const newKey = createApiKey(name,targetUrl);

  res.json({
    success: true,
    apiKey: newKey.apiKey,
    targetUrl : newKey.targetUrl,
    createdAt: newKey.createdAt
  });
});

module.exports = router;