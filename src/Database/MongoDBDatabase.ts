/* eslint-disable require-jsdoc */
import mongoose, { Mongoose } from 'mongoose';
import { getCSVInfoObj } from '../utils/helper';

import CaseInformation from '../CaseInformation';
import FacilityInformation from '../FacilityInformation';
import CSVDatabase from './CSVDatabase';
import { CaseInformationModel, FacilityInformationModel, UpdateHistoryModel } from './Models';
import { DB_NAMES } from '../utils/enums';

class MongoDBDatabase {
  static instance: MongoDBDatabase;

  connection!: Mongoose;

  constructor() {
    if (!MongoDBDatabase.instance) {
      MongoDBDatabase.instance = this;
    }

    return MongoDBDatabase.instance;
  }

  /**
   * @return {Promise<string>}
   */
  async connect() {
    if (!this.connection) {
      const dbUrl: string = process.env.DB_NOSQL_URI as string;
      this.connection = await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    return 'Successfully connected to the Mongo Database';
  }

  /**
   * @param {Object} queries
   * @param {String} queries.month
   * @param {String} queries.day
   * @param {int} queries.page
   * @param {int} queries.limit
   * @param {int} queries.maxLimit
   * @param {Object|undefined} queries.filters
   * @return {Promise<*>} returns JSON of the result
   */
  get = async (queries: any) => {
    if (queries.month > 12) throw Error('Error: the month cannot be greater than 12');
    if (queries.day > 31) throw Error('Error: the day cannot be greater than 31');
    if (queries.page < 1 || queries.limit < 1) throw Error('Error: page or limit query can\'t be less than 1.');
    if (queries.limit > queries.maxLimit) throw Error(`Error: limit query can't be greater than ${queries.maxLimit}.`);

    let filter: any = {};

    const opt = {
      limit: queries.limit,
      skip: (queries.page - 1) * queries.limit,
    };

    const sortOpt = {
      case_code: 1,
    };

    if (queries.month && !queries.day) {
      const date = { $regex: `2020-${queries.month}.*`, $options: 'i' };
      filter = {
        $or: [
          {
            $and: [
              { date_specimen: date },
              { date_onset: '' },
            ],
          },
          { date_onset: date },
        ],
      };
    } else if (queries.month && queries.day) {
      const date = `2020-${queries.month}-${queries.day}`;
      filter = {
        $or: [
          {
            $and: [
              { date_specimen: date },
              { date_onset: '' },
            ],
          },
          { date_onset: date },
        ],
      };
    }

    // add filters
    if (queries.filters) {
      Object.keys(queries.filters).forEach((key) => {
        let newFilter = queries.filters[key];
        if (!Number.isNaN(newFilter)) newFilter = Number(newFilter);
        filter[key] = newFilter || '';
      });
    }

    return CaseInformationModel
      .find(filter, '-_id')
      .limit(opt.limit)
      .skip(opt.skip)
      .sort(sortOpt)
      .exec();
  }

  // @TODO @Doggo merge getLatestFolderID and getLastUpdateDate to one function
  /**
   *
   * @return {Promise<String>}
   */
  getLatestFolderID = async () => {
    const res = await UpdateHistoryModel.find({}, { limit: 1 }).sort({ _id: -1 }).exec();

    if (res.length === 0) {
      return '';
    }

    return res[0].folder_id || '';
  }

  /**
   *
   * @return {Promise<String>}
   */
  getLastUpdateDate = async () => {
    const res = await UpdateHistoryModel.find({}, { limit: 1 }).sort({ _id: -1 }).exec();

    if (res.length === 0) return '';

    // eslint-disable-next-line no-underscore-dangle
    return new Date(res[0]._id.getTimestamp()).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
    }) || '';
  }

  /**
   * @param {DB_NAMES} dbName database name
   * @param {Object} objFilters contains the field and value
   * @return {Promise} contains the result of the query
   */
  // eslint-disable-next-line arrow-body-style
  count = async (dbName: DB_NAMES, objFilters: any = null): Promise<number> => {
    const tempObj: any = {};

    if (objFilters !== null) {
      const { field } = objFilters;
      const { value } = objFilters;
      tempObj[field] = value;
    }

    switch (dbName) {
      case DB_NAMES.CASE_INFORMATION:
        return CaseInformationModel.countDocuments(tempObj);
      case DB_NAMES.FACILITY_INFORMATION:
        return FacilityInformationModel.countDocuments(tempObj);
      case DB_NAMES.UPDATE_HISTORY:
        return UpdateHistoryModel.countDocuments(tempObj);
      default:
        throw Error('Invalid DB_NAME');
    }
    /* let collection = mongoose.connection.db.collection(dbName);

    if (objFilters !== null) {
      const { field } = objFilters;
      const { value } = objFilters;
      const tempObj: any = {};
      tempObj[field] = value;
      collection = collection.find(tempObj);

      return collection.toArray((err, docs) => {
        if (err) throw Error(err.message);
        return docs.length;
      });
    }

    const data = await collection.countDocuments();
    return data; */
  }

  /**
   * @deprecated
   * @param {String} field
   * @param {String|Number} value
   * @return {Promise} Contains JSON
   */
  filter = async (field: string, value: string|number) => {
    const filter:any = {};
    const opts = {
      projection: { _id: 0 },
    };
    filter[field] = value;

    return CaseInformationModel.find(filter, opts);
  }

  /**
   * @param {String} region
   * @return {Promise<Object>} result
   * @return {Promise<Object>} result.data
   * @return {Promise<Object>} result.fatalityRate
   * @return {Promise<Object>} result.recoveryRate
   */
  getSummary = async (region: string|null = null) => {
    const totalFilter = {};
    const recoveriesFilter = { removal_type: 'recovered' };
    const diedFilter = { removal_type: 'died' };
    const activeCasesFilter = { removal_type: '', date_rep_conf: { $exists: true } };
    const filters: Array<{[key: string]: any}> = [
      totalFilter, recoveriesFilter, diedFilter, activeCasesFilter,
    ];

    if (region !== null) {
      filters.forEach((filter) => {
        // eslint-disable-next-line no-param-reassign
        filter.region_res = region;
      });
    }

    const res = await CaseInformationModel.aggregate([
      {
        $lookup:
          {
            from: DB_NAMES.CASE_INFORMATION.toString(),
            pipeline: [
              { $match: totalFilter },
              { $group: { _id: '$case_informations', count: { $sum: 1 } } },
              { $project: { _id: 0 } },
            ],
            as: 'total',
          },
      },
      {
        $lookup:
          {
            from: DB_NAMES.CASE_INFORMATION.toString(),
            pipeline: [
              { $match: recoveriesFilter },
              { $group: { _id: '$removal_type', count: { $sum: 1 } } },
              { $project: { _id: 0 } },
            ],
            as: 'recoveries',
          },
      },
      {
        $lookup:
          {
            from: DB_NAMES.CASE_INFORMATION.toString(),
            pipeline: [
              { $match: diedFilter },
              { $group: { _id: '$removal_type', count: { $sum: 1 } } },
              { $project: { _id: 0 } },
            ],
            as: 'deaths',
          },
      },
      {
        $lookup:
          {
            from: DB_NAMES.CASE_INFORMATION.toString(),
            pipeline: [
              { $match: activeCasesFilter },
              { $group: { _id: '$case_informations', count: { $sum: 1 } } },
              { $project: { _id: 0 } },
            ],
            as: 'active_cases',
          },
      },
      {
        $project: {
          _id: 0, recoveries: 1, deaths: 1, total: 1, active_cases: 1,
        },
      },
    ]).limit(1);

    res[0].total = res[0].total[0].count;
    res[0].recoveries = res[0].recoveries[0].count;
    res[0].deaths = res[0].deaths[0].count;
    res[0].active_cases = res[0].active_cases[0].count;

    let fatalityRate: number|string = res[0].deaths / res[0].total;
    let recoveryRate: number|string = res[0].recoveries / res[0].total;
    fatalityRate = (fatalityRate * 100).toFixed(2);
    recoveryRate = (recoveryRate * 100).toFixed(2);

    return {
      result: res[0],
      fatalityRate,
      recoveryRate,
    };
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getTimeline = async (queries: {[key: string]: string}) => {
    const filter: {[key: string]: any} = {};
    // accept either region or region_res
    if (queries.region) filter.region_res = queries.region.toLowerCase();
    else if (queries.region_res) filter.region_res = queries.region_res.toLowerCase();

    return CaseInformationModel.aggregate([
      { $match: filter },
      { $match: { $or: [{ date_onset: { $ne: '' } }, { date_specimen: { $ne: '' } }] } },
      {
        $group: {
          _id: {
            date: {
              $cond: {
                if: { $eq: ['$date_onset', ''] }, then: '$date_specimen', else: '$date_onset',
              },
            },
          },
          cases: { $sum: 1 },
          recovered: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$removal_type', 'recovered'] },
                    then: 1,
                  },
                ],
                default: 0,
              },
            },
          },
          died: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$removal_type', 'died'] },
                    then: 1,
                  },
                ],
                default: 0,
              },
            },
          },
        },
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          _id: 0, date: '$_id.date', cases: 1, recovered: 1, died: 1,
        },
      },
    ]);
  }

  /**
   * @return {Promise}
   */
  getTopRegions = async () => CaseInformationModel.aggregate([
    { $match: { region_res: { $ne: '' } } },
    {
      $group: {
        _id: '$region_res',
        cases: { $sum: 1 },
        recovered: {
          $sum: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$removal_type', 'recovered'] },
                  then: 1,
                },
              ],
              default: 0,
            },
          },
        },
        deaths: {
          $sum: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$removal_type', 'died'] },
                  then: 1,
                },
              ],
              default: 0,
            },
          },
        },
      },
    },
    { $sort: { cases: -1 } },
    {
      $project: {
        _id: 0, region: '$_id', cases: '$cases', recovered: '$recovered', deaths: '$deaths',
      },
    },
  ])

  // FACILITIES

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilities = async (queries: {[key: string]: any}) => {
    Object.keys(queries).forEach((key) => {
      if (!Number.isNaN(queries[key])) {
        // eslint-disable-next-line no-param-reassign
        queries[key] = Number(queries[key]);
      }
    });

    const filter = queries;
    const opt = {
      projection: { _id: 0 },
    };

    return FacilityInformationModel.find(filter, opt).sort({ cf_name: 1 });
  }

  /**
   * @param {Object} queries
   * @return {Promise}
   */
  getFacilitiesSummary = async (queries: {[key: string]: any}) => {
    const filter: {[key: string]: any} = {};
    const output: {[key: string]: any} = {};

    if (queries.region) filter.region = queries.region.toLowerCase();
    if (queries.hospital_name) {
      output.hospital_name = '$_id';
      filter.cf_name = queries.hospital_name.toLowerCase();
    }

    // Copy the default output after adding hospital name if needed
    Object.assign(output, {
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
        // for covid patients
        covid: {
          icu_v: '$icu_v',
          icu_o: '$icu_o',
          isolbed_v: '$isolbed_v',
          isolbed_o: '$isolbed_o',
          beds_ward_v: '$beds_ward_v',
          beds_ward_o: '$beds_ward_o',
        },

        // for non-covid patients
        non_covid: {
          icu_v_nc: '$icu_v_nc',
          icu_o_nc: '$icu_o_nc',
          nonicu_v_nc: '$nonicu_v_nc',
          nonicu_o_nc: '$nonicu_o_nc',
        },
      },
      equipments: {
        mechvent_v: '$mechvent_v',
        mechvent_o: '$mechvent_o',
        mechvent_v_nc: '$mechvent_v_nc',
        mechvent_o_nc: '$mechvent_v_nc',
      },
    });

    const res = await FacilityInformationModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: (queries.hospital_name ? '$cf_name' : null),
          total_facilities: { $sum: 1 },
          icu_v: { $sum: '$icu_v' },
          icu_o: { $sum: '$icu_o' },
          isolbed_v: { $sum: '$isolbed_v' },
          isolbed_o: { $sum: '$isolbed_o' },
          beds_ward_v: { $sum: '$beds_ward_v' },
          beds_ward_o: { $sum: '$beds_ward_o' },
          mechvent_v: { $sum: '$mechvent_v' },
          mechvent_o: { $sum: '$mechvent_o' },

          // for non-covid patients
          icu_v_nc: { $sum: '$icu_v_nc' },
          icu_o_nc: { $sum: '$icu_o_nc' },
          nonicu_v_nc: { $sum: '$nonicu_v_nc' },
          nonicu_o_nc: { $sum: '$nonicu_o_nc' },
          mechvent_v_nc: { $sum: '$mechvent_v_nc' },
          mechvent_o_nc: { $sum: '$mechvent_v_nc' },
        },
      },
      { $project: output },
    ]);

    if (res[0] === undefined) throw Error('Your query didn\'t match any records.');

    const vacantAndOccupied = res[0].beds.total_occupied + res[0].beds.total_vacant;
    res[0].occupancy_rate = res[0].beds.total_occupied / vacantAndOccupied;
    res[0].occupancy_rate = parseFloat(res[0].occupancy_rate.toFixed(2)) || 0;

    return res[0];
  }

  // ./FACILITIES

  /**
   * @param {String} field
   * @param {String} dataset
   * @return {Promise}
   */
  getListOf = async (field: string, dataset: string) => {
    let collection: typeof CaseInformationModel|typeof FacilityInformationModel;

    switch (dataset.toLowerCase()) {
      case DB_NAMES.CASE_INFORMATION.toString():
        collection = CaseInformationModel;

        switch (field.toLowerCase()) {
          case 'regions':
            // eslint-disable-next-line no-param-reassign
            field = 'region_res';
            break;
          case 'provinces':
            // eslint-disable-next-line no-param-reassign
            field = 'prov_res';
            break;
          case 'cities':
            // eslint-disable-next-line no-param-reassign
            field = 'city_mun_res';
            break;
          case 'removal_types':
            // eslint-disable-next-line no-param-reassign
            field = 'removal_type';
            break;
          case 'age_groups':
            // eslint-disable-next-line no-param-reassign
            field = 'age_group';
            break;
        }
        break;

      case 'facilities_information':
        collection = FacilityInformationModel;

        switch (field.toLowerCase()) {
          case 'regions':
            // eslint-disable-next-line no-param-reassign
            field = 'region';
            break;
          case 'provinces':
            // eslint-disable-next-line no-param-reassign
            field = 'province';
            break;
          case 'cities':
            // eslint-disable-next-line no-param-reassign
            field = 'city_mun';
            break;
          case 'hospitals':
            // eslint-disable-next-line no-param-reassign
            field = 'cf_name';
            break;
        }

        break;

      default:
        throw Error(`Invalid dataset: ${dataset}`);
    }

    const project: {[key: string]: any} = {};
    project[field.toLowerCase()] = 1;

    const output: {[key: string]: any} = { _id: 0 };

    // @TODO @DOGGO Make a separate function for this
    // ALIASES FOR JSON RESPONSE
    switch (field.toLowerCase()) {
      case 'cf_name':
        output.name = '$_id';
        break;
      case 'city_mun':
      case 'city_mun_res':
        output.city = '$_id';
        break;
      case 'region_res':
        output.region = '$_id';
        break;
      case 'prov_res':
        output.province = '$_id';
        break;
      default:
        output[field.toLowerCase()] = '$_id';
    }

    console.log(field);
    return collection.aggregate([
      { $project: project },
      {
        $group: {
          _id: `$${field.toLowerCase()}`,
        },
      },
      { $sort: { _id: 1 } },
      { $project: output },
    ]);
  }

  /**
   * Truncates Database table
   * @param {String} collectionName
   * @return {Promise<void>}
   */
  truncate = async (collectionName: string) => {
    const collections = (await mongoose.connection.db.listCollections().toArray())
      .map((collection) => collection.name);

    if (collections.indexOf(collectionName) !== -1) {
      await mongoose.connection.db.dropCollection(collectionName);
    }

    console.log('Tables Dropped.');
  }

  /**
   * @param {String} tableName
   * @param {Object} fieldValueObj
   * @return {Promise<String>}
   */
  insert = async (tableName: string, fieldValueObj: {[key: string]: any}) => UpdateHistoryModel
    .create(fieldValueObj)

  /**
   * End Database connection
   */
  endConnection = async () => {
    await mongoose.connection.close();
  }

  // @TODO @DOGGO This function violates open/closed principle for now
  /**
   * @param {CaseInformation[]|FacilityInformation[]} csArr
   * @param {int} batchSize
   * @return {Promise<boolean>}
   */
  batchInsertDatabaseFromCSV = async (csArr: (CaseInformation|FacilityInformation)[],
    batchSize = 10000) => {
    console.log(`\nPerforming batch insert (batch size: ${batchSize}):`);
    const isSuccess = true;
    let lastRowIndex = 0;
    const csArrLength = csArr.length;
    const batchRuns = Math.ceil(csArr.length / batchSize);
    for (let i = 0; i < batchRuns; i += 1) {
      console.log(`Running batch ${i + 1}/${batchRuns}`);
      const nextLastRowIndex = lastRowIndex + batchSize;

      const sliceStart = lastRowIndex;
      const sliceEnd = (nextLastRowIndex >= csArr.length ? csArrLength : nextLastRowIndex);

      const csBatchArr = csArr.slice(sliceStart, sliceEnd);
      lastRowIndex = nextLastRowIndex;

      const csvInfo = getCSVInfoObj(csBatchArr);

      // eslint-disable-next-line no-await-in-loop
      await mongoose.connection.db.collection(csvInfo.csvDbName)
        .insertMany(csvInfo.csvArr, { forceServerObjectId: true });

      console.log(`Inserted: ${csvInfo.csvArr.length} rows`);
    }

    return isSuccess;
  }

  /**
   * Update database form csv
   * @param {CSVDatabase} csvDatabase
   * @return {Promise<boolean>}
   */
  async updateDatabaseFromCSV(csvDatabase: CSVDatabase, dbName: DB_NAMES) {
    console.log('\nBegin Updating Database.');

    const cs = await csvDatabase.get();

    console.log(`Truncating ${dbName} table, because it causes anomaly when we don't.`);
    await this.truncate(dbName);

    console.log('\nBefore Updating Database: ');
    console.log(`cs length in csv: ${cs.length}`);
    console.log(`cs length in database: ${await this.count(dbName)}`);
    const res = await this.batchInsertDatabaseFromCSV(cs, 25000);
    console.log('\nAfter Updating Database: ');
    console.log(`cs length in csv: ${cs.length}`);
    console.log(`cs length in database: ${await this.count(dbName)}`);

    if (res) console.log('\nSuccessfully transferred data from CSV to Database.\n');
    else console.log('\nFailed to transfer data from CSV to Database.\n');

    return res;
  }
}

export default MongoDBDatabase;
