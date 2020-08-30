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
var DatabaseAdapter_1 = __importDefault(require("./Database/DatabaseAdapter"));
var DBLogger = /** @class */ (function () {
    function DBLogger() {
    }
    DBLogger.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!DBLogger.instance) return [3 /*break*/, 2];
                        DBLogger.instance = this;
                        _a = this;
                        return [4 /*yield*/, new DatabaseAdapter_1.default().init()];
                    case 1:
                        _a.dba = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, DBLogger.instance];
                }
            });
        });
    };
    /**
     *
     * @return {Promise<String>}
     */
    DBLogger.prototype.getLatestFolderID = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dba.getLatestFolderID()];
            });
        });
    };
    DBLogger.prototype.insertToUpdateSummary = function (folderID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (process.env.DATABASE_TYPE.toLowerCase() === 'mysql') {
                    return [2 /*return*/, this.dba.insert('update_history', { 'id': 'NULL', 'folder_id': "'" + folderID + "'", 'updated_at': 'current_timestamp()' })];
                }
                else if (process.env.DATABASE_TYPE.toLowerCase() === 'nosql') {
                    return [2 /*return*/, this.dba.insert('update_history', { 'folder_id': "" + folderID, 'updated_at': "" + new Date().toLocaleString('en-US', {
                                timeZone: 'Asia/Shanghai',
                            }) })];
                }
                else {
                    throw new Error('No DATABASE_TYPE specified');
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @return {Promise<String>}
     */
    DBLogger.prototype.getLastUpdateDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dba.getLastUpdateDate()];
            });
        });
    };
    return DBLogger;
}());
exports.default = DBLogger;
//# sourceMappingURL=DBLogger.js.map