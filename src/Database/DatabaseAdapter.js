/* eslint-disable max-len */
const MySQLDatabase = require('./MySQLDatabase');

const CSVDatabase = require('./CSVDatabase');
// const CaseInformation = require('../CaseInformation');

/**
 * Handles Database
 */
class DatabaseAdapter {
  /**
   * Initialize Database and make this a singleton
   * @return {DatabaseAdapter}
   */
  constructor() {
    if (!DatabaseAdapter.instance) {
      DatabaseAdapter.instance=this;
      // If we need to change database in the future
      // we only need to change this class with same methods
      console.log('Connecting to database');
      const mySQLDatabase = new MySQLDatabase();
      this.db = mySQLDatabase;

      mySQLDatabase.connection.connect((err) => {
        if (!err) {
          console.log('Successfully connected to the Database');
        } else {
          console.log('Failed to connect to the Database: ' + err);
        }
      });
    }

    return DatabaseAdapter.instance;
  }

  /**
   * @param {Object} numEntries
   * @param {String} numEntries.count
   * @param {String} numEntries.month
   * @param {String} numEntries.day
   * @return {Promise}
   */
  get(numEntries) {
    return this.db.get(numEntries);
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
   * @return {Promise}
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
