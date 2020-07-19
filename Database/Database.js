/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const mySQLDatabase = require('./MySQLDatabase');
const MySQLDatabase = mySQLDatabase.MySQLDatabase;

const csvDatabase = require('./CSVDatabase');
const CSVDatabase = csvDatabase.CSVDatabase;

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance=this;
      // If we need to change database in the future
      // we only need to change this class wtih same methods
      console.log('Connecting to datbase');
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

    return Database.instance;
  }

  get(numEntries) {
    return this.db.get(numEntries);
  }

  /**
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  count(objFilters) {
    return this.db.count(objFilters);
  }

  /**
   * @param {String} field
   * @param {String} value
   * @return {Promise} Contains JSON
   */
  filter(field, value) {
    return this.db.filter(field, value);
  }

  /**
   * @param {Array} csArr
   * @param {int} batchSize
   */
  async batchInsertDatabaseFromCSV(csArr, batchSize=10000) {
    console.log(`\nPerforming batch insert (batchsize: ${batchSize}):`);
    let isSuccess = true;
    let lastRowIndex = 0;
    const csArrLength = csArr.length;
    const batchRuns = Math.ceil(csArr.length / batchSize);
    for (let i = 0; i < batchRuns; i++) {
      console.log(`Running batch ${i+1}/${batchRuns}`);
      const nextLastRowIndex = lastRowIndex+batchSize;
      // console.log('lastRowIndex: ' + lastRowIndex);
      // console.log('nextLastRowIndex: ' + nextLastRowIndex);

      const sliceStart = lastRowIndex;
      const sliceEnd = (nextLastRowIndex >= csArr.length ? csArrLength : nextLastRowIndex);

      // console.log('sliceS: ' + sliceStart + ', sliceE: ' + sliceEnd);
      const csBatchArr = csArr.slice(sliceStart, sliceEnd); // BUG RESOLVE: Splice vs slice :O
      // console.log('csBatchArr.length: ' + csBatchArr.length + '\n');
      lastRowIndex = nextLastRowIndex;

      let query = `INSERT IGNORE INTO case_informations (CaseCode, Age, AgeGroup, Sex, DateSpecimen, \
        DateResultRelease, DateRepConf, DateDied, DateRecover, RemovalType, Admitted, RegionRes, ProvRes, \
        CityMunRes, CityMuniPSGC, HealthStatus, Quarantined, DateOnset, Pregnanttab, ValidationStatus) VALUES`;

      // BUG RESOLVE Lesson learned, ALWAYS ESCAPE CHARS BEFORE INSERTING TO DB EVEN FROM A CSV!!!
      csBatchArr.forEach((data, ind) => {
        query += ` (${this.db.connection.escape(data.CaseCode)}, \
${this.db.connection.escape(data.Age)}, \
${this.db.connection.escape(data.AgeGroup)}, \
${this.db.connection.escape(data.Sex)}, \
${this.db.connection.escape(data.DateSpecimen)}, \
${this.db.connection.escape(data.DateResultRelease)}, \
${this.db.connection.escape(data.DateRepConf)}, \
${this.db.connection.escape(data.DateDied)}, \
${this.db.connection.escape(data.DateRecover)}, \
${this.db.connection.escape(data.RemovalType)}, \
${this.db.connection.escape(data.Admitted)}, \
${this.db.connection.escape(data.RegionRes)}, \
${this.db.connection.escape(data.ProvRes)}, \
${this.db.connection.escape(data.CityMunRes)}, \
${this.db.connection.escape(data.CityMuniPSGC)}, \
${this.db.connection.escape(data.HealthStatus)}, \
${this.db.connection.escape(data.Quarantined)}, \
${this.db.connection.escape(data.DateOnset)}, \
${this.db.connection.escape(data.Pregnanttab)}, \
${this.db.connection.escape(data.ValidationStatus)})`;

        if ((ind+1) != csBatchArr.length) {
          query+= ', ';
        }
      });

      await this.executeRaw(query).then((data) => {
        console.log('Affected rows: ' + JSON.parse(JSON.stringify(data)).affectedRows);
      }).catch((err) => {
        if (err) throw err;
        isSuccess = false;
      });
    }

    return isSuccess;
  }

  // For inspecting purposes only
  // async compareDatabaseFromCSV() {
  //   console.log(`\nPerforming Comparison`);

  //   const csvDatabase = new CSVDatabase();
  //   const cs = await csvDatabase.get();

  //   // let query = `SELECT MAX(datediff(DateResultRelease, DateSpecimen)) AS DateDiff FROM case_informations`;
  //   let query = `SELECT CaseCode FROM case_informations WHERE CaseCode NOT IN (`;

  //   // BUG RESOLVE Lesson learned, ALWAYS ESCAPE CHARS BEFORE INSERTING TO DB EVEN FROM A CSV!!!
  //   cs.forEach((data, ind) => {
  //     query += `${this.db.connection.escape(data.CaseCode)} `;

  //     if ((ind+1) != cs.length) {
  //       query+= ', ';
  //     } else {
  //       query+= ')';
  //     }
  //   });

  //   // console.log(query);

  //   await this.executeRaw(query).then((data) => {
  //     // console.log(data);
  //     const parseData = JSON.parse(JSON.stringify(data));
  //     console.log(parseData);
  //   }).catch((err) => {
  //     if (err) throw err;
  //   });

  //   console.log('Done');
  // }


  async updateDatabaseFromCSV() {
    const csvDatabase = new CSVDatabase();
    const cs = await csvDatabase.get();

    console.log('\nBefore Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length mysql: ' + await this.count());
    const res = await this.batchInsertDatabaseFromCSV(cs);
    console.log('\nAfter Updating Database: ');
    console.log('cs length in csv: ' + cs.length);
    console.log('cs length mysql: ' + await this.count());

    if (res) {
      console.log('\nSuccessfully transferred data from CSV to mySQL.\n');
    } else {
      console.log('\nFailed to transfer data from CSV to mySQL.\n');
    }

    return res;
  }

  /**
   * @param {String} query
   * @return {Promise}
   */
  executeRaw(query) {
    return this.db.executeRaw(query);
  }

  // initial plan was to get last added data then from there we add
  // whatever was in the new data that wasn't in the old data
  // Then Doggo realized that case code wasn't incrementally added
  // therefore we cannot order the data by the date they were entered
  // there are no other columns that could determine the order in which the data was added
  // async updateDatabaseFromCSV() {
  //   console.log('Updating Database from CSV');
  //   const csvDatabase = new CSVDatabase();
  //   const lastRow = await this.db.getLastRow();
  //   const lastRowCaseCode = JSON.parse(JSON.stringify(lastRow))[0].CaseCode;
  //   const sortedCSV = await csvDatabase.sort('caseCode');
  //   console.log('lastRowCaseCode ' + lastRowCaseCode);
  //   console.log('index ' + csvDatabase.findIndex(sortedCSV, 'C999994'));
  // }

  endConnection() {
    this.db.endConnection();
  }
}

exports.Database = Database;
