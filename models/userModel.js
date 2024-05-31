const connection = require('../config/database');

function findByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    const { id, name, email, password } = user;
    const sql = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
    connection.query(sql, [id, name, email, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  findByEmail,
  createUser,
};
