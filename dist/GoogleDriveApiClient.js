"use strict";
/* eslint-disable max-len */
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
// REFERENCES:
// GOOGLE DRIVE API V3 DOCS https://developers.google.com/drive/api/v3/
// Metadata of file https://developers.google.com/drive/api/v3/reference/files
var google_auth_library_1 = require("google-auth-library");
var GoogleDriveApiFileManager_1 = __importDefault(require("./GoogleDriveApiFileManager"));
var DOH_DATA_DROP_FOLDER_ID = '1w_O-vweBFbqCgzgmCpux2F0HVB4P6ni2';
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];
/**
 * Handles Authorization to Google Drive
 */
var GoogleDriveApi = /** @class */ (function () {
    /**
     * Initialize variables and make this class a singleton
     * @return {GoogleDriveApi}
     */
    function GoogleDriveApi() {
        if (!GoogleDriveApi.instance) {
            GoogleDriveApi.instance = this;
        }
        return GoogleDriveApi.instance;
    }
    /**
       * Entry point for the class
      */
    GoogleDriveApi.prototype.getAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Authorizing');
                return [2 /*return*/, this.authorize()];
            });
        });
    };
    /**
       * Create an OAuth2 client with the given credentials, and then execute the
       * given callback function.
       */
    GoogleDriveApi.prototype.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        console.log('\nCheck if Service key exists...');
                        if (_this.isServiceKeysValid()) {
                            console.log('Service key is valid!');
                            // console.log('output: ');
                            // replace \\n with \n for heroku
                            var privateKey = process.env.PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n');
                            _this.auth = new google_auth_library_1.GoogleAuth({
                                scopes: SCOPES,
                            }).fromJSON({
                                'type': process.env.TYPE,
                                'project_id': process.env.PROJECT_ID,
                                'private_key_id': process.env.PRIVATE_KEY_ID,
                                'private_key': privateKey,
                                'client_email': process.env.CLIENT_EMAIL,
                                'client_id': process.env.CLIENT_ID,
                            });
                            // console.log(this.auth);
                            // create file manager as soon as OAuth2 is available
                            _this.googleDriveApiFileManager = new GoogleDriveApiFileManager_1.default(_this.auth, DOH_DATA_DROP_FOLDER_ID);
                            resolve(_this.auth);
                        }
                        else {
                            console.log('Service key is NOT valid!');
                            reject(new Error('There was a problem at service key in .env'));
                        }
                    })];
            });
        });
    };
    /**
     * verify service keys are all set in .env file
     * @return {boolean}
     */
    GoogleDriveApi.prototype.isServiceKeysValid = function () {
        return process.env.TYPE &&
            process.env.PROJECT_ID &&
            process.env.PRIVATE_KEY_ID &&
            process.env.PRIVATE_KEY &&
            process.env.CLIENT_EMAIL &&
            process.env.CLIENT_ID;
    };
    /**
     * Downloads the latest file from DOH DATA DROP ARCHIVES
     * https://bit.ly/DataDropArchives
     * @return {Promise<Object>}
     */
    GoogleDriveApi.prototype.downloadLatestFileFromArchives = function () {
        return this.googleDriveApiFileManager.downloadLatestFileFromArchives();
    };
    /**
     * downloads latest file based from the latest pdf
     * @return {Promise<String|null>}
     */
    GoogleDriveApi.prototype.downloadLatestFile = function () {
        return this.googleDriveApiFileManager.downloadLatestFile();
    };
    return GoogleDriveApi;
}());
exports.default = GoogleDriveApi;
//# sourceMappingURL=GoogleDriveApiClient.js.map