const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.sendStatus(200);
});

app.get('/hello', (req, res) => {
    res.status(200).json({ 'hello': 'micki' });
});

module.exports = app;
