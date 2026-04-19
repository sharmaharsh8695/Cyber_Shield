require("dotenv").config();

const { analyzeWithAI } = require("./ai-service.js");

async function runTest() {
  console.log("🚀 Testing ai.service...\n");

  // 🔹 Test payloads
  const testCases = [
    {
      name: "Normal Input",
      payload: { body: { name: "harsh" }, query: {}, params: {} }
    },
    {
      name: "Suspicious Input",
      payload: { body: { input: "admin'--" }, query: {}, params: {} }
    },
    {
      name: "Malicious Input",
      payload: { body: { input: "' OR 1=1" }, query: {}, params: {} }
    }
  ];

  for (const test of testCases) {
    console.log(`\n🔍 ${test.name}`);
    console.log("Payload:", test.payload);

    try {
      const result = await analyzeWithAI(test.payload);

      console.log("✅ AI Result:");
      console.log(result);

    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }

  console.log("\n🎯 Test completed");
}

runTest();