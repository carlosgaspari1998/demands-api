const connection = require('../config/database');

function findAll() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.name as customerName, d.description as demandDescription, action_id as action, 
             CONVERT_TZ(l.date, '+00:00', '-03:00') AS date, u.name as userName
      FROM events l 
      INNER JOIN demands d ON (l.demand_id = d.id) 
      INNER JOIN customers c ON (d.customer_id = c.id)
      INNER JOIN users u ON (u.id = l.user_id)
      ORDER BY date desc
    `;
    
    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        results.forEach(result => {
          result.date = new Date(result.date);
        });
        resolve(results);
      }
    });
  });
}

module.exports = {
  findAll,
};
