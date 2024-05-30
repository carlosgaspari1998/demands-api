require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados MySQL estabelecida com sucesso');
});

app.get('/', (req, res) => {
  res.send('Bem-vindo à API demands!');
});

app.post('/products', (req, res) => {
  const { name, description } = req.body;
  const id = generateCustomId();
  const sql = 'INSERT INTO products (name, description, id) VALUES (?, ?, ?)';
  connection.query(sql, [name, description, id], (err) => {
    if (err) {
      console.error('Erro ao adicionar um novo produto:', err);
      res.status(500).json({ success: false, message: 'Erro ao adicionar um novo produto' });
      return;
    }
    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso' });
  });
});


app.get('/products', (req, res) => {
  const sql = 'SELECT id, name, description, creation_date FROM products WHERE removed = 0';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar produtos');
      return;
    }
    res.json(results);
  });
});

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT id, name, description, creation_date FROM products WHERE id = ? AND removed = 0';
  connection.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar produto');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Produto não encontrado');
      return;
    }
    res.json(results[0]);
  });
});


app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description } = req.body;
  const sql = 'UPDATE products SET name = ?, description = ? WHERE id = ?';
  connection.query(sql, [name, description, productId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o produto:', err);
      res.status(500).json({ success: false, message: 'Erro ao atualizar o produto' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Produto não encontrado' });
      return;
    }
    res.json({ success: true, message: 'Produto atualizado com sucesso' });
  });
});


app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'UPDATE products SET removed = 1 WHERE id = ?';
  connection.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Erro ao remover o produto:', err);
      res.status(500).json({ error: 'Erro ao remover o produto' }); // Retornando um JSON com erro
      return;
    }
    res.json({ message: 'Produto removido com sucesso' }); // Retornando um JSON com sucesso
  });
});

function generateCustomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let customId = '';

  for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      customId += characters.charAt(randomIndex);
  }
  return customId;
}

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express está ouvindo na porta ${port}`);
});