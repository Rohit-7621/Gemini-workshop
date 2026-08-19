const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/chat", async (req, res) => {

    console.log("Received prompt:", req.body.prompt);

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: req.body.prompt
        });

        console.log("Gemini response received");

        res.status(200).json({
            reply: response.text
        });

    } catch (error) {

        console.error("========== GEMINI ERROR ==========");
        console.error(error);
        console.error("==================================");

        res.status(500).json({
            error: error.message || String(error)
        });
    }
});


const server = app.listen(3002, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3002");
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});