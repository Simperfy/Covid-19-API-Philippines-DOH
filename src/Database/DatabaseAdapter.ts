import CSVDatabase from './CSVDatabase';
import CaseInformation from '../CaseInformation';
import FacilityInformation from '../FacilityInformation';
import MongoDBDatabase from './MongoDBDatabase';
import { DB_NAMES } from '../utils/enums';

/**
 * Handles Database
 */
class DatabaseAdapter {
  private static instance: DatabaseAdapter;

  private db!: MongoDBDatabase;

  /**
   * return {DatabaseAdapter} instance of the database adapter
   */
  async init(): Promise<DatabaseAdapter> {
    if (!DatabaseAdapter.instance) {
      DatabaseAdapter.instance = this;

      console.log('Connecting to database');
      let msg;
      console.log(`Database Type: ${process.env.DATABASE_TYPE}`);
      if (String(process.env.DATABASE_TYPE).toLowerCase() === 'nosql') {
        msg = await this.connect(new MongoDBDatabase());
      } else if (String(process.env.DATABASE_TYPE).toLowerCase() === 'mysql') {
        // msg = await this.connect(new MySQLDatabase());
        throw Error('MYSQL Database is deprecated');
      } else {
        throw Error('Please specify "DATABASE_TYPE" in environment variables');
      }
      console.log(msg);
    }

    return DatabaseAdapter.instance;
  }

  /**
   * @param {*} database Database Class
   * @return {Promise<String>} Returns a message whether connection is success or not
   */
  connect(database: MongoDBDatabase) {
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
   * @return {Promise<*>}
   */
  get(queries: {[key: string]: string|number|undefined}) {
    return this.db.get(queries);
  }

  /**
   * @param {DB_NAMES} dbName database name
   * @param {Object|null} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(dbName: DB_NAMES, objFilters: any = null): Promise<number> {
    return this.db.count(dbName, objFilters);
  }

  /**
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter(field: string, value: string|number) {
    return this.db.filter(field, value);
  }

  /**
   * @param {String} region
   * @return {Promise<Object>} result
   * @return {Promise<Object>} result.data
   * @return {Promise<Object>} result.fatalityRate
   * @return {Promise<Object>} result.recoveryRate
   */
  getSummary(region: any = null) {
    return this.db.getSummary(region);
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getTimeline(queries: any) {
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
  getFacilities(queries: any) {
    return this.db.getFacilities(queries);
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilitiesSummary(queries: any) {
    return this.db.getFacilitiesSummary(queries);
  }

  // ./FACILITIES

  /**
   * @param {String} field
   * @param {String} dataset
   * @return {Promise}
   */
  getListOf(field: string, dataset: string) {
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
  truncate(tableName: string) {
    return this.db.truncate(tableName);
  }

  /**
   * @param {String} tableName
   * @param {Object} fieldValueObj
   * @return {Promise<String>}
   */
  insert(tableName: string, fieldValueObj: any) {
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

    // eslint-disable-next-line max-len
    let res = await this.db.updateDatabaseFromCSV((await new CSVDatabase().init(new CaseInformation())), DB_NAMES.CASE_INFORMATION);

    if (!res) result = false;

    while (lowMemory) {
      const memUsed = process.memoryUsage().heapTotal / 1000000;
      if (memUsed < 150) lowMemory = false;
      global.gc();
    }

    // eslint-disable-next-line max-len
    res = await this.db.updateDatabaseFromCSV((await new CSVDatabase().init(new FacilityInformation())), DB_NAMES.FACILITY_INFORMATION);

    if (!res) result = false;
    global.gc();

    lowMemory = true;
    while (lowMemory) {
      const memUsed = process.memoryUsage().heapTotal / 1000000;
      if (memUsed < 150) lowMemory = false;
      global.gc();
    }

    return result;
  }
}

export default DatabaseAdapter;
