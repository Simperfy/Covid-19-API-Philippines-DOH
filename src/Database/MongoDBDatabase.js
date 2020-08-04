/* eslint-disable require-jsdoc,max-len */
const MongoClient = require('mongodb').MongoClient;

class MongoDBDatabase {
  constructor() {
    if (!MongoDBDatabase.instance) {
      MongoDBDatabase.instance=this;

      this.connection = MongoClient;
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
        return reject(new Error('[MongoDBDatabase] ' + ' Failed to connect.'));
      }

      resolve('Successfully connected to the Mongo Database');
    });
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
          client.close();
        }).catch((err) => reject(new Error(err)));
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
        await db.listCollections().toArray(function(err, items) {
          if (err) throw err;

          items.forEach(async (item) => {
            if (item.name === tableName) {
              console.log('Dropping: ' + item.name);
              await db.collection(tableName).drop().then((result) => {
                console.log(result);
                resolve(result);
              });
            }
          });

          if (items.length === 0) {
            console.log('No collections in database');
            resolve('No collections in database');
          }
        });

        resolve('Table not found');
      }).catch((err) => {
        reject(new Error('[MySQLDatabase.js] ' + err));
      });
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
        db.close();
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
