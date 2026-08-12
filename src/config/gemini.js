const { GoogleGenAI } = require("@google/genai")
const { gemini_api_key } = require("./config")
// console.log({ gemini_api_key: gemini_api_key });

const ai = new GoogleGenAI({
    apiKey: gemini_api_key
})

module.exports = ai;