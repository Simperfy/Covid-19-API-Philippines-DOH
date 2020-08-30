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
/* eslint-disable max-len,new-cap */
/* eslint-disable require-jsdoc */
var csvtojson_1 = __importDefault(require("csvtojson"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var CaseInformation_1 = __importDefault(require("../CaseInformation"));
var FacilityInformation_1 = __importDefault(require("../FacilityInformation"));
var helper_1 = require("../utils/helper");
var CSVDatabase = /** @class */ (function () {
    function CSVDatabase() {
    }
    CSVDatabase.prototype.init = function (CsvClass) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isConverting = false;
                        this.csvClass = CsvClass;
                        this.CSVDatabaseArray = [];
                        this.csvFilePath = path_1.default.join(__dirname, "../../tmp/" + this.csvClass.getFilename());
                        return [4 /*yield*/, this.convertCsvToJson()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @return {Promise<Converter>}
     */
    CSVDatabase.prototype.assureCSIsLoaded = function () {
        return this.converter;
    };
    /**
     * @return {Promise<Converter>}
     */
    CSVDatabase.prototype.convertCsvToJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pathToCSV, dateThreshold_1, msg, isFacilityInfo_1, isCaseInfo_1, updatedDateIndex_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isConverting) return [3 /*break*/, 3];
                        this.isConverting = true;
                        pathToCSV = this.csvFilePath;
                        dateThreshold_1 = new Date();
                        dateThreshold_1 = dateThreshold_1.setDate(dateThreshold_1.getDate() - (parseInt(process.env.FACILITIES_THRESHOLD) || 360));
                        msg = process.env.FACILITIES_THRESHOLD || 'facilities threshold not found in .env, setting to 360';
                        msg += '\nIf this causes Out of memory error lower the value to 7 or 30';
                        console.log('Facilities Threshold: ', msg);
                        return [4 /*yield*/, new this.csvClass()];
                    case 1:
                        isFacilityInfo_1 = ((_a.sent()) instanceof FacilityInformation_1.default);
                        return [4 /*yield*/, new this.csvClass()];
                    case 2:
                        isCaseInfo_1 = ((_a.sent()) instanceof CaseInformation_1.default);
                        updatedDateIndex_1 = 3;
                        if (fs_1.default.existsSync(pathToCSV)) {
                            // Invoking csv returns a promise
                            return [2 /*return*/, this.converter = csvtojson_1.default({
                                    trim: true,
                                })
                                    .fromFile(pathToCSV)
                                    .preFileLine(function (fileLineString) {
                                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                        var upDate;
                                        return __generator(this, function (_a) {
                                            if (isFacilityInfo_1) {
                                                fileLineString = fileLineString.split(',');
                                                upDate = new Date(fileLineString[updatedDateIndex_1]);
                                                if (upDate < (dateThreshold_1))
                                                    resolve('');
                                                else
                                                    resolve(fileLineString.join(','));
                                            }
                                            else if (isCaseInfo_1) {
                                                resolve(fileLineString);
                                            }
                                            else {
                                                throw new Error('Cannot determine csv data type while parsing csv file.');
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); });
                                })
                                    .then(function (json) {
                                    var c;
                                    json.forEach(function (row) {
                                        // eslint-disable-next-line new-cap
                                        c = new _this.csvClass();
                                        if (c instanceof FacilityInformation_1.default) {
                                            // filter out empty updateddate
                                            if (row.updateddate !== '') {
                                                Object.assign(c, row);
                                                _this.CSVDatabaseArray.push(c);
                                            }
                                        }
                                        else if (c instanceof CaseInformation_1.default) {
                                            Object.assign(c, row);
                                            _this.CSVDatabaseArray.push(c);
                                        }
                                        else {
                                            throw new Error('Cannot determine csv type for updateddate');
                                        }
                                    });
                                })
                                    .then(function () {
                                    if (_this.CSVDatabaseArray[0] instanceof CaseInformation_1.default) {
                                        console.log('CaseInformation CSV loaded');
                                        return true;
                                    }
                                    else if (_this.CSVDatabaseArray[0] instanceof FacilityInformation_1.default) {
                                        console.log('FacilityInformation CSV loaded');
                                        console.log('Grouping results by latest updateddate...');
                                        _this.CSVDatabaseArray = helper_1.filterLatestFacilityData(_this.CSVDatabaseArray);
                                        console.log('Grouping done!');
                                        return true;
                                    }
                                    else {
                                        throw new Error('[CSVDatabase.js]Cannot determine csv data type.');
                                    }
                                }, function (err) { return console.log(err); })];
                        }
                        else {
                            this.isConverting = false;
                            console.error("Cannot find " + this.csvFilePath + ", Did you visit \"/api/updateDatabase\"?");
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
    CSVDatabase.prototype.filter = function (field, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assureCSIsLoaded()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.CSVDatabaseArray.filter(function (ci) { return ci[field] == value; })];
                }
            });
        });
    };
    /**
       *
       * @param {int} size Max number of entries to return
       * @return {Promise<[CaseInformation]|[FacilityInformation]>}
       */
    CSVDatabase.prototype.get = function (size) {
        if (size === void 0) { size = this.getSize(); }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.assureCSIsLoaded()];
                    case 1:
                        _d.sent();
                        _b = (_a = this.CSVDatabaseArray).slice;
                        _c = [0];
                        return [4 /*yield*/, size];
                    case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
                }
            });
        });
    };
    /**
     * @return {int} length of the CaseInformations array
     */
    CSVDatabase.prototype.getSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assureCSIsLoaded()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.CSVDatabaseArray.length];
                }
            });
        });
    };
    /**
     * @param {String} field
     * @return {Promise<[CaseInformation]>}
     */
    CSVDatabase.prototype.sort = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var cs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1:
                        cs = _a.sent();
                        return [2 /*return*/, cs.sort(this.getSortOrder(field))];
                }
            });
        });
    };
    /**
     * @param {String} property Property of Case Information
     * @return {Function}
     */
    CSVDatabase.prototype.getSortOrder = function (property) {
        return function (a, b) {
            if (a[property] > b[property]) {
                return 1;
            }
            else if (a[property] < b[property]) {
                return -1;
            }
            return 0;
        };
    };
    /**
     * @param {[CaseInformation]} csArr
     * @param {String} caseCode
     * @return {int} position of the case code in the array
     */
    CSVDatabase.prototype.findIndex = function (csArr, caseCode) {
        return csArr.findIndex(function (cs) { return cs.CaseCode == caseCode; });
    };
    return CSVDatabase;
}());
exports.default = CSVDatabase;
//# sourceMappingURL=CSVDatabase.js.map