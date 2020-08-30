/* eslint-disable max-len */

/**
 * Handles Database
 */
class DatabaseAdapter {
  private static instance: DatabaseAdapter;
  /**
   * Initialize Database and make this a singleton
   * @return {Promise<DatabaseAdapter>}
   */
  async init() {
    if (!DatabaseAdapter.instance) {
      DatabaseAdapter.instance=this;

      console.log('Using Mocked DatabaseAdapter');
    }

    return DatabaseAdapter.instance;
  }

  /**
   * @param {*} database Database Class
   * @return {Promise<String>} Returns a message whether connection is success or not
   */
  connect(database: any) {
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
  get(queries: any) {
    return new Promise((resolve, reject) => {
      if (queries.month > 12) return reject(new Error('Error: the month cannot be greater than 12'));
      if (queries.day > 31) return reject(new Error('Error: the day cannot be greater than 31'));
      if (queries.page < 1 || queries.limit < 1) return reject(new Error('Error: page or limit query can\'t be less than 1.'));
      if (queries.limit > queries.maxLimit) return reject(new Error(`Error: limit query can't be greater than ${queries.maxLimit}.`));

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
  filter(field: string, value: string|number) {
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

  // FACILITIES

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilities(queries: any) {
    return Promise.resolve([{
      'hfhudcode': 'DOH000000000000467',
      'cf_name': 'a. de la cruz maternity hospital',
      'updated_date': '2020-08-20T04:23:44.000Z',
      'added_date': '2020-08-20T04:23:44.000Z',
      'report_date': '2020-08-19T16:00:00.000Z',
      'icu_v': 0,
      'icu_o': 0,
      'isolbed_v': 1,
      'isolbed_o': 0,
      'beds_ward_v': 0,
      'beds_ward_o': 0,
      'mechvent_v': 0,
      'mechvent_o': 0,
      'icu_v_nc': 0,
      'icu_o_nc': 0,
      'nonicu_v_nc': 5,
      'nonicu_o_nc': 4,
      'mechvent_v_nc': 0,
      'mechvent_o_nc': 0,
      'q_nurse': 1,
      'q_doctor': 0,
      'q_other': 0,
      'nurse_adm': 0,
      'doctor_adm': 0,
      'other_adm': 0,
      'susp_asym': 0,
      'susp_mild': 0,
      'susp_severe': 0,
      'susp_crit': 0,
      'susp_died': 0,
      'prob_asym': 0,
      'prob_mild': 0,
      'prob_severe': 0,
      'prob_crit': 0,
      'prob_died': 0,
      'conf_asym': 0,
      'conf_mild': 0,
      'conf_severe': 0,
      'conf_crit': 0,
      'conf_died': 0,
      't_patient_adm': 0,
      't_patient_er': 0,
      't_patient_icu': 0,
      'trans_ttmf': 0,
      'discharged': 0,
      'region': 'region iv-a: calabarzon',
      'region_psgc': 'PH040000000',
      'province': 'cavite',
      'province_psgc': 'PH042100000',
      'city_mun': 'cavite city',
      'city_mun_psgc': 'PH042105000',
      'north_coord': '0.0',
      'east_coord': '0.0',
    }]);
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilitiesSummary(queries: any) {
    return Promise.resolve({
      'total_facilities': 1925,
      'occupancy_rate': 0.49,
      'beds': {
        'total_vacant': 9947,
        'total_occupied': 9489,
        'covid': {
          'icu_v': 829,
          'icu_o': 851,
          'isolbed_v': 6678,
          'isolbed_o': 6102,
          'beds_ward_v': 2440,
          'beds_ward_o': 2536,
        },
        'non_covid': {
          'icu_v_nc': 3322,
          'icu_o_nc': 2950,
          'nonicu_v_nc': 42120,
          'nonicu_o_nc': 40696,
        },
      },
      'equipments': {
        'mechvent_v': 1521,
        'mechvent_o': 645,
        'mechvent_v_nc': 2397,
        'mechvent_o_nc': 2397,
      },
    });
  }

  // ./FACILITIES

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
  truncate(tableName: string) {
    return Promise.resolve();
  }

  /**
   * @param {String} tableName
   * @param {Object} fieldValueObj
   * @return {Promise<String>}
   */
  insert(tableName: string, fieldValueObj: any) {
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

export default DatabaseAdapter;
