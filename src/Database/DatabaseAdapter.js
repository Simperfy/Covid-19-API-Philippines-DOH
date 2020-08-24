/* eslint-disable max-len */
const CSVDatabase = require('./CSVDatabase');
const CaseInformation = require('../CaseInformation');
const FacilityInformation = require('../FacilityInformation');
const MongoDBDatabase = require('./MongoDBDatabase');
const MySQLDatabase = require('./MySQLDatabase');
// const CaseInformation = require('../CaseInformation');

/**
 * Handles Database
 */
class DatabaseAdapter {
  /**
   * Initialize Database and make this a singleton
   * @return {Promise<DatabaseAdapter>}
   */
  constructor() {
    return (async () => {
      if (!DatabaseAdapter.instance) {
        DatabaseAdapter.instance=this;

        console.log('Connecting to database');
        let msg;
        console.log('Database Type: ' + process.env.DATABASE_TYPE);
        if (String(process.env.DATABASE_TYPE).toLowerCase() === 'nosql') {
          msg = await this.connect(new MongoDBDatabase());
        } else if (String(process.env.DATABASE_TYPE).toLowerCase() === 'mysql') {
          msg = await this.connect(new MySQLDatabase());
        } else {
          throw new Error('Please specify "DATABASE_TYPE" in environment variables');
        }
        console.log(msg);
      }

      return DatabaseAdapter.instance;
    })();
  }

  /**
   * @param {*} database Database Class
   * @return {Promise<String>} Returns a message whether connection is success or not
   */
  connect(database) {
    this.db = database;
    return this.db.connect();
  }

  /**
   * @param {Object} queries
   * @param {String} queries.month
   * @param {String} queries.day
   * @param {int} queries.page
   * @param {int} queries.limit
   * @param {int} queries.maxLimit
   * @param {Object|undefined} queries.filters
   * @return {Promise}
   */
  get(queries) {
    return this.db.get(queries);
  }

  /**
   * @param {String} dbName database name
   * @param {Object|null} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(dbName, objFilters= null) {
    return this.db.count(dbName, objFilters);
  }

  /**
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return this.db.filter(field, value);
  }

  /**
   * @param {String} region
   * @return {Promise<Object>} result
   * @return {Promise<Object>} result.data
   * @return {Promise<Object>} result.fatalityRate
   * @return {Promise<Object>} result.recoveryRate
   */
  getSummary(region = null) {
    return this.db.getSummary(region);
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getTimeline(queries) {
    return this.db.getTimeline(queries);
  }

  /**
   * @return {Promise}
   */
  getTopRegions() {
    return this.db.getTopRegions();
  }

  // FACILITIES

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilities(queries) {
    return this.db.getFacilities(queries);
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilitiesSummary(queries) {
    return this.db.getFacilitiesSummary(queries);
  }

  // ./FACILITIES

  /**
   * @param {String} field
   * @param {String} dataset
   * @return {Promise}
   */
  getListOf(field, dataset) {
    return this.db.getListOf(field, dataset);
  }

  /**
   *
   * @return {Promise<String>}
   */
  getLatestFolderID() {
    return this.db.getLatestFolderID();
  }

  /**
   *
   * @return {Promise<String>}
   */
  getLastUpdateDate() {
    return this.db.getLastUpdateDate();
  }

  /**
   * Truncates Database table
   * @param {String} tableName
   * @return {Promise<void>}
   */
  truncate(tableName) {
    return this.db.truncate(tableName);
  }

  /**
   * @param {String} tableName
   * @param {Object} fieldValueObj
   * @return {Promise<String>}
   */
  insert(tableName, fieldValueObj) {
    return this.db.insert(tableName, fieldValueObj);
  }

  /**
   * End Database connection
   */
  endConnection() {
    this.db.endConnection();
  }

  /**
   * Update database form csv
   * @return {Promise<boolean>}
   */
  async updateDatabaseFromCSV() {
    let result = true;
    let lowMemory = true;

    await this.db.updateDatabaseFromCSV(await new CSVDatabase(CaseInformation))
        .then(async (res) => {
          if (!res) result = false;

          while (lowMemory) {
            const memUsed = process.memoryUsage().heapTotal / 1000000;
            if (memUsed < 150) lowMemory = false;
            global.gc();
          }

          return this.db.updateDatabaseFromCSV(await new CSVDatabase(FacilityInformation));
        })
        .then((res) => {
          if (!res) result = false;
          global.gc();
        }).catch((err) => {
          throw new Error(err);
        });

    lowMemory = true;
    while (lowMemory) {
      const memUsed = process.memoryUsage().heapTotal / 1000000;
      if (memUsed < 150) lowMemory = false;
      global.gc();
    }

    return result;
  }
}

module.exports = DatabaseAdapter;
