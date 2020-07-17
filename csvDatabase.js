/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const csv = require('csvtojson');
const path = require('path');
const caseInformation = require('./CaseInformation');
const fs = require('fs');

const CaseInformation = caseInformation.CaseInformation;

class CSVDatabase {
  // make this a singleton
  constructor() {
    this.isCSLoaded = false;
    this.CaseInformations = [];
    if (!CSVDatabase.instance) {
      CSVDatabase.instance = this;
      this.convertCsvToJson();
    }

    return CSVDatabase.instance;
  }

  assureCSIsLoaded() {
    if (!this.isCSLoaded) {
      console.log('CSV is not loaded, attempting to load now');
      this.convertCsvToJson();
      this.isCSLoaded = true;
    }
  }

  convertCsvToJson() {
    const p = path.join(__dirname, 'tmp/Data.csv');
    try {
      if (fs.existsSync(p)) {
        // Invoking csv returns a promise
        return this.converter = csv()
            .fromFile(p)
            .then((json) => {
              let c;
              json.forEach((row) => {
                c = new CaseInformation();
                Object.assign(c, row);
                this.CaseInformations.push(c);
              });
            }).then(() => {
              console.log('Case Information loaded');
            });
      } else {
        console.error('Cannot find Data.csv, Did you visit "/api/downloadLatestFiles"?');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // /**
  //  * @param {String} ageGroup specific int to filter results by age
  //  * @return {CaseInformations} contains the filtered object
  //  *
  //  * All valid Values of ageGroup
  //  * '0 to 4'
  //  * '5 to 9'
  //  * '10 to 14'
  //  * '15 to 19'
  //  * '20 to 24'
  //  * '25 to 29'
  //  * '30 to 34'
  //  * '35 to 39'
  //  * '40 to 44'
  //  * '45 to 49'
  //  * '50 to 54'
  //  * '55 to 59'
  //  * '60 to 64'
  //  * '65 to 69'
  //  * '70 to 74'
  //  * '75 to 79'
  //  * '80+'
  //  */

  /**
     * An all purpose filter instead of having a filter function for every field
     * @param {*} field
     * @param {*} value
     */
  async filter(field, value) {
    this.assureCSIsLoaded();
    await this.converter;
    return this.CaseInformations.filter((ci) => ci[field] == value);
  }

  /**
     *
     * @param {int} size Max number of entries to return
     * @return {CaseInformation}
     */
  async all(size=this.CaseInformations.length) {
    this.assureCSIsLoaded();
    await this.converter;
    return this.CaseInformations.slice(0, size);
  }

  // async start() {
  //     let a = await this.filter('ageGroup', '15 to 19')
  //     console.log(a)
  // }
}

exports.CSVDatabase = CSVDatabase;

// let c = new CSVDatabase();
// c.start();
