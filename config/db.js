const path = require("path");
const mysql = require("promise-mysql");
console.log(process.env.DB_HOST);

//support for mySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
  //debug: true
});

module.exports = pool;
