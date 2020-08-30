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
/* eslint-disable max-len,no-throw-literal */
var fs_1 = __importDefault(require("fs"));
var pdf_parse_1 = __importDefault(require("pdf-parse"));
var path_1 = __importDefault(require("path"));
var PATH_TO_PDF = path_1.default.join(__dirname, '../tmp/latest.pdf');
var REGEX = 'https://bit.ly/([A-Za-z0-9]+)';
/**
 * Handles latest pdf downloaded through Google Drive
 */
var PDFHandler = /** @class */ (function () {
    function PDFHandler() {
    }
    /**
     * Load latest pdf and return the latest Google Folder Link
     * @return {Promise<String>} Link to latest Google Drive Folder
     */
    PDFHandler.prototype.getLatestFolderLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataBuffer, parsedPDF, text, symbol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataBuffer = fs_1.default.readFileSync(PATH_TO_PDF);
                        return [4 /*yield*/, pdf_parse_1.default(dataBuffer)];
                    case 1:
                        parsedPDF = _a.sent();
                        text = parsedPDF.text;
                        symbol = text.match(REGEX);
                        if (symbol === null)
                            throw '[PDFHandler.js] Regex Didn\'t matched anything';
                        console.log('Regex Matches: ' + symbol[0]);
                        return [2 /*return*/, symbol[0]];
                }
            });
        });
    };
    return PDFHandler;
}());
exports.default = PDFHandler;
//# sourceMappingURL=PDFHandler.js.map