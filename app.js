const express = require('express');
const app = express();

// Rota GET simples
app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
