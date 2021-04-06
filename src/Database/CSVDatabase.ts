/* eslint-disable eqeqeq */
/* eslint-disable max-len,new-cap */
/* eslint-disable require-jsdoc */
import csv from 'csvtojson';
import path from 'path';
import fs from 'fs';
import CaseInformation from '../CaseInformation';
import FacilityInformation from '../FacilityInformation';
import { filterLatestFacilityData } from '../utils/helper';

class CSVDatabase {
  isConverting!: boolean;

  csvClass: CaseInformation|FacilityInformation|unknown;

  CSVDatabaseArray!: (CaseInformation|FacilityInformation)[];

  csvFilePath!: string;

  converter: any;

  async init(CsvClass: CaseInformation|FacilityInformation) {
    this.isConverting = false;
    this.csvClass = CsvClass;
    this.CSVDatabaseArray = [];

    // resolve webpack path issues
    let tmpPath = '../../tmp';
    if (process.env.NODE_ENV === 'production') tmpPath = '../tmp';

    if (this.csvClass instanceof CaseInformation) {
      this.csvFilePath = path.join(__dirname, `${tmpPath}/${CaseInformation.getFilename()}`);
    } else if (this.csvClass instanceof FacilityInformation) {
      this.csvFilePath = path.join(__dirname, `${tmpPath}/${FacilityInformation.getFilename()}`);
    } else {
      throw Error('CSVDatabase type not found');
    }

    await this.convertCsvToJson();
    return this;
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
  async convertCsvToJson() {
    if (!this.isConverting) { // prevent multiple attempts to convert the json
      this.isConverting = true;
      const pathToCSV = this.csvFilePath;
      let dateThreshold: Date|number = new Date();
      dateThreshold = dateThreshold.setDate(dateThreshold.getDate() - (parseInt(process.env.FACILITIES_THRESHOLD as string, 10) || 360));

      let msg = process.env.FACILITIES_THRESHOLD || 'facilities threshold not found in .env, setting to 360';
      msg += '\nIf this causes Out of memory error lower the value to 7 or 30';
      console.log('Facilities Threshold: ', msg);

      const isFacilityInfo = (this.csvClass instanceof FacilityInformation);
      const isCaseInfo = (this.csvClass instanceof CaseInformation);
      const updatedDateIndex = 3;

      if (fs.existsSync(pathToCSV)) {
        // Invoking csv returns a promise
        this.converter = csv({
          trim: true,
        })
          .fromFile(pathToCSV)
          .preFileLine(async (fileLineString: string) => {
            if (isFacilityInfo) {
              const newFileLineString = (fileLineString).split(',');
              // console.log(fileLineString[3] + '\n');
              const upDate = new Date(newFileLineString[updatedDateIndex]);
              if (upDate < (dateThreshold)) return ('');
              return (newFileLineString.join(','));
            }

            if (isCaseInfo) {
              return (fileLineString);
            }
            throw Error('Cannot determine csv data type while parsing csv file.');
          })
          .then((json) => {
            json.forEach((row) => {
              let c;
              // eslint-disable-next-line new-cap
              if (this.csvClass instanceof FacilityInformation) {
                c = new FacilityInformation();
                // filter out empty updateddate
                if (row.updateddate !== '') {
                  Object.assign(c, row);
                  this.CSVDatabaseArray.push(c);
                }
              } else if (this.csvClass instanceof CaseInformation) {
                c = new CaseInformation();
                Object.assign(c, row);
                this.CSVDatabaseArray.push(c);
              } else {
                throw Error('Cannot determine csv type for updateddate');
              }
            });
          })
          .then(() => {
            if (this.CSVDatabaseArray[0] instanceof CaseInformation) {
              console.log('CaseInformation CSV loaded');
              return true;
            } if (this.CSVDatabaseArray[0] instanceof FacilityInformation) {
              console.log('FacilityInformation CSV loaded');
              console.log('Grouping results by latest updateddate...');
              this.CSVDatabaseArray = filterLatestFacilityData(this.CSVDatabaseArray);
              console.log('Grouping done!');
              return true;
            }
            throw Error('[CSVDatabase.js]Cannot determine csv data type.');
          }, (err) => console.log(err));

        return this.converter;
      }
      this.isConverting = false;
      console.error(`Cannot find ${this.csvFilePath}, Did you visit "/api/updateDatabase"?`);
    }

    return null;
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
  async filter(field: string, value: string) {
    await this.assureCSIsLoaded();
    // eslint-disable-next-line eqeqeq
    return this.CSVDatabaseArray.filter((ci) => ci[field] == value);
  }

  /**
     *
     * @param {int} size Max number of entries to return
     * @return {Promise<[CaseInformation]|[FacilityInformation]>}
     */
  async get(size = this.getSize()) {
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
  async sort(field: string) {
    const cs = await this.get();
    return cs.sort(this.getSortOrder(field));
  }

  /**
   * @param {String} property Property of Case Information
   * @return {Function}
   */
  getSortOrder = (property: string) => (a: any, b: any) => {
    if (a[property] > b[property]) {
      return 1;
    } if (a[property] < b[property]) {
      return -1;
    }
    return 0;
  };

  /**
   * @param {[CaseInformation]} csArr
   * @param {String} caseCode
   * @return {int} position of the case code in the array
   */
  findIndex = (csArr: CaseInformation[], caseCode: string) => csArr.findIndex((cs) => cs.CaseCode == caseCode)
}

export default CSVDatabase;
