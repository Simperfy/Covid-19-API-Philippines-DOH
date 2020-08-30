"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc,max-len */
var enums_1 = require("./utils/enums");
var CaseInformation = /** @class */ (function () {
    function CaseInformation() {
    }
    Object.defineProperty(CaseInformation.prototype, "CaseCode", {
        get: function () {
            return this.caseCode;
        },
        set: function (caseCode) {
            this.caseCode = caseCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "Age", {
        get: function () {
            return this.age;
        },
        set: function (age) {
            this.age = (age === '') ? 0 : parseInt(age);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "AgeGroup", {
        get: function () {
            return this.ageGroup;
        },
        set: function (ageGroup) {
            this.ageGroup = ageGroup.replace(' to ', '-');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "Sex", {
        get: function () {
            return this.sex;
        },
        set: function (sex) {
            this.sex = sex.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateSpecimen", {
        get: function () {
            return this.dateSpecimen;
        },
        set: function (dateSpecimen) {
            this.dateSpecimen = dateSpecimen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateResultRelease", {
        get: function () {
            return this.dateResultRelease;
        },
        set: function (dateResultRelease) {
            this.dateResultRelease = dateResultRelease;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateRepConf", {
        get: function () {
            return this.dateRepConf;
        },
        set: function (dateRepConf) {
            this.dateRepConf = dateRepConf;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateDied", {
        get: function () {
            return this.dateDied;
        },
        set: function (dateDied) {
            this.dateDied = dateDied;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateRecover", {
        get: function () {
            return this.dateRecover;
        },
        set: function (dateRecover) {
            this.dateRecover = dateRecover;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "RemovalType", {
        get: function () {
            return this.removalType;
        },
        set: function (removalType) {
            this.removalType = removalType.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "Admitted", {
        get: function () {
            return this.admitted;
        },
        set: function (admitted) {
            this.admitted = admitted.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "RegionRes", {
        get: function () {
            return this.regionRes;
        },
        set: function (regionRes) {
            this.regionRes = regionRes.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "ProvRes", {
        get: function () {
            return this.provRes;
        },
        set: function (provRes) {
            this.provRes = provRes.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "CityMunRes", {
        get: function () {
            return this.cityMunRes;
        },
        set: function (cityMunRes) {
            this.cityMunRes = cityMunRes.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "CityMuniPSGC", {
        get: function () {
            return this.cityMuniPSGC;
        },
        set: function (cityMuniPSGC) {
            this.cityMuniPSGC = cityMuniPSGC;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "HealthStatus", {
        get: function () {
            return this.healthStatus;
        },
        set: function (healthStatus) {
            this.healthStatus = healthStatus.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "Quarantined", {
        get: function () {
            return this.quarantined;
        },
        set: function (quarantined) {
            this.quarantined = quarantined.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "DateOnset", {
        get: function () {
            return this.dateOnset;
        },
        set: function (dateOnset) {
            this.dateOnset = dateOnset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "Pregnanttab", {
        get: function () {
            return this.pregnanttab;
        },
        set: function (pregnanttab) {
            this.pregnanttab = pregnanttab.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseInformation.prototype, "ValidationStatus", {
        get: function () {
            return this.validationStatus;
        },
        set: function (validationStatus) {
            this.validationStatus = validationStatus;
        },
        enumerable: false,
        configurable: true
    });
    CaseInformation.getFilename = function () {
        return enums_1.DOWNLOADED_FILE_ALIASES.CASE_INFORMATION;
    };
    return CaseInformation;
}());
exports.default = CaseInformation;
//# sourceMappingURL=CaseInformation.js.map