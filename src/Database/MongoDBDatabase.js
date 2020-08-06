/* eslint-disable require-jsdoc,max-len */
const MongoDB = require('mongodb');

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

      if (await this.connection === undefined) {
        return reject(new Error('[MongoDBDatabase] ' + 'Failed to connect.'));
      }

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
        const result = await collection.find({}, {limit: 1}).sort({updated_at: -1});
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
        const result = await collection.find({}, {limit: 1}).sort({updated_at: -1});
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
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  async count(objFilters = null) {
    // console.log(this.connection);
    return new Promise((resolve, reject) => {
      this.connection.then((client) => {
        const db = client.db();
        let collection = db.collection('case_informations');

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
   * @return {Promise}
   */
  getTimeline() {
    return new Promise(async (resolve, reject) => {
      await this.connection.then(async (client) => {
        const db = client.db();
        const collection = db.collection('case_informations');

        try {
          const result = await collection.aggregate([
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

  /**
   * @param {CaseInformation[]} csArr
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

      const caseInfos = [];
      csBatchArr.forEach((data, ind) => {
        caseInfos.push({
          'case_code': data.CaseCode,
          'age': data.Age,
          'age_group': data.AgeGroup,
          'sex': data.Sex,
          'date_specimen': data.DateSpecimen,
          'date_result_release': data.DateResultRelease,
          'date_rep_conf': data.DateRepConf,
          'date_died': data.DateDied,
          'date_recover': data.DateRecover,
          'removal_type': data.RemovalType,
          'admitted': data.Admitted,
          'region_res': data.RegionRes,
          'prov_res': data.ProvRes,
          'city_mun_res': data.CityMunRes,
          'city_muni_psgc': data.CityMuniPSGC,
          'health_status': data.HealthStatus,
          'quarantined': data.Quarantined,
          'date_onset': data.DateOnset,
          'pregnant_tab': data.Pregnanttab,
          'validation_status': data.ValidationStatus,
        });
      });

      await this.connection.then(async (client) => {
        const db = client.db();
        await db.collection('case_informations').insertMany(caseInfos, {forceServerObjectId: true});
        // db.close();
      });
      console.log(`Inserted: ${caseInfos.length} rows`);
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
    const res = await this.batchInsertDatabaseFromCSV(cs, 25000);
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
}

module.exports = MongoDBDatabase;
