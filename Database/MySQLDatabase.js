/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const mysql = require('mysql');

class MySQLDatabase {
  constructor() {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance=this;

      this.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        debug: false,
      });
      // this.connection.connect();
    }

    return MySQLDatabase.instance;
  }

  /**
   * @param {int} numEntries number of records to return
   * @return {Promise} returns JSON of the result
   */
  get(numEntries = null) {
    return new Promise((resolve) => {
      let query = 'SELECT * from case_informations';
      if (numEntries !== null) {
        let limit = parseInt(numEntries);
        limit = this.connection.escape(limit);
        query += ` LIMIT ${limit}`;
      }

      this.executeQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        resolve(rows);
      }));
    });
  }

  /**
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters = null) {
    return new Promise((resolve) => {
      let query = 'SELECT count(*) AS count from case_informations';
      if (objFilters !== null) {
        const field = this.connection.escapeId(objFilters.field);
        const value = this.connection.escape(objFilters.value);
        query += ` where ${field}=${value}`;
      }

      this.executeQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        const dataArray = Object.values(JSON.parse(JSON.stringify(rows)));
        dataArray.forEach(function(d) {
          resolve(d.count);
        });
      }));
    });
  }

  /**
   * @param {String} field
   * @param {String} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return new Promise((resolve) => {
      let query = 'SELECT * from case_informations';
      field = this.connection.escapeId(field);
      value = this.connection.escape(value);
      query += ` where ${field}=${value}`;

      this.executeQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        resolve(rows);
      }));
    });
  }

  endConnection() {
    this.connection.end();
  }

  /**
   * @param {QueryFunction} connectionQuery contains the function of the execute query
   * @return  {QueryFunction} returns the function of the execute query
   */
  executeQuery(connectionQuery) {
    // console.log(`Query: ${connectionQuery.sql}`);
    return connectionQuery;
  }
}

exports.MySQLDatabase = MySQLDatabase;
