const express = require('express');
const mysql = require('mysql2');
// Cria uma instância do Express
const app = express();

// Configuração da conexão com o banco de dados MySQL
const connectionn = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',  // Host do seu banco de dados MySQL
  user: 'root',  // Usuário do banco de dados
  port: 49839,
  password: 'uoLBLTvhVAlsdpXTejdfDcJVyWNRaNqJ',  // Senha do banco de dados
  database: 'railway'  // Nome do banco de dados
});

// Conecta-se ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL estabelecida com sucesso');
});

// Rota GET para buscar todos os usuários na tabela users
app.get('/users', (req, res) => {
  // Consulta SQL para selecionar todos os usuários
  const sql = 'SELECT * FROM users';

  // Executa a consulta no banco de dados
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar usuários');
      return;
    }

    // Retorna os resultados da consulta como resposta
    res.json(results);
  });
});

// Define a porta em que o servidor Express irá escutar
const port = 3000;  // Porta que deseja utilizar
app.listen(port, () => {
  console.log(`Servidor Express está ouvindo na porta ${port}`);
});
