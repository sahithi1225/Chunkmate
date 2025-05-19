// db/index.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'chunkmate',       
  password: 'Priya@123',   
  port: 5432,
});

module.exports = pool;
