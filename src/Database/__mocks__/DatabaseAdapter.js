/* eslint-disable max-len */

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

        console.log('Using Mocked DatabaseAdapter');
      }

      return DatabaseAdapter.instance;
    })();
  }

  /**
   * @param {*} database Database Class
   * @return {Promise<String>} Returns a message whether connection is success or not
   */
  connect(database) {
    return Promise.resolve('Mocked Database Connected Successfully');
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
    return new Promise((resolve, reject) => {
      if (queries.month > 12) return reject(new Error('Error: the month cannot be greater than 12'));
      if (queries.day > 31) return reject(new Error('Error: the day cannot be greater than 31'));
      if (queries.page < 1 || queries.limit < 1) return reject(new Error('Error: page or limit query can\'t be less than 1.'));
      if (queries.limit > queries.maxLimit) return reject(new Error(`Error: limit query can\'t be greater than ${queries.maxLimit}.`));

      const res = [];

      for (let i = 0; i < queries.limit; i++) {
        res.push({
          '_id': '5f2ac3b70715e1cd80a21980',
          'case_code': 'C358722',
          'age': 40,
          'age_group': '40-44',
          'sex': 'female',
          'date_specimen': '2020-07-31',
          'date_result_release': '2020-08-03',
          'date_rep_conf': '2020-08-05',
          'date_died': '',
          'date_recover': '',
          'removal_type': '',
          'admitted': 'no',
          'region_res': 'Region X: Northern Mindanao',
          'prov_res': 'misamis occidental',
          'city_mun_res': 'jimenez',
          'city_muni_psgc': 'PH104207000',
          'health_status': 'mild',
          'quarantined': 'no',
          'date_onset': '',
          'pregnant_tab': 'no',
          'validation_status': 'Multiple location names correspond to the same Province PSGC',
        });
      }

      resolve(res);
    });
  }

  /**
   * @param {Object|null} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters= null) {
    return Promise.resolve(1);
  }

  /**
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return Promise.resolve([{
      '_id': '5f29a6dcc4ce73be6be92915',
      'case_code': 'C626471',
      'age': 40,
      'age_group': '40-44',
      'sex': 'male',
      'date_specimen': '2020-06-21',
      'date_result_release': '2020-06-22',
      'date_rep_conf': '2020-07-02',
      'date_died': '',
      'date_recover': '',
      'removal_type': 'recovered',
      'admitted': 'no',
      'region_res': 'Region IV-A: CALABARZON',
      'prov_res': '',
      'city_mun_res': '',
      'city_muni_psgc': '',
      'health_status': 'recovered',
      'quarantined': 'no',
      'date_onset': '',
      'pregnant_tab': '',
      'validation_status': 'Removal Type is "Recovered", but no Recovered Date is recorded\nRemoval Type is "Recovered", but no Recovered Date is recorded\nHealth Status is "Recovered", but no Date Recovered is recorded\nHealth Status is "Recovered", but no Date Recovered is recorded',
    }]);
  }

  /**
   * @param {String} region
   * @return {Promise<Object>} result
   * @return {Promise<Object>} result.data
   * @return {Promise<Object>} result.fatalityRate
   * @return {Promise<Object>} result.recoveryRate
   */
  getSummary(region = null) {
    return Promise.resolve({
      'result': {
        'total': 112593,
        'recoveries': 66049,
        'deaths': 2115,
        'active_cases': 44429,
      },
      'fatalityRate': '1.88',
      'recoveryRate': '58.66',
    });
  }

  /**
   * @return {Promise}
   */
  getTimeline() {
    return Promise.resolve([{
      'cases': 1,
      'date': '2020-01-16',
    }]);
  }

  /**
   * @return {Promise}
   */
  getTopRegions() {
    return Promise.resolve([{
      'region': 'NCR',
      'cases': 71145,
    }]);
  }

  /**
   *
   * @return {Promise<String>}
   */
  getLatestFolderID() {
    return Promise.resolve('Mocked Folder ID');
  }

  /**
   *
   * @return {Promise<String>}
   */
  getLastUpdateDate() {
    return Promise.resolve('8/5/2020, 10:10:33 PM');
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
    return Promise.resolve('Mocked Inserted');
    // return this.db.insert(tableName, fieldValueObj);
  }

  /**
   * End Database connection
   */
  endConnection() {
    // this.db.endConnection();
  }

  /**
   * Update database form csv
   * @return {Promise<boolean>}
   */
  async updateDatabaseFromCSV() {
    return Promise.resolve(true);
    // return this.db.updateDatabaseFromCSV(await new CSVDatabase());
  }
}

module.exports = DatabaseAdapter;
