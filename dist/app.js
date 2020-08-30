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
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
var apicache_1 = __importDefault(require("apicache"));
// Swagger api docs
// const swaggerUI = require('swagger-ui-express');
// const openApiJson = require('./openapi.json');
// GOOGLE DRIVE VARS
var GoogleDriveApiClient_1 = __importDefault(require("./GoogleDriveApiClient"));
var GDriveApi = new GoogleDriveApiClient_1.default();
// SERVER VARS
var express_1 = __importDefault(require("express"));
var app = express_1.default();
// Database vars
var DatabaseAdapter_1 = __importDefault(require("./Database/DatabaseAdapter"));
// Database Logger
var DBLogger_1 = __importDefault(require("./DBLogger"));
// Enums
var enums_1 = require("./utils/enums");
// helpers
var helper_1 = require("./utils/helper");
// Express related vars
var updateInterval = parseFloat(process.env.UPDATE_INTERVAL) || 24;
var maxLimit = 10000;
var db;
// ./INTERFACES
var jsonRespStructure = {
    'data': [],
};
// swaggerUI.setup Options
// const options = {
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Covid-19 Philippines API DOH',
// };
// Middlewares
app.use(cors_1.default());
app.use(compression_1.default());
if (process.env.NODE_ENV !== 'development') { // only use cache in production
    var cache = apicache_1.default.options({
        statusCodes: {
            exclude: [404, 403, 503],
            include: [200],
        },
    }).middleware;
    app.use(cache('6 hours'));
}
app.use(morgan_1.default(function (tokens, req, res) {
    return [
        '[' + new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Shanghai',
        }) + ']',
        "\u001B[35m" + tokens.method(req, res) + "\u001B[0m",
        "\u001B[4m\"" + tokens.url(req, res) + "\u001B[0m\"",
        "\u001B[36m" + tokens.status(req, res) + "\u001B[0m",
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ].join(' ');
}));
// Custom middleware
app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dbLogger, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, new DBLogger_1.default().init()];
            case 1:
                dbLogger = _b.sent();
                // Clear data before every request
                jsonRespStructure = {
                    'data': [],
                };
                // add last_update to json response
                _a = jsonRespStructure;
                return [4 /*yield*/, dbLogger.getLastUpdateDate()];
            case 2:
                // add last_update to json response
                _a.last_update = _b.sent();
                next();
                return [2 /*return*/];
        }
    });
}); });
// eslint-disable-next-line new-cap
var router = express_1.default.Router();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DatabaseAdapter_1.default().init()];
            case 1:
                // Initialize Database
                db = _a.sent();
                // Initialize Google Auth Token
                return [4 /*yield*/, GDriveApi.getAuth().then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(process.env.NODE_ENV === 'production')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, autoUpdate()];
                                case 1:
                                    _b.sent();
                                    _a = setInterval;
                                    return [4 /*yield*/, autoUpdate];
                                case 2:
                                    _a.apply(void 0, [_b.sent(), ((1000 * 60) * 60) * updateInterval]); // 1min -> 1 hr -> 24 hrs
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }).catch(function (err) {
                        if (err.err) {
                            console.log('\n' + err.err);
                        }
                        else {
                            console.log('\n' + err);
                        }
                    })];
            case 2:
                // Initialize Google Auth Token
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
/**
 * Auto update function
 * @return {Promise<void>}
 */
function autoUpdate() {
    return __awaiter(this, void 0, void 0, function () {
        var shouldSkip;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldSkip = false;
                    console.log('\nAuto Update Initialized');
                    console.log('Interval hr: ' + updateInterval);
                    return [4 /*yield*/, GDriveApi.downloadLatestFile().then(function (data) {
                            if (data === enums_1.DOWNLOAD_STATUS.DOWNLOAD_SKIPPED) {
                                shouldSkip = process.env.DISABLE_SKIP_DATABASE_UPDATE.toLowerCase() !== 'true';
                                console.log('Skipping download of files');
                            }
                            else {
                                console.log('download status: ', data);
                            }
                        }).catch(function (err) {
                            console.log('Error Downloading Latest Files: ' + err);
                        })];
                case 1:
                    _a.sent();
                    console.log('\nSKIP? ', shouldSkip);
                    if (!!shouldSkip) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.updateDatabaseFromCSV().then(function (data) {
                            if (data === true)
                                console.log('Database Updated Successfully');
                            else
                                console.log('Something went wrong while updating database');
                        }).catch(function (err) {
                            console.log('Error Updating Database: ' + err);
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (process.env.DISABLE_TMP_DELETION.toLowerCase() !== 'true') {
                        console.log('\nDeleting tmp folder...');
                        helper_1.deleteTmpFolder();
                    }
                    else {
                        console.log('Skipping deletion of tmp folder.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
router.get('/updateDatabase', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 2];
                return [4 /*yield*/, autoUpdate().then(function () {
                        res.json({ 'success': true });
                    }).catch(function (err) {
                        res.json({ 'success': false });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                res.send('You cannot manually update database in production.');
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/filter/:field/:value', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        jsonRespStructure.data = [];
        jsonRespStructure.WARNING = 'DEPRECATED please use /api/get?field=value instead';
        jsonRespStructure.result_count = jsonRespStructure.data.length;
        res.json(jsonRespStructure);
        return [2 /*return*/];
    });
}); });
router.get('/get', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var month, day, page, limit, queries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                month = req.query.month;
                day = req.query.day;
                page = parseInt(req.query.page) || 1;
                limit = parseInt(req.query.limit) || maxLimit;
                delete req.query.month;
                delete req.query.day;
                delete req.query.page;
                delete req.query.limit;
                queries = { limit: limit, month: month, day: day, page: page, maxLimit: maxLimit, filters: req.query };
                return [4 /*yield*/, db.get(queries).then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                        var dbCount, maxPage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    jsonRespStructure.data = data;
                                    return [4 /*yield*/, db.count('case_informations')];
                                case 1:
                                    dbCount = _a.sent();
                                    maxPage = Math.ceil(dbCount / limit);
                                    if (dbCount === 0) {
                                        jsonRespStructure.error = "Error: There's no data found found.";
                                        return [2 /*return*/, res.json(jsonRespStructure)];
                                    }
                                    if (page > maxPage) {
                                        jsonRespStructure.error = "Error: page query can't be greater than max_page(" + maxPage + ")";
                                        return [2 /*return*/, res.json(jsonRespStructure)];
                                    }
                                    jsonRespStructure.pagination = {
                                        'previous_page': page - 1,
                                        'next_page': page + 1,
                                        'limit': limit,
                                        'max_page': maxPage,
                                    };
                                    if (jsonRespStructure.pagination.previous_page <= 0) {
                                        delete jsonRespStructure.pagination.previous_page;
                                    }
                                    if (jsonRespStructure.pagination.next_page >= maxPage) {
                                        delete jsonRespStructure.pagination.next_page;
                                    }
                                    jsonRespStructure.result_count = data.length;
                                    res.json(jsonRespStructure);
                                    return [2 /*return*/];
                            }
                        });
                    }); }).catch(function (err) {
                        jsonRespStructure.error = err.message;
                        res.json(jsonRespStructure);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/timeline', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.getTimeline(req.query).then(function (data) {
                    jsonRespStructure.data = data;
                    res.json(jsonRespStructure);
                }).catch(function (err) {
                    jsonRespStructure.error = err.message;
                    res.json(jsonRespStructure);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/top-regions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.getTopRegions().then(function (data) {
                    jsonRespStructure.data = data;
                    res.json(jsonRespStructure);
                }).catch(function (err) {
                    jsonRespStructure.error = err.message;
                    res.json(jsonRespStructure);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var region;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.query.region === undefined && req.query.region_res !== undefined) {
                    req.query.region = req.query.region_res;
                }
                region = req.query.region || null;
                return [4 /*yield*/, db.getSummary(region).then(function (data) {
                        (jsonRespStructure.data = data.result, jsonRespStructure.data.fatality_rate = data.fatalityRate, jsonRespStructure.data.recovery_rate = data.recoveryRate);
                        res.json(jsonRespStructure);
                    }).catch(function (err) {
                        jsonRespStructure.error = err.message;
                        res.json(jsonRespStructure);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/facilities', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.getFacilities(req.query).then(function (data) {
                    jsonRespStructure.data = data;
                    res.json(jsonRespStructure);
                }).catch(function (err) {
                    jsonRespStructure.error = err.message;
                    res.json(jsonRespStructure);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/facilities/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.getFacilitiesSummary(req.query).then(function (data) {
                    jsonRespStructure.data = data;
                    res.json(jsonRespStructure);
                }).catch(function (err) {
                    jsonRespStructure.error = err.message;
                    res.json(jsonRespStructure);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// API that lists values
router.get('/list-of/:field', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.dataset)
                    req.query.dataset = 'case_information';
                return [4 /*yield*/, db.getListOf(req.params.field, req.query.dataset).then(function (data) {
                        jsonRespStructure.data = data;
                        res.json(jsonRespStructure);
                    }).catch(function (err) {
                        jsonRespStructure.error = err.message;
                        res.json(jsonRespStructure);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.use('/api', router); // Add prefix "/api" to routes above
// app.use('/', swaggerUI.serve, swaggerUI.setup(openApiJson, options));
app.use('/', function (req, res) { return res.redirect('https://documenter.getpostman.com/view/12463261/T1LV9jLU'); });
exports.default = app;
//# sourceMappingURL=app.js.map