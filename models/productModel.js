const connection = require('../config/database');

function findAll() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, description, creation_date FROM products WHERE removed = 0';
    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function findById(productId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, description, creation_date FROM products WHERE id = ? AND removed = 0';
    connection.query(sql, [productId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function createProduct(product) {
  return new Promise((resolve, reject) => {
    const { id, name, description } = product;
    const sql = 'INSERT INTO products (id, name, description) VALUES (?, ?, ?)';
    connection.query(sql, [id, name, description], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function updateProduct(productId, product) {
  return new Promise((resolve, reject) => {
    const { name, description } = product;
    const sql = 'UPDATE products SET name = ?, description = ? WHERE id = ?';
    connection.query(sql, [name, description, productId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function removeProduct(productId) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE products SET removed = 1 WHERE id = ?';
    connection.query(sql, [productId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  findAll,
  findById,
  createProduct,
  updateProduct,
  removeProduct,
};
