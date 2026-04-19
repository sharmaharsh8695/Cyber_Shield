const crypto = require("crypto");

const apiKeys = []; // temporary DB

function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

function createApiKey(name = "default",targetUrl) {
  const apiKey = generateApiKey();

  const newKey = {
    apiKey,
    name,
    targetUrl,
    createdAt: new Date()
  };

  apiKeys.push(newKey);

  return newKey;
}

function findApiKey(key) {
  return apiKeys.find(k => k.apiKey === key);
}

module.exports = {
  createApiKey,
  findApiKey
};