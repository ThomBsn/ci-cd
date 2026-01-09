const express = require('express');
const auth = require('./modules/authentication');
const {GoogleGenAI} = require("@google/genai");

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/auth/:secret', (req, res) => {
    const {secret} = req.params;
    const response = auth(secret);

    res.status(response.status).send(response.message);
});

app.post("/gemini", async (req, res) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "prompt is required" });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-light",
            contents: prompt,
        });

        res.json({
            result: response.text,
        });
    } catch (error) {
        res.status(500).json({ error: `AI generation failed : ${error}` });
    }
});


app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on http://localhost:${port}`);
});
