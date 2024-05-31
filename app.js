// require('dotenv').config({ path: './config/.env' });

const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');

// app.use('/users', userRoutes);
// app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Bem-vindo à API demands!!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
