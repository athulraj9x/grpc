const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '112233-a',
  database: 'orders_dbs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise(); // Using promise-based API

// Test the connection using async/await
async function testConnection() {
  try {
    await db.query('SELECT 1'); // Simple query to check connection
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Failed to connect to the MySQL database:', err.message);
    try {
      // Close the pool gracefully if there was an error
      await pool.end();
      console.log('MySQL connection pool closed.');
    } catch (endErr) {
      console.error('Failed to close the MySQL connection pool:', endErr.message);
    }
  }
}

// Call the testConnection function
testConnection();

module.exports = db;
