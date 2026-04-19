const axios = require("axios");

async function forwardRequest(req) {
  try {
    const targetBase = req.client.targetUrl;

    // remove /api/protect prefix
    const path = req.originalUrl.replace(/^\/api\/protect/, "");

    const url = targetBase + path;

    // clone headers and remove internal ones
    const headers = { ...req.headers };
    delete headers["x-api-key"];
    delete headers["host"];

    console.log("forwarding to ",url)
    const response = await axios({
      method: req.method,
      url,
      headers,
      data: req.body,
      params: req.query,
      validateStatus: () => true
    });

    return {
      status: response.status,
      data: response.data
    };

  } catch (err) {
    console.error("Proxy Error:", err.message);

    return {
      status: 500,
      data: {
        success: false,
        message: "Error forwarding request"
      }
    };
  }
}

module.exports = { forwardRequest };