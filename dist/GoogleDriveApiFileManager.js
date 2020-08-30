"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/* eslint-disable max-len*/
var readline = __importStar(require("readline"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var googleapis_1 = require("googleapis");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var urlExpander = require('expand-url');
var PDFHandler_1 = __importDefault(require("./PDFHandler"));
var enums_1 = require("./utils/enums");
var constants_1 = require("./utils/constants");
var helper_1 = require("./utils/helper");
var DBLogger_1 = __importDefault(require("./DBLogger"));
var TMP_PATH = path_1.default.join(__dirname, '/../tmp');
var DATA_DROP_LINK = 'http://bit.ly/DataDropPH';
/**
 * Handles Google Files
 */
var GoogleDriveApiFileManager = /** @class */ (function () {
    /**
     * Initialize Variable
     * @param {OAuth2Client} auth
     * @param {String} rootFolderID
     */
    function GoogleDriveApiFileManager(auth, rootFolderID) {
        this.auth = auth;
        this.rootFolderID = rootFolderID;
    }
    /* listFiles() {
      const auth = this.auth;
      // console.log(auth);
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log('\nFiles:');
          files.map((file) => {
            console.log(`${file.name} (${file.id})`);
          });
        } else {
          console.log('No files found.');
        }
      });
    }*/
    /**
     * @param {String} query Search query
     * @param {int} pageSize max number of result
     * @return {Promise} contains files object with name and id
     */
    /* searchFiles(query, pageSize = 10) {
      return new Promise((resolve, reject) => {
        const auth = this.auth;
        const drive = google.drive({version: 'v3', auth});
        drive.files.list({
          q: query,
          pageSize: pageSize,
          fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const files = res.data.files;
          if (files.length) {
            console.log('\nSearched Files:');
            resolve(files);
            files.map((file) => {
              console.log(`${file.name} (${file.id})`);
            });
          } else {
            console.log('No files found.');
          }
        });
      });
    }*/
    /**
     * @typedef {Object} files
     * @property {String} id - id of the file
     * @property {String} name - file name when saved
     * @param {String} folderID
     * @return {Promise<[files]>} - contains name and id of folders in the root `folder
     */
    GoogleDriveApiFileManager.prototype.getFilesInRootFolder = function (folderID) {
        var _this = this;
        if (folderID === void 0) { folderID = this.rootFolderID; }
        return new Promise(function (resolve, reject) {
            var auth = _this.auth;
            var drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
            drive.files.list({
                q: "'" + folderID + "' in parents",
                fields: 'nextPageToken, files(id, name)',
            }).then(function (res) {
                var files = res.data.files;
                if (files.length) {
                    console.log('\nFiles in root folder:');
                    files.map(function (file) {
                        console.log(file.name + " " + file.id);
                    });
                    resolve(files);
                }
                else {
                    console.log('No files found.');
                }
            }).catch(function (err) {
                console.log('An Error Occurred while getting a list of files');
                console.log('Reason: ' + err);
            });
        });
    };
    /**
     * @return {String} ID of the folder this month
     */
    GoogleDriveApiFileManager.prototype.getGFolderIDThisMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, month, searchString;
            var _this = this;
            return __generator(this, function (_a) {
                date = new Date();
                month = (date.getMonth()) + 1;
                searchString = '(0' + month + ')';
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getFilesInRootFolder().then(function (folders) {
                                        console.log("\nFiltering \"" + searchString + "\": ");
                                        var res = folders.filter(function (file) {
                                            console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
                                            return (-1 !== (file.name.search(searchString)));
                                        });
                                        if (res.length === 1) {
                                            return resolve(res[0].id);
                                        }
                                        else {
                                            reject(new Error('[googleDriveApiFileManager.js] Folder this month couldn\'t be found'));
                                        }
                                    }).catch(function (err) {
                                        console.log('[googleDriveApiFileManager.js] ' + err);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * We get the latest folder by ordering the result by name in descending order
     * therefore the first element in result is the latest
     * we cannot use date modified/create date because DOH create/modify these folders from time to time.
     * @return {Object} Contains ID and Name of the latest folder inside this month's folder
     */
    GoogleDriveApiFileManager.prototype.getLatestGFolderObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, auth, drive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGFolderIDThisMonth()];
                    case 1:
                        id = _a.sent();
                        console.log('\nThis month folder id: ' + id);
                        auth = this.auth;
                        drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                drive.files.list({
                                    q: "'" + id + "' in parents",
                                    orderBy: 'name desc',
                                    fields: 'nextPageToken, files(id, name)',
                                }, function (err, res) {
                                    if (err)
                                        return reject(new Error('The API returned an error: ' + err));
                                    var files = res.data.files;
                                    if (files.length) {
                                        console.log("\nFiles inside this month's folder:");
                                        files.map(function (file) {
                                            console.log(file.name + " " + file.id);
                                        });
                                        resolve(files[0]);
                                    }
                                    else {
                                        console.log('No files found.');
                                        return reject(new Error('[googleDriveApiFileManager.js] No files found in this month\'s folder'));
                                    }
                                });
                            })];
                }
            });
        });
    };
    /**
     * @return {Promise} Object with name and id of the items inside latest folder
     */
    GoogleDriveApiFileManager.prototype.getLatestFolderContentsObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestFolder, id, auth, drive, searchString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestGFolderObject()];
                    case 1:
                        latestFolder = _a.sent();
                        id = latestFolder.id;
                        this.latestFolderName = latestFolder.name;
                        console.log('\nLatest folder id: ' + id);
                        auth = this.auth;
                        drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
                        searchString = 'Case Information.csv';
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                drive.files.list({
                                    q: "'" + id + "' in parents",
                                    orderBy: 'name',
                                    fields: 'nextPageToken, files(id, name)',
                                }, function (err, res) {
                                    if (err)
                                        return reject(new Error('The API returned an error: ' + err));
                                    var files = res.data.files;
                                    if (files.length) {
                                        console.log("\nFiltering \"" + searchString + "\":");
                                        var res_1 = files.filter(function (file) {
                                            console.log((-1 !== (file.name.search(searchString))) + ' : ' + file.name);
                                            return (-1 !== (file.name.search(searchString)));
                                        });
                                        if (res_1.length === 1) {
                                            resolve(res_1[0]);
                                        }
                                        else {
                                            return reject(new Error('[googleDriveApiFileManager.js] No results from search. Search String = ' + searchString));
                                        }
                                    }
                                    else {
                                        console.log('No files found.');
                                        return reject(new Error('[googleDriveApiFileManager.js] No files found in latest folder'));
                                    }
                                });
                            })];
                }
            });
        });
    };
    /**
     * @param {Object} fileObj File Object containing ID and name of the file when saved
     * @param {String} fileObj.id id of the file
     * @param {String} fileObj.name name of the file when saved
     * @param {String} name Name of the file that will be downloaded
     * @return {Promise<String>} filePath to the downloaded file
     */
    GoogleDriveApiFileManager.prototype.downloadFile = function (fileObj, name) {
        if (name === void 0) { name = 'Data.csv'; }
        return __awaiter(this, void 0, void 0, function () {
            var auth, drive, res, filePath, dest, progress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\nDOWNLOADING FILE: ' + fileObj.name);
                        auth = this.auth;
                        drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
                        return [4 /*yield*/, drive.files
                                .get({ fileId: fileObj.id, alt: 'media' }, { responseType: 'stream' }).catch(function (err) { return console.log(err); })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, fs_1.default.promises.mkdir(TMP_PATH, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = TMP_PATH + "/" + name;
                        console.log("\nSaving to " + filePath);
                        dest = fs_1.default.createWriteStream(filePath);
                        progress = 0;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                res.data
                                    .on('end', function () {
                                    console.log('\nDone downloading file. ' + fileObj.name);
                                    resolve(filePath);
                                })
                                    .on('error', function (err) {
                                    console.error('Error downloading file.');
                                    return reject(new Error('[googleDriveApiFileManager.js] ' + err));
                                })
                                    .on('data', function (d) {
                                    progress += d.length;
                                    if (process.stdout.isTTY) {
                                        readline.clearLine(process.stdout, 0);
                                        readline.cursorTo(process.stdout, 0);
                                        process.stdout.write("Downloaded " + progress + " bytes");
                                    }
                                })
                                    .pipe(dest);
                                dest.on('finish', function () {
                                    dest.close();
                                });
                            })];
                }
            });
        });
    };
    /**
     * @param {Object[]} files An array of object of files
     * @param {String} files[].id file id
     * @param {String} files[].name Original name of the file
     * @param {String|undefined} files[].alias Alternative name of the file
     */
    GoogleDriveApiFileManager.prototype.downloadFiles = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1, this_1, _i, files_1, file;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(process.env.SKIP_DOWNLOADS.toLowerCase() === 'true')) return [3 /*break*/, 1];
                                    console.log('[DEBUG] SKIPPING DOWNLOAD OF CSV FILES');
                                    console.log('Make sure you downloaded the csv files.');
                                    return [3 /*break*/, 6];
                                case 1:
                                    console.log('Downloading multiple files:');
                                    console.log(files);
                                    _loop_1 = function (file) {
                                        var fileName;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    fileName = file.alias || file.name;
                                                    return [4 /*yield*/, this_1.downloadFile(file, fileName)
                                                            .catch(function (err) { return reject(new Error("Failed to download file " + file.name + ": " + err)); })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    this_1 = this;
                                    _i = 0, files_1 = files;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                                    file = files_1[_i];
                                    return [5 /*yield**/, _loop_1(file)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    console.log('\nDone downloading multiple files.');
                                    _a.label = 6;
                                case 6:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @return {Promise<Object>} ibject containing name of folder file and file path of downloaded file
     */
    GoogleDriveApiFileManager.prototype.downloadLatestFileFromArchives = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestFolderObject, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestFolderContentsObject()];
                    case 1:
                        latestFolderObject = _a.sent();
                        return [4 /*yield*/, this.downloadFile(latestFolderObject, 'Data.csv')];
                    case 2:
                        filePath = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var data = {
                                    latestFolderName: null,
                                    downloadedFilePath: null,
                                };
                                data.latestFolderName = latestFolderObject.name;
                                data.downloadedFilePath = filePath;
                                resolve(data);
                            })];
                }
            });
        });
    };
    /**
     * downloads latest pdf file
     * @return {Promise<void>}
     */
    GoogleDriveApiFileManager.prototype.downloadLatestPDF = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // const t = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        urlExpander.expand(DATA_DROP_LINK, function (err, longUrl) { return __awaiter(_this, void 0, void 0, function () {
                            var folderID;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err)
                                            return [2 /*return*/, reject(new Error('[GoogleDriveApiFileManager.js] ' + err))];
                                        folderID = this.extractFolderIDFromURL(longUrl);
                                        console.log('Downloading latest pdf from folder id: ' + folderID);
                                        return [4 /*yield*/, this.getFilesInRootFolder(folderID).then(function (files) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            console.log(files);
                                                            _a = resolve;
                                                            return [4 /*yield*/, this.downloadFile(files[0], 'latest.pdf')];
                                                        case 1:
                                                            _a.apply(void 0, [_b.sent()]);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }).catch(function (err) { return reject(err); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    /**
     *
     * @return {Promise<String|Boolean>}
     */
    GoogleDriveApiFileManager.prototype.downloadLatestFileFromDataDrop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // const t = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.downloadLatestPDF().then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var isErr, p, shortLink;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        isErr = false;
                                        p = new PDFHandler_1.default();
                                        return [4 /*yield*/, p.getLatestFolderLink().catch(function (err) {
                                                isErr = true;
                                                resolve(enums_1.DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_FAILED);
                                            })];
                                    case 1:
                                        shortLink = _a.sent();
                                        if (isErr)
                                            return [2 /*return*/];
                                        // @TODO @DOGGO Until here
                                        console.log('\nshortUrl: ' + shortLink);
                                        urlExpander.expand(shortLink, function (err, longUrl) { return __awaiter(_this, void 0, void 0, function () {
                                            var folderID, dbLogger, previousFolderID;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (err)
                                                            return [2 /*return*/, reject(new Error('[GoogleDriveApiFileManager.js] ' + err))];
                                                        console.log('Long url: ' + longUrl);
                                                        folderID = this.extractFolderIDFromURL(longUrl);
                                                        return [4 /*yield*/, new DBLogger_1.default().init()];
                                                    case 1:
                                                        dbLogger = _a.sent();
                                                        return [4 /*yield*/, dbLogger.getLatestFolderID()];
                                                    case 2:
                                                        previousFolderID = _a.sent();
                                                        if (!(folderID === previousFolderID && process.env.BYPASS_FOLDERID_CHECK.toLowerCase() === 'false')) return [3 /*break*/, 3];
                                                        console.log('\nPrevious folder ID is the same as target folder ID');
                                                        console.log('Skipping the download of csv file');
                                                        resolve(enums_1.DOWNLOAD_STATUS.DOWNLOAD_SKIPPED);
                                                        return [3 /*break*/, 6];
                                                    case 3:
                                                        console.log('\nFolder ID: ' + folderID);
                                                        console.log('Logging folder id...');
                                                        return [4 /*yield*/, dbLogger.insertToUpdateSummary(folderID)];
                                                    case 4:
                                                        _a.sent();
                                                        return [4 /*yield*/, this.getFilesInRootFolder(folderID).then(function (files) { return __awaiter(_this, void 0, void 0, function () {
                                                                var reqFiles, reqFilesWithAliases;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            reqFiles = helper_1.getRequiredFiles(files, constants_1.filesToSearch);
                                                                            reqFilesWithAliases = reqFiles.map(function (file) {
                                                                                if (-1 !== file.name.search(constants_1.filesToSearch[0])) { // case information
                                                                                    file.alias = enums_1.DOWNLOADED_FILE_ALIASES.CASE_INFORMATION;
                                                                                }
                                                                                else if (-1 !== file.name.search(constants_1.filesToSearch[1])) { // DOH data collect - daily report
                                                                                    file.alias = enums_1.DOWNLOADED_FILE_ALIASES.DAILY_REPORT;
                                                                                }
                                                                                return file;
                                                                            });
                                                                            if (files.length < 0)
                                                                                return [2 /*return*/, reject(new Error('[GoogleDriveApiFileManager.js] Error no files found.'))];
                                                                            return [4 /*yield*/, this.downloadFiles(reqFilesWithAliases)
                                                                                    .then(function () { return resolve(enums_1.DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS); })
                                                                                    .catch(function (err) { return reject(new Error('[GoogleDriveApiFileManager.js] ' + err)); })];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }).catch(function (err) { return console.log('[GoogleDriveApiFileManager.js] ' + err); })];
                                                    case 5:
                                                        _a.sent();
                                                        _a.label = 6;
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    /**
     * Downloads Latest file from DataDrop or DataDrop Archives
     * @return {Promise<String|null>}
     */
    GoogleDriveApiFileManager.prototype.downloadLatestFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // const t = this;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('Downloading latest csv file from latest pdf');
                                    return [4 /*yield*/, this.downloadLatestFileFromDataDrop().then(function (data) {
                                            switch (data) {
                                                case enums_1.DOWNLOAD_STATUS.DOWNLOAD_SKIPPED:
                                                    resolve(enums_1.DOWNLOAD_STATUS.DOWNLOAD_SKIPPED);
                                                    break;
                                                case enums_1.DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_FAILED:
                                                    console.log('\nDownloading latest csv file from archives instead');
                                                    _this.downloadLatestFileFromArchives()
                                                        .then(function () { return resolve(enums_1.DOWNLOAD_STATUS.DOWNLOADED_FROM_ARCHIVES); })
                                                        .catch(function (err) {
                                                        console.log('\ncsv file also failed to be downloaded from archives');
                                                        reject(new Error(err));
                                                    });
                                                    break;
                                                case enums_1.DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS:
                                                    resolve(enums_1.DOWNLOAD_STATUS.DOWNLOADED_LATEST_FILE_SUCCESS);
                                                    break;
                                                default:
                                                    throw new Error('Download Status Undefined');
                                            }
                                        }).catch(function (err) { return reject(new Error(err)); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * extracts id from url.
     * ie: https://drive.google.com/drive/folders/1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o?usp=sharing
     * returns 1ZPPcVU4M7T-dtRyUceb0pMAd8ickYf8o
     * @param {String} url
     * @return {String}
     */
    GoogleDriveApiFileManager.prototype.extractFolderIDFromURL = function (url) {
        return url.split('/')[5].split('?')[0];
    };
    return GoogleDriveApiFileManager;
}());
exports.default = GoogleDriveApiFileManager;
//# sourceMappingURL=GoogleDriveApiFileManager.js.map