const mysql = require("mysql");
let pool;
const ERROR_CODE = 500;

const getPool = () => {
  if (pool) {
    console.log("Ya hay una conexión, esto es singleton :)");
    return pool;
  }

  pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    database: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });
  return pool;
};

const errorResponse = (error, response) => {
  console.log(`--ERROR| ${error} |FIN ERROR--`);
  response.status(ERROR_CODE).send({
    cod: ERROR_CODE,
    msg: error,
  });
};

const excuteSP = (sql, response, callback) => {
  try {
    getPool().getConnection((err, connection) => {
      if (err) {
        try {
          console.log(`Connection error: ${err.sqlMessage}`);
          connection.release();
          return errorResponse(err.sqlMessage, response);
        } catch (error) {
          return errorResponse(err.sqlMessage, response);
        }
      }

      connection.query(sql, (err, rows) => {
        if (err) {
          console.log(`Error executing the SP: ${err.sqlMessage}`);
          try {
            console.log(`Connection error: ${err.sqlMessage}`);
            connection.release();
            return errorResponse(err.sqlMessage, response);
          } catch (error) {
            return errorResponse(err.sqlMessage, response);
          }
        }
        callback(rows[0]);
        console.log(`Response = ${JSON.stringify(rows[0])}`);
      });
      connection.release();
    });
  } catch (error) {
    return errorResponse(error, response);
  }
};

module.exports = excuteSP;
