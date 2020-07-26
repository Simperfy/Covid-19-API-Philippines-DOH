/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const mysql = require('mysql');

/**
 * Handles MySQL
 */
class MySQLDatabase {
  /**
   * Initialize Database and make this a singleton
   * @return {DatabaseAdapter}
   */
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
   * @param {*} numEntries number of records to return
   * @return {Promise} returns JSON of the result
   */
  get(numEntries = null) {
    return new Promise((resolve, reject) => {
      if (isNaN(numEntries)) return reject(new Error('invalid values'));
      let query = 'SELECT * from case_informations ORDER BY case_code ASC';
      if (numEntries !== null) {
        let limit = parseInt(numEntries);
        limit = this.connection.escape(limit);
        query += ` LIMIT ${limit}`;
      }

      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters = null) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT count(*) AS count from case_informations';
      if (objFilters !== null) {
        const field = this.connection.escapeId(objFilters.field);
        const value = this.connection.escape(objFilters.value);
        query += ` where ${field}=${value}`;
      }

      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        const dataArray = Object.values(JSON.parse(JSON.stringify(rows)));
        dataArray.forEach(function(d) {
          resolve(d.count);
        });
      }));
    });
  }

  /**
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * from case_informations';
      field = this.connection.escapeId(field);
      value = this.connection.escape(value);
      query += ` where ${field}=${value}`;

      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * @return {Promise}
   */
  getSummary() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT a.recovered, b.died, c.active_cases FROM ' +
        '(SELECT count(*) as recovered FROM `case_informations` WHERE `removal_type` = \'recovered\') as a,' +
        ' (SELECT count(*) as died FROM `case_informations` WHERE `removal_type` = \'died\') as b,' +
        ' (SELECT count(*) as active_cases FROM `case_informations` WHERE `removal_type` = \'\' AND `date_rep_conf` <> \'\') as c';

      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * @param {String} query
   * @return {Promise}
   */
  executeRaw(query) {
    return new Promise((resolve, reject) => {
      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * Truncates Database table
   * @param {String} tableName
   * @return {Promise<void>}
   */
  truncate(tableName) {
    return new Promise((resolve, reject) => {
      const query = `TRUNCATE TABLE ${tableName}`;
      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * End Database connection
   */
  endConnection() {
    this.connection.end();
  }

  /**
   * @return {Promise}
   */
  getLastRow() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * from case_informations ORDER BY case_code DESC LIMIT 1';

      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * @param {QueryFunction} connectionQuery contains the function of the execute query
   * @return  {QueryFunction} returns the function of the execute query
   */
  executeAndLogQuery(connectionQuery) {
    // console.log(`Query: ${connectionQuery.sql}`);
    return connectionQuery;
  }
}

exports.MySQLDatabase = MySQLDatabase;
