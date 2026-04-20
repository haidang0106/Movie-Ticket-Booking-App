const mssql = require('mssql');
require('dotenv').config();

// Database configuration
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'appDatvexemPhim',
  port: parseInt(process.env.DB_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for Azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

// Connection pool
let poolPromise = null;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = mssql.connect(config)
      .then(pool => {
        console.log('Connected to MSSQL database');
        return pool;
      })
      .catch(err => {
        console.log('Database Connection Failed! Bad Config:', err);
        process.exit(1);
      });
  }
  
  return poolPromise;
};

// Export mssql and getPool function
module.exports = {
  mssql: mssql,
  getPool: getPool
};

// For backward compatibility with existing code
const poolConnect = mssql.connect(config);
poolConnect.then(pool => {
  if (pool.connecting) {
    console.log('Connecting to MSSQL database...');
  }
  
  pool.on('error', err => {
    console.error('Database error:', err);
  });
})
.catch(err => {
  console.log('Database Connection Failed! Bad Config:', err);
});

// Export mssql for direct use in models
module.exports.mssql = mssql;