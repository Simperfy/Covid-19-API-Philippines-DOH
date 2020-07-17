/* eslint-disable require-jsdoc */
const mySQLDatabase = require('./MySQLDatabase');
const MySQLDatabase = mySQLDatabase.MySQLDatabase;

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance=this;
      // If we need to change database in the future
      // we only need to change this class wtih same methods
      console.log('Connecting to datbase');
      const mySQLDatabase = new MySQLDatabase();
      this.connection = mySQLDatabase;
      if (this.connection) {
        console.log('Successfully connected to the Database');
      } else {
        console.log('Failed to connect to the Database');
      }
    }

    return Database.instance;
  }

  get(numEntries) {
    return this.connection.get(numEntries);
  }

  /**
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters) {
    return this.connection.count(objFilters);
  }

  /**
   * @param {String} field
   * @param {String} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return this.connection.filter(field, value);
  }

  endConnection() {
    this.connection.endConnection();
  }
}

exports.Database = Database;
