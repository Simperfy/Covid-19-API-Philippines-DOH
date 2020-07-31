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
        query += `WHERE ((date_specimen = ${date} AND date_onset = '') OR date_onset = ${date}) `;
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
   * @param {String} region
   * @return {Promise}
   */
  getSummary(region = null) {
    return new Promise((resolve, reject) => {
      let query;
      if (region === null) {
        query = 'SELECT a.total, b.recoveries, c.deaths, d.active_cases FROM ' +
          '(SELECT count(*) as total FROM `case_informations`) as a,' +
          '(SELECT count(*) as recoveries FROM `case_informations` WHERE `removal_type` = \'recovered\') as b,' +
          ' (SELECT count(*) as deaths FROM `case_informations` WHERE `removal_type` = \'died\') as c,' +
          ' (SELECT count(*) as active_cases FROM `case_informations` WHERE `removal_type` = \'\' AND `date_rep_conf` <> \'\') as d';
      } else {
        const regionVal = this.connection.escape(region);
        query = `SELECT a.total, b.recoveries, c.deaths, d.active_cases FROM` +
          ` (SELECT count(*) as total FROM case_informations WHERE region_res = ${regionVal}) as a,` +
          ` (SELECT count(*) as recoveries FROM case_informations WHERE (removal_type = 'recovered' AND region_res = ${regionVal})) as b,` +
          ` (SELECT count(*) as deaths FROM case_informations WHERE (removal_type = 'died' AND region_res = ${regionVal})) as c,` +
          ` (SELECT count(*) as active_cases FROM case_informations WHERE (removal_type = '' AND date_rep_conf <> '' AND region_res = ${regionVal})) as d`;
      }


      this.executeAndLogQuery(this.connection.query(query, function(err, rows, fields) {
        if (err) return reject(new Error('[MySQLDatabase.js] ' + err));
        resolve(rows);
      }));
    });
  }

  /**
   * @return {Promise}
   */
  getTimeline() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT count(a.cases) as cases, a.date FROM \n' +
        '(SELECT date_specimen AS cases, date_specimen AS date from case_informations WHERE (date_specimen <> \'\' AND date_onset = \'\')\n' +
        'UNION ALL\n' +
        'SELECT date_onset AS cases, date_onset AS date FROM case_informations WHERE date_onset <> \'\') AS a\n' +
        'GROUP BY a.date ORDER BY a.date ASC';

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
   * @param {[CaseInformation]} csArr
   * @param {int} batchSize
   */
  async batchInsertDatabaseFromCSV(csArr, batchSize=10000) {
    console.log(`\nPerforming batch insert (batch size: ${batchSize}):`);
    let isSuccess = true;
    let lastRowIndex = 0;
    const csArrLength = csArr.length;
    const batchRuns = Math.ceil(csArr.length / batchSize);
    for (let i = 0; i < batchRuns; i++) {
      console.log(`Running batch ${i+1}/${batchRuns}`);
      const nextLastRowIndex = lastRowIndex+batchSize;
      // console.log('lastRowIndex: ' + lastRowIndex);
      // console.log('nextLastRowIndex: ' + nextLastRowIndex);

      const sliceStart = lastRowIndex;
      const sliceEnd = (nextLastRowIndex >= csArr.length ? csArrLength : nextLastRowIndex);

      // console.log('sliceS: ' + sliceStart + ', sliceE: ' + sliceEnd);
      const csBatchArr = csArr.slice(sliceStart, sliceEnd); // BUG RESOLVE: Splice vs slice :O
      // console.log('csBatchArr.length: ' + csBatchArr.length + '\n');
      lastRowIndex = nextLastRowIndex;

      // Ignoring, reason possible duplication of data as stated in readme of DOH Data Drop
      let query = `INSERT INTO case_informations (case_code, age, age_group, sex, date_specimen, \
        date_result_release, date_rep_conf, date_died, date_recover, removal_type, admitted, region_res, \
        prov_res, city_mun_res, city_muni_psgc, health_status, quarantined, date_onset, pregnant_tab, validation_status) VALUES`;

      // BUG RESOLVE Lesson learned, ALWAYS ESCAPE CHARS BEFORE INSERTING TO DB EVEN FROM A CSV!!!
      csBatchArr.forEach((data, ind) => {
        query += ` (${this.connection.escape(data.CaseCode)}, \
${this.connection.escape(data.Age)}, \
${this.connection.escape(data.AgeGroup)}, \
${this.connection.escape(data.Sex)}, \
${this.connection.escape(data.DateSpecimen)}, \
${this.connection.escape(data.DateResultRelease)}, \
${this.connection.escape(data.DateRepConf)}, \
${this.connection.escape(data.DateDied)}, \
${this.connection.escape(data.DateRecover)}, \
${this.connection.escape(data.RemovalType)}, \
${this.connection.escape(data.Admitted)}, \
${this.connection.escape(data.RegionRes)}, \
${this.connection.escape(data.ProvRes)}, \
${this.connection.escape(data.CityMunRes)}, \
${this.connection.escape(data.CityMuniPSGC)}, \
${this.connection.escape(data.HealthStatus)}, \
${this.connection.escape(data.Quarantined)}, \
${this.connection.escape(data.DateOnset)}, \
${this.connection.escape(data.Pregnanttab)}, \
${this.connection.escape(data.ValidationStatus)})`;

        if ((ind+1) !== csBatchArr.length) {
          query+= ', ';
        }
      });

      await this.executeRaw(query).then((data) => {
        console.log('Affected rows: ' + JSON.parse(JSON.stringify(data)).affectedRows);
      }).catch((err) => {
        if (err) throw new Error('[Database.js] ' + err);
        isSuccess = false;
      });
    }

    return isSuccess;
  }

  /**
   * Update database form csv
   * @param {CSVDatabase} csvDatabase
   * @return {Promise<boolean>}
   */
  async updateDatabaseFromCSV(csvDatabase) {
    console.log('\nBegin Updating Database.');
    console.log('Truncating case_informations table, because it causes anomaly when we don\'t.');
    await this.truncate('case_informations');

    const cs = await csvDatabase.get();

    console.log('\nBefore Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length in database: ' + await this.count());
    const res = await this.batchInsertDatabaseFromCSV(cs);
    console.log('\nAfter Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length in database: ' + await this.count());

    if (res) {
      console.log('\nSuccessfully transferred data from CSV to Database.\n');
    } else {
      console.log('\nFailed to transfer data from CSV to Database.\n');
    }

    return res;
  }


  /**
   * @param {QueryFunction} connectionQuery contains the function of the execute query
   * @return  {QueryFunction} returns the function of the execute query
   */
  executeAndLogQuery(connectionQuery) {
    if (process.env.LOG_QUERIES === 'true') {
      console.log(`Query: ${connectionQuery.sql}`);
    }
    return connectionQuery;
  }
}

module.exports = MySQLDatabase;
