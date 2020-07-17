/* eslint-disable max-len */
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'covid19_api_philippines',
});

connection.connect();

connection.query(`SELECT count(*) AS c from case_informations where Sex='MALE'`, function(err, rows, fields) {
  if (err) throw err;

  const dataArray = Object.values(JSON.parse(JSON.stringify(rows)));
  dataArray.forEach(function(v) {
    console.log(v.c);
  });
});

connection.end();
