/* eslint-disable require-jsdoc,max-len */
const MongoDB = require('mongodb');
const {getCSVInfoObj} = require('../utils/helper');

const CaseInformation = require('../CaseInformation');
const FacilityInformation = require('../FacilityInformation');

class MongoDBDatabase {
  constructor() {
    if (!MongoDBDatabase.instance) {
      MongoDBDatabase.instance=this;

      this.connection = MongoDB.MongoClient;
    }

    return MongoDBDatabase.instance;
  }

  /**
   * @return {Promise<*>}
   */
  connect() {
    return new Promise(async (resolve, reject) => {
      const dbUrl = process.env.DB_NOSQL_URI;

      this.connection = this.connection.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).catch((err) => {
        return reject(new Error('[MongoDBDatabase] ' + err));
      });

      if (await this.connection === undefined) return reject(new Error('[MongoDBDatabase] ' + 'Failed to connect.'));


      resolve('Successfully connected to the Mongo Database');
    });
  }

  /**
   * @param {Object} queries
   * @param {String} queries.month
   * @param {String} queries.day
   * @param {int} queries.page
   * @param {int} queries.limit
   * @param {int} queries.maxLimit
   * @param {Object|undefined} queries.filters
   * @return {Promise} returns JSON of the result
   */
  get(queries) {
    return new Promise((resolve, reject) => {
      if (queries.month > 12) return reject(new Error('Error: the month cannot be greater than 12'));
      if (queries.day > 31) return reject(new Error('Error: the day cannot be greater than 31'));
      if (queries.page < 1 || queries.limit < 1) return reject(new Error('Error: page or limit query can\'t be less than 1.'));
      if (queries.limit > queries.maxLimit) return reject(new Error(`Error: limit query can\'t be greater than ${queries.maxLimit}.`));

      this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        let filter = {};
        const opt = {
          limit: queries.limit,
          skip: (queries.page - 1) * queries.limit,
          projection: {'_id': 0},
        };
        const sortOpt = {
          case_code: 1,
        };

        if (queries.month && !queries.day) {
          const date = '/2020-' + queries.month + '.*/';
          filter = {
            $or: [
              {$and: [
                {date_specimen: date},
                {date_onset: ''},
              ]},
              {date_onset: date},
            ],
          };
        } else if (queries.month && queries.day) {
          const date = '2020-' + queries.month + '-' + queries.day;
          filter = {
            $or: [
              {$and: [
                {date_specimen: date},
                {date_onset: ''},
              ]},
              {date_onset: date},
            ],
          };
        }

        // add filters
        if (queries.filters) {
          console.log(queries.filters);
          for (const key of Object.keys(queries.filters)) {
            if (!isNaN(queries.filters[key])) queries.filters[key] = Number(queries.filters[key]);
            filter[key] = queries.filters[key] || '';
          }
        }

        try {
          const result = await collection.find(filter, opt).sort(sortOpt);
          resolve(await result.toArray());
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  // @TODO @Doggo merge getLatestFolderID and getLastUpdateDate to one function
  /**
   *
   * @return {Promise<String>}
   */
  async getLatestFolderID() {
    let res;
    await this.connection.then(async (client) => {
      const db = client.db();
      const collection = db.collection('update_history');

      try {
        const result = await collection.find({}, {limit: 1}).sort({_id: -1});
        res = await result.toArray();
      } catch (e) {
        reject(new Error(e));
      }
    });

    if (res.length === 0) {
      return '';
    }

    return res[0].folder_id || '';
  }

  /**
   *
   * @return {Promise<String>}
   */
  async getLastUpdateDate() {
    let res;
    await this.connection.then(async (client) => {
      const db = client.db();
      const collection = db.collection('update_history');

      try {
        const result = await collection.find({}, {limit: 1}).sort({_id: -1});
        res = await result.toArray();
      } catch (e) {
        reject(new Error(e));
      }
    });

    if (res.length === 0) {
      return '';
    }

    return new Date(res[0]._id.getTimestamp()).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
    }) || '';
  }

  /**
   * @param {String} dbName database name
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  async count(dbName, objFilters = null) {
    // console.log(this.connection);
    return new Promise((resolve, reject) => {
      this.connection.then((client) => {
        const db = client.db();
        let collection = db.collection(dbName);

        if (objFilters !== null) {
          const field = objFilters.field;
          const value = objFilters.value;
          const tempObj = {};
          tempObj[field] = value;
          collection = collection.find(tempObj);

          return collection.toArray(function(err, docs) {
            if (err) reject(new Error(err.message));
            resolve(docs.length);
          });
        }

        return collection.countDocuments().then((data) => {
          resolve(data);
          // client.close();
        }).catch((err) => reject(new Error(err)));
      });
    });
  }

  /**
   * @deprecated
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        const filter = {};
        const opts = {
          projection: {_id: 0},
        };
        filter[field] = value;

        try {
          const result = await collection.find(filter, opts);
          resolve(await result.toArray());
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  /**
   * @param {String} region
   * @return {Promise<Object>} result
   * @return {Promise<Object>} result.data
   * @return {Promise<Object>} result.fatalityRate
   * @return {Promise<Object>} result.recoveryRate
   */
  getSummary(region = null) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        const totalFilter = {};
        const recoveriesFilter = {removal_type: 'recovered'};
        const diedFilter = {removal_type: 'died'};
        const activeCasesFilter = {removal_type: '', date_rep_conf: {$exists: true}};
        const filters = [totalFilter, recoveriesFilter, diedFilter, activeCasesFilter];

        if (region !== null) {
          filters.forEach((filter) => {
            filter.region_res = region;
          });
        }

        try {
          const result = await collection.aggregate([
            {$lookup:
                {
                  from: 'case_informations',
                  pipeline: [
                    {$match: totalFilter},
                    {$group: {_id: '$case_informations', count: {$sum: 1}}},
                    {$project: {'_id': 0}},
                  ],
                  as: 'total',
                },
            },
            {$lookup:
                {
                  from: 'case_informations',
                  pipeline: [
                    {$match: recoveriesFilter},
                    {$group: {_id: '$removal_type', count: {$sum: 1}}},
                    {$project: {'_id': 0}},
                  ],
                  as: 'recoveries',
                },
            },
            {$lookup:
                {
                  from: 'case_informations',
                  pipeline: [
                    {$match: diedFilter},
                    {$group: {_id: '$removal_type', count: {$sum: 1}}},
                    {$project: {'_id': 0}},
                  ],
                  as: 'deaths',
                },
            },
            {$lookup:
                {
                  from: 'case_informations',
                  pipeline: [
                    {$match: activeCasesFilter},
                    {$group: {_id: '$case_informations', count: {$sum: 1}}},
                    {$project: {'_id': 0}},
                  ],
                  as: 'active_cases',
                },
            },
            {$project: {'_id': 0, 'recoveries': 1, 'deaths': 1, 'total': 1, 'active_cases': 1}},
          ]).limit(1);

          const res = await result.toArray();
          res[0].total = res[0].total[0].count;
          res[0].recoveries = res[0].recoveries[0].count;
          res[0].deaths = res[0].deaths[0].count;
          res[0].active_cases = res[0].active_cases[0].count;

          let fatalityRate = res[0].deaths / res[0].total;
          let recoveryRate = res[0].recoveries / res[0].total;
          fatalityRate = (fatalityRate * 100).toFixed(2);
          recoveryRate = (recoveryRate * 100).toFixed(2);

          resolve({
            'result': res[0],
            'fatalityRate': fatalityRate,
            'recoveryRate': recoveryRate,
          });
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getTimeline(queries) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        const filter = {};
        // accept either region or region_res
        if (queries.region) filter['region_res'] = queries.region.toLowerCase();
        else if (queries.region_res) filter['region_res'] = queries.region_res.toLowerCase();

        try {
          const result = await collection.aggregate([
            {$match: filter},
            {$match: {$or: [{'date_onset': {'$ne': ''}}, {'date_specimen': {'$ne': ''}}]}},
            {
              $group: {
                _id: {
                  'date': {
                    $cond: {
                      if: {$eq: ['$date_onset', '']}, then: '$date_specimen', else: '$date_onset',
                    },
                  },
                },
                cases: {$sum: 1},
              },
            },
            {$sort: {'_id.date': 1}},
            {$project: {'_id': 0, 'date': '$_id.date', 'cases': 1}},
          ]);
          const res = await result.toArray();
          resolve(res);
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  /**
   * @return {Promise}
   */
  getTopRegions() {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        try {
          const result = await collection.aggregate([
            {$match: {'region_res': {'$ne': ''}}},
            {
              $group: {
                _id: '$region_res',
                cases: {$sum: 1},
              },
            },
            {$sort: {'cases': -1}},
            {$project: {'_id': 0, 'region': '$_id', 'cases': '$cases'}},
          ]);
          const res = await result.toArray();
          resolve(res);
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  // FACILITIES

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilities(queries) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('facility_informations');

        for (const key of Object.keys(queries)) {
          if (!isNaN(queries[key])) {
            queries[key] = Number(queries[key]);
          }
        }

        const filter = queries;
        const opt = {
          projection: {_id: 0},
        };

        try {
          const result = await collection.find(filter, opt).sort({'cf_name': 1});
          const res = await result.toArray();
          resolve(res);
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilitiesSummary(queries) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('facility_informations');

        const filter = {};
        if (queries.region) filter['region'] = queries.region.toLowerCase();
        if (queries.hospital_name) filter['cf_name'] = queries.hospital_name.toLowerCase();

        try {
          const result = await collection.aggregate([
            {$match: filter},
            {
              $group: {
                _id: null,
                total_facilities: {$sum: 1},
                icu_v: {$sum: '$icu_v'},
                icu_o: {$sum: '$icu_o'},
                isolbed_v: {$sum: '$isolbed_v'},
                isolbed_o: {$sum: '$isolbed_o'},
                beds_ward_v: {$sum: '$beds_ward_v'},
                beds_ward_o: {$sum: '$beds_ward_o'},
                nonicu_v_nc: {$sum: '$nonicu_v_nc'},
                nonicu_o_nc: {$sum: '$nonicu_o_nc'},
                mechvent_v: {$sum: '$mechvent_v'},
                mechvent_o: {$sum: '$mechvent_o'},
              },
            },
            {
              $project: {
                _id: 0,
                total_facilities: '$total_facilities',
                occupancy_rate: '0.0',
                beds: {
                  total_vacant: {
                    $add: ['$icu_v',
                      '$isolbed_v',
                      '$beds_ward_v'],
                  },
                  total_occupied: {
                    $add: ['$icu_o',
                      '$isolbed_o',
                      '$beds_ward_o'],
                  },
                  icu_v: '$icu_v',
                  icu_o: '$icu_o',
                  isolbed_v: '$isolbed_v',
                  isolbed_o: '$isolbed_o',
                  beds_ward_v: '$beds_ward_v',
                  beds_ward_o: '$beds_ward_o',
                },
                equipments: {
                  mechvent_v: '$mechvent_v',
                  mechvent_o: '$mechvent_o',
                },
              },
            },
          ]);
          const res = await result.toArray();

          res[0].occupancy_rate = res[0].beds.total_occupied / (res[0].beds.total_occupied + res[0].beds.total_vacant);
          res[0].occupancy_rate = parseFloat(res[0].occupancy_rate.toFixed(2)) || 0;

          resolve(res[0]);
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  // ./FACILITIES

  /**
   * Truncates Database table
   * @param {String} tableName
   * @return {Promise<void>}
   */
  truncate(tableName) {
    return new Promise(async (resolve, reject) => {
      let db;
      await this.connection.then(async (client) => {
        db = client.db();
        const items = await db.listCollections().toArray();
        for (const item of items) {
          if (item.name === tableName) {
            console.log('Dropping: ' + item.name);
            await db.collection(tableName).drop().then((result) => {
              console.log(result);
              resolve(result);
            });
          }
        }

        if (items.length === 0) {
          console.log('No collections in database');
          resolve('No collections in database');
        }
        resolve('Table not found');
      }).catch((err) => {
        reject(new Error('[MySQLDatabase.js] ' + err));
      });
    });
  }

  /**
   * @param {String} tableName
   * @param {Object} fieldValueObj
   * @return {Promise<String>}
   */
  insert(tableName, fieldValueObj) {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('update_history');

        try {
          await collection.insertOne(fieldValueObj, {forceServerObjectId: true});
          resolve('Successfully inserted data');
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }

  /**
   * End Database connection
   */
  async endConnection() {
    await this.connection.then(async (client) => {
      client.close();
    });
  }

  // @TODO @DOGGO This function violates open/closed principle for now
  /**
   * @param {CaseInformation[]|FacilityInformation[]} csArr
   * @param {int} batchSize
   * @return {Promise<boolean>}
   */
  async batchInsertDatabaseFromCSV(csArr, batchSize=10000) {
    console.log(`\nPerforming batch insert (batch size: ${batchSize}):`);
    const isSuccess = true;
    let lastRowIndex = 0;
    const csArrLength = csArr.length;
    const batchRuns = Math.ceil(csArr.length / batchSize);
    for (let i = 0; i < batchRuns; i++) {
      console.log(`Running batch ${i+1}/${batchRuns}`);
      const nextLastRowIndex = lastRowIndex+batchSize;

      const sliceStart = lastRowIndex;
      const sliceEnd = (nextLastRowIndex >= csArr.length ? csArrLength : nextLastRowIndex);

      const csBatchArr = csArr.slice(sliceStart, sliceEnd);
      lastRowIndex = nextLastRowIndex;

      const csvInfo = getCSVInfoObj(csBatchArr);

      await this.connection.then(async (client) => {
        const db = client.db();
        await db.collection(csvInfo.csvDbName).insertMany(csvInfo.csvArr, {forceServerObjectId: true});
      });
      console.log(`Inserted: ${csvInfo.csvArr.length} rows`);
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

    const cs = await csvDatabase.get();
    let dbName;

    if (cs[0] instanceof CaseInformation) {
      dbName = 'case_informations';
    } else if (cs[0] instanceof FacilityInformation) {
      dbName = 'facility_informations';
    }

    console.log(`Truncating ${dbName} table, because it causes anomaly when we don\'t.`);
    await this.truncate(dbName);

    console.log('\nBefore Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length in database: ' + await this.count(dbName));
    const res = await this.batchInsertDatabaseFromCSV(cs, 25000);
    console.log('\nAfter Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length in database: ' + await this.count(dbName));

    if (res) console.log('\nSuccessfully transferred data from CSV to Database.\n');
    else console.log('\nFailed to transfer data from CSV to Database.\n');

    return res;
  }
}

module.exports = MongoDBDatabase;
