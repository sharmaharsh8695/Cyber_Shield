const patterns = {
  SQL_INJECTION: /(\bor\b|\band\b).*(=|<|>)/i,
  XSS: /<script.*?>.*?<\/script>/i,
  COMMAND_INJECTION: /(;|\|\||&&)/,
  PATH_TRAVERSAL: /\.\.\//
};

function detectAttack(data) {
  const str = JSON.stringify(data);

  for (let [type, regex] of Object.entries(patterns)) {
    if (regex.test(str)) {
      return { detected: true, type };
    }
  }

  return { detected: false, type: "NORMAL" };
}

module.exports = { detectAttack };