const mysql = require("mysql2");
let pool;
const ERROR_CODE = 500;

const getPool = () => {
  if (pool) return pool;

  pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    database: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  return pool;
};

const errorResponse = (error, response) => {
  response.status(ERROR_CODE).json({
    cod: ERROR_CODE,
    msg: "Error interno del servidor",
  });
};

const excuteSP = (sql, params, response, callback) => {
  getPool().getConnection((err, connection) => {
    if (err) {
      return errorResponse(err.sqlMessage || err.message, response);
    }

    connection.query(sql, params, (err, rows) => {
      connection.release();
      if (err) {
        return errorResponse(err.sqlMessage || err.message, response);
      }
      callback(rows[0]);
    });
  });
};

const excuteSPAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    getPool().getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(sql, params, (err, rows) => {
        connection.release();
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  });
};

module.exports = excuteSP;
module.exports.async = excuteSPAsync;
