const connection = require('../config/database');

function findAll() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, address, creation_date AS creationDate 
      FROM customers 
      WHERE removed = 0
      ORDER BY name`;
    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function findById(customerId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, address, creation_date as creationDate FROM customers WHERE id = ? AND removed = 0';
    connection.query(sql, [customerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function createCustomer(customer) {
  return new Promise((resolve, reject) => {
    const { id, name, address } = customer;
    const sql = 'INSERT INTO customers (id, name, address) VALUES (?, ?, ?)';
    connection.query(sql, [id, name, address], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function updateCustomer(customerId, customer) {
  return new Promise((resolve, reject) => {
    const { name, address } = customer;
    const sql = 'UPDATE customers SET name = ?, address = ? WHERE id = ?';
    connection.query(sql, [name, address, customerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function removeCustomer(customerId) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE customers SET removed = 1 WHERE id = ?';
    connection.query(sql, [customerId], (err, results) => {
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
  createCustomer,
  updateCustomer,
  removeCustomer,
};
