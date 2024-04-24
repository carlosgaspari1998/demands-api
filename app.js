const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Rota GET simples
app.get('/', (req, res) => {
    res.json({ message: 'Olá, mundo!' });
});

// Exporta o aplicativo Express como uma função serverless
module.exports.handler = serverless(app);
