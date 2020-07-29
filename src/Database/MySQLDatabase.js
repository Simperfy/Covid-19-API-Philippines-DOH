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
   * @param {Object} numEntries
   * @param {String} numEntries.count
   * @param {String} numEntries.month
   * @param {String} numEntries.day
   * @return {Promise} returns JSON of the result
   */
  // SELECT count(*) FROM `case_informations` WHERE ((`date_specimen` = '2020-07-01' AND date_onset = '') OR `date_onset` = '2020-07-01') ORDER BY `health_status` ASC
  get(numEntries) {
    return new Promise((resolve, reject) => {
      if (numEntries.month > 12) return reject(new Error('Error: the month cannot be greater than 12'));
      if (numEntries.day > 31) return reject(new Error('Error: the day cannot be greater than 31'));
      let query = 'SELECT * from case_informations ';

      if (numEntries.month && !numEntries.day) {
        const date = `${this.connection.escape('2020-' + numEntries.month + '%')}`;
        query += `WHERE ((date_specimen LIKE ${date} AND date_onset = '') OR date_onset LIKE ${date}) `;
      } else if (numEntries.month && numEntries.day) {
        const date = `${this.connection.escape('2020-' + numEntries.month + '-' + numEntries.day)}`;
        query += `WHERE ((date_specimen LIKE ${date} AND date_onset = '') OR date_onset LIKE ${date}) `;
      }

      query += 'ORDER BY case_code ASC ';
      if (numEntries.count !== undefined) {
        let limit = parseInt(numEntries.count);
        limit = this.connection.escape(limit);
        query += `LIMIT ${limit}`;
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
      const query = 'SELECT a.total, b.recoveries, c.deaths, d.active_cases FROM ' +
        '(SELECT count(*) as total FROM `case_informations`) as a,' +
        '(SELECT count(*) as recoveries FROM `case_informations` WHERE `removal_type` = \'recovered\') as b,' +
        ' (SELECT count(*) as deaths FROM `case_informations` WHERE `removal_type` = \'died\') as c,' +
        ' (SELECT count(*) as active_cases FROM `case_informations` WHERE `removal_type` = \'\' AND `date_rep_conf` <> \'\') as d';

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
    console.log(`Query: ${connectionQuery.sql}`);
    return connectionQuery;
  }
}

exports.MySQLDatabase = MySQLDatabase;
