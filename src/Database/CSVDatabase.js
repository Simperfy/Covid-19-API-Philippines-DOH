/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const csv = require('csvtojson');
const path = require('path');
// const caseInformation = require('../CaseInformation');
const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const {Converter} = require('csvtojson/v2/Converter');
// const CaseInformation = caseInformation.CaseInformation;
// const CSV_FILE_PATH = path.join(__dirname, '../../tmp/Data.csv');

class CSVDatabase {
  // make this a singleton
  constructor(CSVClass) {
    return (async () => {
      this.isConverting = false;
      this.csvClass = CSVClass;
      this.CSVDatabaseArray = [];
      this.csvFilePath = path.join(__dirname, `../../tmp/${this.csvClass.getFilename()}`);

      await this.convertCsvToJson();
      return this;
    })();
  }

  /**
   * @return {Promise<Converter>}
   */
  assureCSIsLoaded() {
    return this.converter;
  }

  /**
   * @return {Promise<Converter>}
   */
  convertCsvToJson() {
    if (!this.isConverting) { // prevent multiple attempts to convert the json
      this.isConverting = true;
      const pathToCSV = this.csvFilePath;

      if (fs.existsSync(pathToCSV)) {
        // Invoking csv returns a promise
        return this.converter = csv()
            .fromFile(pathToCSV)
            .then((json) => {
              let c;
              json.forEach((row) => {
                // eslint-disable-next-line new-cap
                c = new this.csvClass();
                Object.assign(c, row);
                this.CSVDatabaseArray.push(c);
              });
            }).then(() => {
              console.log('Case Information loaded');
              return true;
            }).catch((err) => {
              console.log(err);
            });
      } else {
        this.isConverting = false;
        console.error(`Cannot find ${this.csvFilePath}, Did you visit "/api/downloadLatestFiles"?`);
      }
    }
  }

  /**
     * All valid Values of ageGroup
     * '0 to 4'
     * '5 to 9'
     * '10 to 14'
     * '15 to 19'
     * '20 to 24'
     * '25 to 29'
     * '30 to 34'
     * '35 to 39'
     * '40 to 44'
     * '45 to 49'
     * '50 to 54'
     * '55 to 59'
     * '60 to 64'
     * '65 to 69'
     * '70 to 74'
     * '75 to 79'
     * '80+'
     * @param {String} field
     * @param {String} value
     */
  async filter(field, value) {
    await this.assureCSIsLoaded();
    return this.CSVDatabaseArray.filter((ci) => ci[field] == value);
  }

  /**
     *
     * @param {int} size Max number of entries to return
     * @return {Promise<[CaseInformation]|[DailyReport]>}
     */
  async get(size=this.getSize()) {
    await this.assureCSIsLoaded();
    return this.CSVDatabaseArray.slice(0, await size);
  }

  /**
   * @return {int} length of the CaseInformations array
   */
  async getSize() {
    await this.assureCSIsLoaded();
    return this.CSVDatabaseArray.length;
  }

  /**
   * @param {String} field
   * @return {Promise<[CaseInformation]>}
   */
  async sort(field) {
    const cs = await this.get();
    return cs.sort(this.getSortOrder(field));
  }

  /**
   * @param {String} property Property of Case Information
   * @return {Function}
   */
  getSortOrder(property) {
    return function(a, b) {
      if (a[property] > b[property]) {
        return 1;
      } else if (a[property] < b[property]) {
        return -1;
      }
      return 0;
    };
  }

  /**
   * @param {[CaseInformation]} csArr
   * @param {String} caseCode
   * @return {int} position of the case code in the array
   */
  findIndex(csArr, caseCode) {
    return csArr.findIndex((cs) => cs.CaseCode == caseCode);
  }
}

module.exports = CSVDatabase;
