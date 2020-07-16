const csv = require('csvtojson');
const caseInformation = require('./CaseInformation');

const CaseInformation = caseInformation.CaseInformation;


class CSVDatabase {
    CaseInformations = [];

    // make this a singleton
    constructor() {
        if (!CSVDatabase.instance) {
            CSVDatabase.instance = this;
            this.convertCsvToJson();
        }

        return CSVDatabase.instance;
    }

    convertCsvToJson() {
        // Invoking csv returns a promise
        return this.converter = csv()
            .fromFile('./tmp/Data.csv')
            .then((json) => {
                let c;
                json.forEach((row) => {
                    c = new CaseInformation();
                    Object.assign(c, row);
                    this.CaseInformations.push(c);
                });
            });
    }

    // /**
    //  * @param {int} age specific int to filter results by age
    //  * @return {CaseInformations} contains the filtered object
    //  */
    // async filterByAge(age) {
    //     await this.converter;
    //     return this.CaseInformations.filter(ci => ci.Age == age);
    // }

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
    // async filterByAgeGroup(ageGroup) {
    //     await this.converter;
    //     return this.CaseInformations.filter(ci => ci.AgeGroup == ageGroup);
    // }

    /**
     * An all purpose filter instead of having a filter function for every field
     * @param {*} field 
     * @param {*} value 
     */
    async filter(field, value) {
        await this.converter;
        return this.CaseInformations.filter(ci => ci[field] == value);
    }

    /**
     * 
     * @param {int} size Max number of entries to return
     * @return {CaseInformation} 
     */
    async all(size=this.CaseInformations.length) {
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