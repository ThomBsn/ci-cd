const express = require('express');
const auth = require('./modules/authentication');
const {GoogleGenerativeAI} = require("@google/generative-ai");
require("dotenv").config()


const app = express();
app.use(express.json());
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
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        const {prompt} = req.body;

        if (!prompt) {
            return res.status(400).json({error: "prompt is required"});
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(prompt);

        res.json({
            result: result.response.text(),
        });
    } catch (error) {
        res.status(500).json({error: `AI generation failed : ${error.message}`});
    }
});


app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on http://localhost:${port}`);
});
