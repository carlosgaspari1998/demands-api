const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',  // Host do seu banco de dados MySQL
  user: 'root',  // Usuário do banco de dados
  port: 49839,
  password: 'uoLBLTvhVAlsdpXTejdfDcJVyWNRaNqJ',  // Senha do banco de dados
  database: 'railway'  // Nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL estabelecida com sucesso');
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar usuários');
      return;
    }
    res.json(results);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express está ouvindo na porta ${port}`);
});