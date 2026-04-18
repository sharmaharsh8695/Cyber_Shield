const logs = [];

function log(entry) {
  const newLog = {
    id: Date.now().toString(), // simple unique id (improve later)
    apiKey: entry.apiKey,
    ip: entry.ip,
    endpoint: entry.endpoint,
    method: entry.method,
    type: entry.type,
    action: entry.action,
    timestamp: new Date()
  };

  logs.push(newLog);
}

function getLogsByApiKey(apiKey) {
  return logs.filter(log => log.apiKey === apiKey);
}

module.exports = {
  log,
  getLogsByApiKey
};