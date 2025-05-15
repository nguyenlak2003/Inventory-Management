const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

console.time('SQL_Initial_Connection');

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Kết nối SQL Server thành công');
    console.timeEnd('SQL_Initial_Connection');
    return pool;
  })
  .catch(err => console.error('❌ Kết nối thất bại', err));

module.exports = {
  sql, poolPromise
};
