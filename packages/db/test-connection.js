const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv1999.hstgr.io',
  user: 'u249454424_moon',
  password: 'Moon286286',
  database: 'u249454424_moon'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Successfully connected to MySQL!');
  connection.end();
});