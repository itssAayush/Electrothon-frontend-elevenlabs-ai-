const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    let log = "";
    const addLog = (msg) => {
        console.log(msg);
        log += msg + "\n";
    };

    if (!apiKey) {
        addLog("No API key found in .env.local");
        fs.writeFileSync("gemini_final_test.txt", log);
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

        for (const modelName of models) {
            addLog(`Testing ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                addLog(`✅ ${modelName} works! Response: ${result.response.text().substring(0, 20)}...`);
                fs.writeFileSync("gemini_final_test.txt", log);
                return;
            } catch (e) {
                addLog(`❌ ${modelName} failed: ${e.message}`);
            }
        }
    } catch (error) {
        addLog(`Fatal Error: ${error.message}`);
    }
    fs.writeFileSync("gemini_final_test.txt", log);
}

listModels();
