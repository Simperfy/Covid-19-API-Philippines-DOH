"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
var app_1 = __importDefault(require("./app"));
var port = process.env.OPTIC_API_PORT || process.env.PORT || 3000;
app_1.default.listen(port, function () { return console.log("\nStarted Server on port: " + port); });
//# sourceMappingURL=index.js.map