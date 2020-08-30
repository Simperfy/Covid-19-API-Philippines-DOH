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
/* eslint-disable max-len */
var CSVDatabase_1 = __importDefault(require("./CSVDatabase"));
var CaseInformation_1 = __importDefault(require("../CaseInformation"));
var FacilityInformation_1 = __importDefault(require("../FacilityInformation"));
var MongoDBDatabase_1 = __importDefault(require("./MongoDBDatabase"));
// import MySQLDatabase from './MySQLDatabase';
// const CaseInformation = require('../CaseInformation');
/**
 * Handles Database
 */
var DatabaseAdapter = /** @class */ (function () {
    function DatabaseAdapter() {
    }
    /**
     * return {DatabaseAdapter} instance of the database adapter
     */
    DatabaseAdapter.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var msg;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!DatabaseAdapter.instance) return [3 /*break*/, 4];
                                    DatabaseAdapter.instance = this;
                                    console.log('Connecting to database');
                                    msg = void 0;
                                    console.log('Database Type: ' + process.env.DATABASE_TYPE);
                                    if (!(String(process.env.DATABASE_TYPE).toLowerCase() === 'nosql')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.connect(new MongoDBDatabase_1.default())];
                                case 1:
                                    msg = _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (String(process.env.DATABASE_TYPE).toLowerCase() === 'mysql') {
                                        // msg = await this.connect(new MySQLDatabase());
                                        reject(new Error('MYSQL Database is deprecated'));
                                    }
                                    else {
                                        reject(new Error('Please specify "DATABASE_TYPE" in environment variables'));
                                    }
                                    _a.label = 3;
                                case 3:
                                    console.log(msg);
                                    _a.label = 4;
                                case 4: return [2 /*return*/, resolve(DatabaseAdapter.instance)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {*} database Database Class
     * @return {Promise<String>} Returns a message whether connection is success or not
     */
    DatabaseAdapter.prototype.connect = function (database) {
        this.db = database;
        return this.db.connect();
    };
    /**
     * @param {Object} queries
     * @param {String} queries.month
     * @param {String} queries.day
     * @param {int} queries.page
     * @param {int} queries.limit
     * @param {int} queries.maxLimit
     * @param {Object|undefined} queries.filters
     * @return {Promise}
     */
    DatabaseAdapter.prototype.get = function (queries) {
        return this.db.get(queries);
    };
    /**
     * @param {String} dbName database name
     * @param {Object|null} objFilters contains the field and value
     * @return {Promise} contains the result of the query
     */
    DatabaseAdapter.prototype.count = function (dbName, objFilters) {
        if (objFilters === void 0) { objFilters = null; }
        return this.db.count(dbName, objFilters);
    };
    /**
     * @param {String} field
     * @param {String|Number} value
     * @return {Promise} Contains JSON
     */
    DatabaseAdapter.prototype.filter = function (field, value) {
        return this.db.filter(field, value);
    };
    /**
     * @param {String} region
     * @return {Promise<Object>} result
     * @return {Promise<Object>} result.data
     * @return {Promise<Object>} result.fatalityRate
     * @return {Promise<Object>} result.recoveryRate
     */
    DatabaseAdapter.prototype.getSummary = function (region) {
        if (region === void 0) { region = null; }
        return this.db.getSummary(region);
    };
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    DatabaseAdapter.prototype.getTimeline = function (queries) {
        return this.db.getTimeline(queries);
    };
    /**
     * @return {Promise}
     */
    DatabaseAdapter.prototype.getTopRegions = function () {
        return this.db.getTopRegions();
    };
    // FACILITIES
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    DatabaseAdapter.prototype.getFacilities = function (queries) {
        return this.db.getFacilities(queries);
    };
    /**
     * @param {Object} queries
     * @return {Promise}
     */
    DatabaseAdapter.prototype.getFacilitiesSummary = function (queries) {
        return this.db.getFacilitiesSummary(queries);
    };
    // ./FACILITIES
    /**
     * @param {String} field
     * @param {String} dataset
     * @return {Promise}
     */
    DatabaseAdapter.prototype.getListOf = function (field, dataset) {
        return this.db.getListOf(field, dataset);
    };
    /**
     *
     * @return {Promise<String>}
     */
    DatabaseAdapter.prototype.getLatestFolderID = function () {
        return this.db.getLatestFolderID();
    };
    /**
     *
     * @return {Promise<String>}
     */
    DatabaseAdapter.prototype.getLastUpdateDate = function () {
        return this.db.getLastUpdateDate();
    };
    /**
     * Truncates Database table
     * @param {String} tableName
     * @return {Promise<void>}
     */
    DatabaseAdapter.prototype.truncate = function (tableName) {
        return this.db.truncate(tableName);
    };
    /**
     * @param {String} tableName
     * @param {Object} fieldValueObj
     * @return {Promise<String>}
     */
    DatabaseAdapter.prototype.insert = function (tableName, fieldValueObj) {
        return this.db.insert(tableName, fieldValueObj);
    };
    /**
     * End Database connection
     */
    DatabaseAdapter.prototype.endConnection = function () {
        this.db.endConnection();
    };
    /**
     * Update database form csv
     * @return {Promise<boolean>}
     */
    DatabaseAdapter.prototype.updateDatabaseFromCSV = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, lowMemory, _a, _b, memUsed;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = true;
                        lowMemory = true;
                        _b = (_a = this.db).updateDatabaseFromCSV;
                        return [4 /*yield*/, new CSVDatabase_1.default().init(CaseInformation_1.default)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var memUsed, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!res)
                                            result = false;
                                        while (lowMemory) {
                                            memUsed = process.memoryUsage().heapTotal / 1000000;
                                            if (memUsed < 150)
                                                lowMemory = false;
                                            global.gc();
                                        }
                                        _b = (_a = this.db).updateDatabaseFromCSV;
                                        return [4 /*yield*/, new CSVDatabase_1.default().init(FacilityInformation_1.default)];
                                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                }
                            });
                        }); })
                            .then(function (res) {
                            if (!res)
                                result = false;
                            global.gc();
                        }).catch(function (err) {
                            throw new Error(err);
                        })];
                    case 2:
                        _c.sent();
                        lowMemory = true;
                        while (lowMemory) {
                            memUsed = process.memoryUsage().heapTotal / 1000000;
                            if (memUsed < 150)
                                lowMemory = false;
                            global.gc();
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return DatabaseAdapter;
}());
exports.default = DatabaseAdapter;
//# sourceMappingURL=DatabaseAdapter.js.map