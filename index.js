const express = require('express');
const mysql2 = require('mysql2');
const app = express();

const connection = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL estabelecida com sucesso');
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar usuários' + process.env.MYSQL_HOST 
      + process.env.MYSQL_USER + process.env.MYSQL_PORT + process.env.MYSQL_PASSWORD + + process.env.MYSQL_DATABASE );
      return;
    }

    res.json(results);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express está ouvindo na porta ${port}`);
});
