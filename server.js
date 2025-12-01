require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Прокси к Groq (чтобы ключ не светился)
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-70b-versatile',
      messages: req.body.messages,
      temperature: 0.8
    }, {
      headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` }
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: "mitrsht спит..." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MITRSHT SERVER RUNNING → http://localhost:${PORT}`);
  console.log("СДЕЛАНО MITRSHT");
});
