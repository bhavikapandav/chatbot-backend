const ai = require("../../config/gemini")
// console.log({ ai: ai });

const generateResponse = async (message) => {
    try {
        const models = await ai.models.list();
        // console.log("models============", models);


        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: message
        })
        console.log("response============", response);
        return {
            res: response,
            text: response.text,
            model: response.modelVersion || "gemini-3.5-flash",
            promptTokens: response.usageMetadata?.promptTokenCount || 0,
            completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
            totalTokens: response.usageMetadata?.totalTokenCount || 0
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateResponse,
};