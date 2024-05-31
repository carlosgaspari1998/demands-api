require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());

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

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const emailCheckSql = 'SELECT * FROM users WHERE email = ?';
  connection.query(emailCheckSql, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar o email:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Email já registrado' });
    }
    const id = generateCustomId();
    const hashedPassword = hashPassword(password, id);

    const insertUserSql = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
    connection.query(insertUserSql, [id, name, email, hashedPassword], (err) => {
      if (err) {
        console.error('Erro ao registrar o usuário:', err);
        return res.status(500).json({ success: false, message: 'Erro ao registrar o usuário' });
      }
      res.status(201).json({ success: true, message: 'Usuário registrado com sucesso' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const getUserSql = 'SELECT * FROM users WHERE email = ?';
  connection.query(getUserSql, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const user = results[0];

    const isPasswordValid = verifyPassword(password, user.password, user.id);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ success: true, token });
  });
});

function hashPassword(password, userId) {
  return crypto.createHash('sha256').update(userId + password).digest('hex');
}

function verifyPassword(password, hashedPassword, userId) {
  const hashedAttempt = hashPassword(password, userId);
  return hashedAttempt === hashedPassword;
}

app.get('/products', authenticateToken, (req, res) => {
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

app.get('/products/:id', authenticateToken, (req, res) => {
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

app.post('/products', authenticateToken, (req, res) => {
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

app.put('/products/:id', authenticateToken, (req, res) => {
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


app.delete('/products/:id', authenticateToken, (req, res) => {
  const productId = req.params.id;
  const sql = 'UPDATE products SET removed = 1 WHERE id = ?';
  connection.query(sql, [productId], (err) => {
    if (err) {
      console.error('Erro ao remover o produto:', err);
      res.status(500).json({ error: 'Erro ao remover o produto' });
      return;
    }
    res.json({ message: 'Produto removido com sucesso' });
  });
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const jwtToken = token.split(' ')[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      console.log(jwtToken)
      return res.status(403).json({ success: false, message: 'Falha na autenticação do token' });
    }
  
    req.userId = decoded.userId;
    next();
  });
}

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