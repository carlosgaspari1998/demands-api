const connection = require('../config/database');
const { generateCustomId } = require('../utils/idUtils');
const actionEnum = require('../enums/actionEnum');

function findAll(showOnlyNotFinalized) {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT d.id, c.name as customer, c.address, d.description, 
             CONVERT_TZ(d.creation_date, '+00:00', '-03:00') AS creationDate, 
             d.demand_time as demandTime, 
             CAST(d.finished AS UNSIGNED) AS finished
      FROM demands d 
      INNER JOIN customers c ON (c.id = d.customer_id) 
      WHERE d.removed = 0 ${showOnlyNotFinalized === 'true' ? 'AND d.finished = 0' : ''} 
      ORDER BY d.demand_time`;

    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


function findById(demandId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, customer_id as customer, description, creation_date as creationDate, demand_time as demandTime FROM demands WHERE id = ? AND removed = 0';
    connection.query(sql, [demandId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function createDemand(demand) {
  return new Promise((resolve, reject) => {
    const { id, customer, description, demandTime, userId } = demand;
    const sqlInsert = 'INSERT INTO demands (id, customer_id, description, demand_time) VALUES (?, ?, ?, ?)';
    const sqlLog = 'INSERT INTO events (id, demand_id, action_id, user_id, date) VALUES (?, ?, ?, ?, NOW())';

    connection.beginTransaction(err => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sqlInsert, [id, customer, description, demandTime], (err, results) => {
        if (err) {
          connection.rollback(() => {
            reject(err);
          });
        } else {
          const id = generateCustomId();
          connection.query(sqlLog, [id, demand.id, actionEnum.create, userId], (err) => {
            if (err) {
              connection.rollback(() => {
                reject(err);
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    reject(err);
                  });
                } else {
                  resolve(results);
                }
              });
            }
          });
        }
      });
    });
  });
}

function updateDemand(demandId, demand) {
  return new Promise((resolve, reject) => {
    const { customer, description, demandTime, userId } = demand;
    const sql = 'UPDATE demands SET customer_id = ?, description = ?, demand_time = ? WHERE id = ?';
    connection.beginTransaction(err => {
      if (err) {
        reject(err);
        return;
      }
      
      connection.query(sql, [customer, description, demandTime, demandId], (err, results) => {
        if (err) {
          connection.rollback(() => {
            reject(err);
          });
        } else {
          const id = generateCustomId();
          const sqlLog = 'INSERT INTO events (id, demand_id, action_id, user_id, date) VALUES (?, ?, ?, ?, NOW())';
          connection.query(sqlLog, [id, demandId, actionEnum.update, userId], (err) => {
            if (err) {
              connection.rollback(() => {
                reject(err);
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    reject(err);
                  });
                } else {
                  resolve(results);
                }
              });
            }
          });
        }
      });
    });
  });
}


function removeDemand(demandId, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE demands SET removed = 1 WHERE id = ?';
    connection.beginTransaction(err => {
      if (err) {
        reject(err);
        return;
      }
      
      connection.query(sql, [demandId], (err, results) => {
        if (err) {
          connection.rollback(() => {
            reject(err);
          });
        } else {
          const id = generateCustomId();
          const sqlLog = 'INSERT INTO events (id, demand_id, action_id, user_id, date) VALUES (?, ?, ?, ?, NOW())';
          connection.query(sqlLog, [id, demandId, actionEnum.remove, userId], (err) => {
            if (err) {
              connection.rollback(() => {
                reject(err);
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    reject(err);
                  });
                } else {
                  resolve(results);
                }
              });
            }
          });
        }
      });
    });
  });
}


function finishedDemand(demandId, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE demands SET finished = 1 WHERE id = ?';
    connection.beginTransaction(err => {
      if (err) {
        reject(err);
        return;
      }
      
      connection.query(sql, [demandId], (err, results) => {
        if (err) {
          connection.rollback(() => {
            reject(err);
          });
        } else {
          const id = generateCustomId();
          const sqlLog = 'INSERT INTO events (id, demand_id, action_id, user_id, date) VALUES (?, ?, ?, ?, NOW())';
          connection.query(sqlLog, [id, demandId, actionEnum.finished, userId], (err) => {
            if (err) {
              connection.rollback(() => {
                reject(err);
              });
            } else {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    reject(err);
                  });
                } else {
                  resolve(results);
                }
              });
            }
          });
        }
      });
    });
  });
}

module.exports = {
  findAll,
  findById,
  createDemand,
  updateDemand,
  removeDemand,
  finishedDemand,
};
