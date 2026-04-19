const { findApiKey } = require("../services/apiKey-service");

function authMiddleware(req,res,next){
     const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key missing"
    });
  }

  const keyData = findApiKey(apiKey);

  if (!keyData) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }

  // attach to request (VERY IMPORTANT for later)
  req.apiKey = apiKey;
  req.client = keyData;
  console.log("keydata",keyData)

  next();
}
module.exports = {
    authMiddleware,
    
};