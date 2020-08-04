/* eslint-disable max-len */
const CSVDatabase = require('./CSVDatabase');
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
        if (process.env.DATABASE_TYPE.toLowerCase() === 'nosql') {
          msg = await this.connect(new MongoDBDatabase());
        } else if (process.env.DATABASE_TYPE.toLowerCase() === 'mysql') {
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
   * @return {Promise}
   */
  get(queries) {
    return this.db.get(queries);
  }

  /**
   * @param {Object|null} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters= null) {
    return this.db.count(objFilters);
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
   * @return {Promise}
   */
  getTimeline() {
    return this.db.getTimeline();
  }

  /**
   * @param {String} query
   * @return {Promise}
   */
  executeRaw(query) {
    return this.db.executeRaw(query);
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
    return this.db.updateDatabaseFromCSV(await new CSVDatabase());
  }
}

module.exports = DatabaseAdapter;
