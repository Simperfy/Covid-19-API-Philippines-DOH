"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc,max-len */
var mongodb_1 = __importDefault(require("mongodb"));
var helper_1 = require("../utils/helper");
var CaseInformation_1 = __importDefault(require("../CaseInformation"));
var FacilityInformation_1 = __importDefault(require("../FacilityInformation"));
var MongoDBDatabase = /** @class */ (function () {
    function MongoDBDatabase() {
        if (!MongoDBDatabase.instance) {
            MongoDBDatabase.instance = this;
            // this.connection = MongoDB.MongoClient;
        }
        return MongoDBDatabase.instance;
    }
    /**
     * @return {Promise<*>}
     */
    MongoDBDatabase.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var dbUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbUrl = process.env.DB_NOSQL_URI;
                        if (!this.connection) {
                            try {
                                this.connection = mongodb_1.default.MongoClient.connect(dbUrl, {
                                    useNewUrlParser: true,
                                    useUnifiedTopology: true,
                                });
                            }
                            catch (err) {
                                return [2 /*return*/, reject(new Error('[MongoDBDatabase] ' + err))];
                            }
                        }
                        return [4 /*yield*/, this.connection];
                    case 1:
                        if ((_a.sent()) === undefined)
                            return [2 /*return*/, reject(new Error('[MongoDBDatabase] ' + 'Failed to connect.'))];
                        resolve('Successfully connected to the Mongo Database');
                        return [2 /*return*/];
                }
            });
        }); });
    };
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
    MongoDBDatabase.prototype.get = function (queries) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (queries.month > 12)
                return reject(new Error('Error: the month cannot be greater than 12'));
            if (queries.day > 31)
                return reject(new Error('Error: the day cannot be greater than 31'));
            if (queries.page < 1 || queries.limit < 1)
                return reject(new Error('Error: page or limit query can\'t be less than 1.'));
            if (queries.limit > queries.maxLimit)
                return reject(new Error("Error: limit query can't be greater than " + queries.maxLimit + "."));
            _this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                var db, collection, filter, opt, sortOpt, date, date, _i, _a, key, result, _b, e_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            db = client.db();
                            collection = db.collection('case_informations');
                            filter = {};
                            opt = {
                                limit: queries.limit,
                                skip: (queries.page - 1) * queries.limit,
                                projection: { '_id': 0 },
                            };
                            sortOpt = {
                                case_code: 1,
                            };
                            if (queries.month && !queries.day) {
                                date = '/2020-' + queries.month + '.*/';
                                filter = {
                                    $or: [
                                        { $and: [
                                                { date_specimen: date },
                                                { date_onset: '' },
                                            ] },
                                        { date_onset: date },
                                    ],
                                };
                            }
                            else if (queries.month && queries.day) {
                                date = '2020-' + queries.month + '-' + queries.day;
                                filter = {
                                    $or: [
                                        { $and: [
                                                { date_specimen: date },
                                                { date_onset: '' },
                                            ] },
                                        { date_onset: date },
                                    ],
                                };
                            }
                            // add filters
                            if (queries.filters) {
                                console.log(queries.filters);
                                for (_i = 0, _a = Object.keys(queries.filters); _i < _a.length; _i++) {
                                    key = _a[_i];
                                    if (!isNaN(queries.filters[key]))
                                        queries.filters[key] = Number(queries.filters[key]);
                                    filter[key] = queries.filters[key] || '';
                                }
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, collection.find(filter, opt).sort(sortOpt)];
                        case 2:
                            result = _c.sent();
                            _b = resolve;
                            return [4 /*yield*/, result.toArray()];
                        case 3:
                            _b.apply(void 0, [_c.sent()]);
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _c.sent();
                            reject(new Error(e_1));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    // @TODO @Doggo merge getLatestFolderID and getLastUpdateDate to one function
    /**
     *
     * @return {Promise<String>}
     */
    MongoDBDatabase.prototype.getLatestFolderID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, result, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('update_history');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.find({}, { limit: 1 }).sort({ _id: -1 })];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_2 = _a.sent();
                                        return [2 /*return*/, (new Error(e_2))];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        if (res.length === 0) {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/, res[0].folder_id || ''];
                }
            });
        });
    };
    /**
     *
     * @return {Promise<String>}
     */
    MongoDBDatabase.prototype.getLastUpdateDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = [];
                        return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                                var db, collection, result, e_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            db = client.db();
                                            collection = db.collection('update_history');
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, collection.find({}, { limit: 1 }).sort({ _id: -1 })];
                                        case 2:
                                            result = _a.sent();
                                            return [4 /*yield*/, result.toArray()];
                                        case 3:
                                            res = _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            e_3 = _a.sent();
                                            return [2 /*return*/, (new Error(e_3))];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        if (res.length === 0) {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/, new Date(res[0]._id.getTimestamp()).toLocaleString('en-US', {
                                timeZone: 'Asia/Shanghai',
                            }) || ''];
                }
            });
        });
    };
    /**
     * @param {String} dbName database name
     * @param {Object} objFilters contains the field and value
     * @return {Promise} contains the result of the query
     */
    MongoDBDatabase.prototype.count = function (dbName, objFilters) {
        if (objFilters === void 0) { objFilters = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // console.log(this.connection);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.connection.then(function (client) {
                            var db = client.db();
                            var collection = db.collection(dbName);
                            if (objFilters !== null) {
                                var field = objFilters.field;
                                var value = objFilters.value;
                                var tempObj = {};
                                tempObj[field] = value;
                                collection = collection.find(tempObj);
                                return collection.toArray(function (err, docs) {
                                    if (err)
                                        reject(new Error(err.message));
                                    resolve(docs.length);
                                });
                            }
                            return collection.countDocuments().then(function (data) {
                                resolve(data);
                                // client.close();
                            }).catch(function (err) { return reject(new Error(err)); });
                        });
                    })];
            });
        });
    };
    /**
     * @deprecated
     * @param {String} field
     * @param {String|Number} value
     * @return {Promise} Contains JSON
     */
    MongoDBDatabase.prototype.filter = function (field, value) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, filter, opts, result, _a, e_4;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('case_informations');
                                        filter = {};
                                        opts = {
                                            projection: { _id: 0 },
                                        };
                                        filter[field] = value;
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.find(filter, opts)];
                                    case 2:
                                        result = _b.sent();
                                        _a = resolve;
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        _a.apply(void 0, [_b.sent()]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_4 = _b.sent();
                                        reject(new Error(e_4));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @param {String} region
     * @return {Promise<Object>} result
     * @return {Promise<Object>} result.data
     * @return {Promise<Object>} result.fatalityRate
     * @return {Promise<Object>} result.recoveryRate
     */
    MongoDBDatabase.prototype.getSummary = function (region) {
        var _this = this;
        if (region === void 0) { region = null; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, totalFilter, recoveriesFilter, diedFilter, activeCasesFilter, filters, result, res, fatalityRate, recoveryRate, e_5;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('case_informations');
                                        totalFilter = {};
                                        recoveriesFilter = { removal_type: 'recovered' };
                                        diedFilter = { removal_type: 'died' };
                                        activeCasesFilter = { removal_type: '', date_rep_conf: { $exists: true } };
                                        filters = [totalFilter, recoveriesFilter, diedFilter, activeCasesFilter];
                                        if (region !== null) {
                                            filters.forEach(function (filter) {
                                                filter.region_res = region;
                                            });
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.aggregate([
                                                { $lookup: {
                                                        from: 'case_informations',
                                                        pipeline: [
                                                            { $match: totalFilter },
                                                            { $group: { _id: '$case_informations', count: { $sum: 1 } } },
                                                            { $project: { '_id': 0 } },
                                                        ],
                                                        as: 'total',
                                                    },
                                                },
                                                { $lookup: {
                                                        from: 'case_informations',
                                                        pipeline: [
                                                            { $match: recoveriesFilter },
                                                            { $group: { _id: '$removal_type', count: { $sum: 1 } } },
                                                            { $project: { '_id': 0 } },
                                                        ],
                                                        as: 'recoveries',
                                                    },
                                                },
                                                { $lookup: {
                                                        from: 'case_informations',
                                                        pipeline: [
                                                            { $match: diedFilter },
                                                            { $group: { _id: '$removal_type', count: { $sum: 1 } } },
                                                            { $project: { '_id': 0 } },
                                                        ],
                                                        as: 'deaths',
                                                    },
                                                },
                                                { $lookup: {
                                                        from: 'case_informations',
                                                        pipeline: [
                                                            { $match: activeCasesFilter },
                                                            { $group: { _id: '$case_informations', count: { $sum: 1 } } },
                                                            { $project: { '_id': 0 } },
                                                        ],
                                                        as: 'active_cases',
                                                    },
                                                },
                                                { $project: { '_id': 0, 'recoveries': 1, 'deaths': 1, 'total': 1, 'active_cases': 1 } },
                                            ]).limit(1)];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        res[0].total = res[0].total[0].count;
                                        res[0].recoveries = res[0].recoveries[0].count;
                                        res[0].deaths = res[0].deaths[0].count;
                                        res[0].active_cases = res[0].active_cases[0].count;
                                        fatalityRate = res[0].deaths / res[0].total;
                                        recoveryRate = res[0].recoveries / res[0].total;
                                        fatalityRate = (fatalityRate * 100).toFixed(2);
                                        recoveryRate = (recoveryRate * 100).toFixed(2);
                                        resolve({
                                            'result': res[0],
                                            'fatalityRate': fatalityRate,
                                            'recoveryRate': recoveryRate,
                                        });
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_5 = _a.sent();
                                        reject(new Error(e_5));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    MongoDBDatabase.prototype.getTimeline = function (queries) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, filter, result, res, e_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('case_informations');
                                        filter = {};
                                        // accept either region or region_res
                                        if (queries.region)
                                            filter['region_res'] = queries.region.toLowerCase();
                                        else if (queries.region_res)
                                            filter['region_res'] = queries.region_res.toLowerCase();
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.aggregate([
                                                { $match: filter },
                                                { $match: { $or: [{ 'date_onset': { '$ne': '' } }, { 'date_specimen': { '$ne': '' } }] } },
                                                {
                                                    $group: {
                                                        _id: {
                                                            'date': {
                                                                $cond: {
                                                                    if: { $eq: ['$date_onset', ''] }, then: '$date_specimen', else: '$date_onset',
                                                                },
                                                            },
                                                        },
                                                        cases: { $sum: 1 },
                                                        recovered: {
                                                            $sum: {
                                                                '$switch': {
                                                                    'branches': [
                                                                        {
                                                                            'case': { '$eq': ['$removal_type', 'recovered'] },
                                                                            'then': 1,
                                                                        },
                                                                    ],
                                                                    'default': 0,
                                                                },
                                                            },
                                                        },
                                                        died: {
                                                            $sum: {
                                                                '$switch': {
                                                                    'branches': [
                                                                        {
                                                                            'case': { '$eq': ['$removal_type', 'died'] },
                                                                            'then': 1,
                                                                        },
                                                                    ],
                                                                    'default': 0,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                { $sort: { '_id.date': 1 } },
                                                { $project: { '_id': 0, 'date': '$_id.date', 'cases': 1, 'recovered': 1, 'died': 1 } },
                                            ])];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        resolve(res);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_6 = _a.sent();
                                        reject(new Error(e_6));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @return {Promise}
     */
    MongoDBDatabase.prototype.getTopRegions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, result, res, e_7;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('case_informations');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.aggregate([
                                                { $match: { 'region_res': { '$ne': '' } } },
                                                {
                                                    $group: {
                                                        _id: '$region_res',
                                                        cases: { $sum: 1 },
                                                        recovered: {
                                                            $sum: {
                                                                '$switch': {
                                                                    'branches': [
                                                                        {
                                                                            'case': { '$eq': ['$removal_type', 'recovered'] },
                                                                            'then': 1,
                                                                        },
                                                                    ],
                                                                    'default': 0,
                                                                },
                                                            },
                                                        },
                                                        deaths: {
                                                            $sum: {
                                                                '$switch': {
                                                                    'branches': [
                                                                        {
                                                                            'case': { '$eq': ['$removal_type', 'died'] },
                                                                            'then': 1,
                                                                        },
                                                                    ],
                                                                    'default': 0,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                                { $sort: { 'cases': -1 } },
                                                { $project: { '_id': 0, 'region': '$_id', 'cases': '$cases', 'recovered': '$recovered', 'deaths': '$deaths' } },
                                            ])];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        resolve(res);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_7 = _a.sent();
                                        reject(new Error(e_7));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // FACILITIES
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    MongoDBDatabase.prototype.getFacilities = function (queries) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, _i, _a, key, filter, opt, result, res, e_8;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('facility_informations');
                                        for (_i = 0, _a = Object.keys(queries); _i < _a.length; _i++) {
                                            key = _a[_i];
                                            if (!isNaN(queries[key])) {
                                                queries[key] = Number(queries[key]);
                                            }
                                        }
                                        filter = queries;
                                        opt = {
                                            projection: { _id: 0 },
                                        };
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.find(filter, opt).sort({ 'cf_name': 1 })];
                                    case 2:
                                        result = _b.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _b.sent();
                                        resolve(res);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_8 = _b.sent();
                                        reject(new Error(e_8));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    MongoDBDatabase.prototype.getFacilitiesSummary = function (queries) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, filter, output, result, res, e_9;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('facility_informations');
                                        filter = {};
                                        output = {};
                                        if (queries.region)
                                            filter['region'] = queries.region.toLowerCase();
                                        if (queries.hospital_name) {
                                            output['hospital_name'] = '$_id';
                                            filter['cf_name'] = queries.hospital_name.toLowerCase();
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
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.aggregate([
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
                                            ])];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        if (res[0] === undefined)
                                            return [2 /*return*/, reject(new Error('Your query didn\'t match any records.'))];
                                        res[0].occupancy_rate = res[0].beds.total_occupied / (res[0].beds.total_occupied + res[0].beds.total_vacant);
                                        res[0].occupancy_rate = parseFloat(res[0].occupancy_rate.toFixed(2)) || 0;
                                        resolve(res[0]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_9 = _a.sent();
                                        reject(new Error(e_9));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // ./FACILITIES
    /**
     * @param {String} field
     * @param {String} dataset
     * @return {Promise}
     */
    MongoDBDatabase.prototype.getListOf = function (field, dataset) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, project, output, result, res, e_10;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        switch (dataset.toLowerCase()) {
                                            case 'case_information':
                                                collection = db.collection('case_informations');
                                                switch (field.toLowerCase()) {
                                                    case 'regions':
                                                        field = 'region_res';
                                                        break;
                                                    case 'provinces':
                                                        field = 'prov_res';
                                                        break;
                                                    case 'cities':
                                                        field = 'city_mun_res';
                                                        break;
                                                    case 'removal_types':
                                                        field = 'removal_type';
                                                        break;
                                                    case 'age_groups':
                                                        field = 'age_group';
                                                        break;
                                                }
                                                break;
                                            case 'facilities_information':
                                                collection = db.collection('facility_informations');
                                                switch (field.toLowerCase()) {
                                                    case 'regions':
                                                        field = 'region';
                                                        break;
                                                    case 'provinces':
                                                        field = 'province';
                                                        break;
                                                    case 'cities':
                                                        field = 'city_mun';
                                                        break;
                                                    case 'hospitals':
                                                        field = 'cf_name';
                                                        break;
                                                }
                                                break;
                                            default:
                                                return [2 /*return*/, reject(new Error("Invalid dataset: " + dataset))];
                                        }
                                        project = {};
                                        project[field.toLowerCase()] = 1;
                                        output = { _id: 0 };
                                        // @TODO @DOGGO Make a separate function for this
                                        // ALIASES FOR JSON RESPONSE
                                        switch (field.toLowerCase()) {
                                            case 'cf_name':
                                                output['name'] = '$_id';
                                                break;
                                            case 'city_mun':
                                            case 'city_mun_res':
                                                output['city'] = '$_id';
                                                break;
                                            case 'region_res':
                                                output['region'] = '$_id';
                                                break;
                                            case 'prov_res':
                                                output['province'] = '$_id';
                                                break;
                                            default:
                                                output[field.toLowerCase()] = '$_id';
                                        }
                                        console.log(field);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, collection.aggregate([
                                                { $project: project },
                                                {
                                                    $group: {
                                                        _id: "$" + field.toLowerCase(),
                                                    },
                                                },
                                                { $sort: { _id: 1 } },
                                                { $project: output },
                                            ])];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.toArray()];
                                    case 3:
                                        res = _a.sent();
                                        // console.log(res);
                                        resolve(res);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_10 = _a.sent();
                                        reject(new Error(e_10));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Truncates Database table
     * @param {String} tableName
     * @return {Promise<void>}
     */
    MongoDBDatabase.prototype.truncate = function (tableName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var items, _i, items_1, item;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        return [4 /*yield*/, db.listCollections().toArray()];
                                    case 1:
                                        items = _a.sent();
                                        _i = 0, items_1 = items;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < items_1.length)) return [3 /*break*/, 5];
                                        item = items_1[_i];
                                        if (!(item.name === tableName)) return [3 /*break*/, 4];
                                        console.log('Dropping: ' + item.name);
                                        return [4 /*yield*/, db.collection(tableName).drop().then(function (result) {
                                                console.log(result);
                                                resolve(result);
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5:
                                        if (items.length === 0) {
                                            console.log('No collections in database');
                                            resolve('No collections in database');
                                        }
                                        resolve('Table not found');
                                        return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (err) {
                            reject(new Error('[MySQLDatabase.js] ' + err));
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @param {String} tableName
     * @param {Object} fieldValueObj
     * @return {Promise<String>}
     */
    MongoDBDatabase.prototype.insert = function (tableName, fieldValueObj) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var db, collection, e_11;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db = client.db();
                                        collection = db.collection('update_history');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, collection.insertOne(fieldValueObj, { forceServerObjectId: true })];
                                    case 2:
                                        _a.sent();
                                        resolve('Successfully inserted data');
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_11 = _a.sent();
                                        reject(new Error(e_11));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * End Database connection
     */
    MongoDBDatabase.prototype.endConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                client.close();
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // @TODO @DOGGO This function violates open/closed principle for now
    /**
     * @param {CaseInformation[]|FacilityInformation[]} csArr
     * @param {int} batchSize
     * @return {Promise<boolean>}
     */
    MongoDBDatabase.prototype.batchInsertDatabaseFromCSV = function (csArr, batchSize) {
        if (batchSize === void 0) { batchSize = 10000; }
        return __awaiter(this, void 0, void 0, function () {
            var isSuccess, lastRowIndex, csArrLength, batchRuns, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\nPerforming batch insert (batch size: " + batchSize + "):");
                        isSuccess = true;
                        lastRowIndex = 0;
                        csArrLength = csArr.length;
                        batchRuns = Math.ceil(csArr.length / batchSize);
                        _loop_1 = function (i) {
                            var nextLastRowIndex, sliceStart, sliceEnd, csBatchArr, csvInfo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Running batch " + (i + 1) + "/" + batchRuns);
                                        nextLastRowIndex = lastRowIndex + batchSize;
                                        sliceStart = lastRowIndex;
                                        sliceEnd = (nextLastRowIndex >= csArr.length ? csArrLength : nextLastRowIndex);
                                        csBatchArr = csArr.slice(sliceStart, sliceEnd);
                                        lastRowIndex = nextLastRowIndex;
                                        csvInfo = helper_1.getCSVInfoObj(csBatchArr);
                                        return [4 /*yield*/, this_1.connection.then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                                                var db;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            db = client.db();
                                                            return [4 /*yield*/, db.collection(csvInfo.csvDbName).insertMany(csvInfo.csvArr, { forceServerObjectId: true })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        console.log("Inserted: " + csvInfo.csvArr.length + " rows");
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < batchRuns)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, isSuccess];
                }
            });
        });
    };
    /**
     * Update database form csv
     * @param {CSVDatabase} csvDatabase
     * @return {Promise<boolean>}
     */
    MongoDBDatabase.prototype.updateDatabaseFromCSV = function (csvDatabase) {
        return __awaiter(this, void 0, void 0, function () {
            var cs, dbName, _a, _b, _c, res, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        console.log('\nBegin Updating Database.');
                        return [4 /*yield*/, csvDatabase.get()];
                    case 1:
                        cs = _g.sent();
                        if (cs[0] instanceof CaseInformation_1.default) {
                            dbName = 'case_informations';
                        }
                        else if (cs[0] instanceof FacilityInformation_1.default) {
                            dbName = 'facility_informations';
                        }
                        else {
                            throw new Error('[MongoDBDatabase]Cannot Determine DB NAME');
                        }
                        console.log("Truncating " + dbName + " table, because it causes anomaly when we don't.");
                        return [4 /*yield*/, this.truncate(dbName)];
                    case 2:
                        _g.sent();
                        console.log('\nBefore Updating Database: ');
                        console.log('cs length in csv: ' + cs.length);
                        _b = (_a = console).log;
                        _c = 'cs length in database: ';
                        return [4 /*yield*/, this.count(dbName)];
                    case 3:
                        _b.apply(_a, [_c + (_g.sent())]);
                        return [4 /*yield*/, this.batchInsertDatabaseFromCSV(cs, 25000)];
                    case 4:
                        res = _g.sent();
                        console.log('\nAfter Updating Database: ');
                        console.log('cs length in csv: ' + cs.length);
                        _e = (_d = console).log;
                        _f = 'cs length in database: ';
                        return [4 /*yield*/, this.count(dbName)];
                    case 5:
                        _e.apply(_d, [_f + (_g.sent())]);
                        if (res)
                            console.log('\nSuccessfully transferred data from CSV to Database.\n');
                        else
                            console.log('\nFailed to transfer data from CSV to Database.\n');
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return MongoDBDatabase;
}());
exports.default = MongoDBDatabase;
//# sourceMappingURL=MongoDBDatabase.js.map