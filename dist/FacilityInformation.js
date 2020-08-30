"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase,require-jsdoc,max-len */
var enums_1 = require("./utils/enums");
var FacilityInformation = /** @class */ (function () {
    function FacilityInformation() {
    }
    Object.defineProperty(FacilityInformation.prototype, "hfhudcode", {
        get: function () {
            return this.HFHUDCODE;
        },
        set: function (hfhudcode) {
            this.HFHUDCODE = hfhudcode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "id", {
        get: function () {
            return this.ID;
        },
        set: function (id) {
            this.ID = Number(id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "cfname", {
        get: function () {
            return this.CFNAME;
        },
        set: function (cfname) {
            this.CFNAME = cfname.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "updateddate", {
        get: function () {
            return this.UPDATEDDATE;
        },
        set: function (updateddate) {
            this.UPDATEDDATE = new Date(updateddate);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "addeddate", {
        get: function () {
            return this.ADDEDDATE;
        },
        set: function (addeddate) {
            this.ADDEDDATE = new Date(addeddate);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "reportdate", {
        get: function () {
            return this.REPORTDATE;
        },
        set: function (reportdate) {
            this.REPORTDATE = new Date(reportdate);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "icu_v", {
        get: function () {
            return this.ICU_V;
        },
        set: function (icu_v) {
            this.ICU_V = Number(icu_v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "icu_o", {
        get: function () {
            return this.ICU_O;
        },
        set: function (icu_o) {
            this.ICU_O = Number(icu_o);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "isolbed_v", {
        get: function () {
            return this.ISOLBED_V;
        },
        set: function (isolbed_v) {
            this.ISOLBED_V = Number(isolbed_v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "isolbed_o", {
        get: function () {
            return this.ISOLBED_O;
        },
        set: function (isolbed_o) {
            this.ISOLBED_O = Number(isolbed_o);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "beds_ward_v", {
        get: function () {
            return this.BEDS_WARD_V;
        },
        set: function (beds_ward_v) {
            this.BEDS_WARD_V = Number(beds_ward_v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "beds_ward_o", {
        get: function () {
            return this.BEDS_WARD_O;
        },
        set: function (beds_ward_o) {
            this.BEDS_WARD_O = Number(beds_ward_o);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "mechvent_v", {
        get: function () {
            return this.MECHVENT_V;
        },
        set: function (mechvent_v) {
            this.MECHVENT_V = Number(mechvent_v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "mechvent_o", {
        get: function () {
            return this.MECHVENT_O;
        },
        set: function (mechvent_o) {
            this.MECHVENT_O = Number(mechvent_o);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "icu_v_nc", {
        get: function () {
            return this.ICU_V_NC;
        },
        set: function (icu_v_nc) {
            this.ICU_V_NC = Number(icu_v_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "icu_o_nc", {
        get: function () {
            return this.ICU_O_NC;
        },
        set: function (icu_o_nc) {
            this.ICU_O_NC = Number(icu_o_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "nonicu_v_nc", {
        get: function () {
            return this.NONICU_V_NC;
        },
        set: function (nonicu_v_nc) {
            this.NONICU_V_NC = Number(nonicu_v_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "nonicu_o_nc", {
        get: function () {
            return this.NONICU_O_NC;
        },
        set: function (nonicu_o_nc) {
            this.NONICU_O_NC = Number(nonicu_o_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "mechvent_v_nc", {
        get: function () {
            return this.MECHVENT_V_NC;
        },
        set: function (mechvent_v_nc) {
            this.MECHVENT_V_NC = Number(mechvent_v_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "mechvent_o_nc", {
        get: function () {
            return this.MECHVENT_O_NC;
        },
        set: function (mechvent_o_nc) {
            this.MECHVENT_O_NC = Number(mechvent_o_nc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "qnurse", {
        get: function () {
            return this.QNURSE;
        },
        set: function (qnurse) {
            this.QNURSE = Number(qnurse);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "qdoctor", {
        get: function () {
            return this.QDOCTOR;
        },
        set: function (qdoctor) {
            this.QDOCTOR = Number(qdoctor);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "qother", {
        get: function () {
            return this.QOTHER;
        },
        set: function (qother) {
            this.QOTHER = Number(qother);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "nurse_adm", {
        get: function () {
            return this.NURSE_ADM;
        },
        set: function (nurse_adm) {
            this.NURSE_ADM = Number(nurse_adm);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "doctor_adm", {
        get: function () {
            return this.DOCTOR_ADM;
        },
        set: function (doctor_adm) {
            this.DOCTOR_ADM = Number(doctor_adm);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "other_adm", {
        get: function () {
            return this.OTHER_ADM;
        },
        set: function (other_adm) {
            this.OTHER_ADM = Number(other_adm);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "susp_asym", {
        get: function () {
            return this.SUSP_ASYM;
        },
        set: function (susp_asym) {
            this.SUSP_ASYM = Number(susp_asym);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "susp_mild", {
        get: function () {
            return this.SUSP_MILD;
        },
        set: function (susp_mild) {
            this.SUSP_MILD = Number(susp_mild);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "susp_severe", {
        get: function () {
            return this.SUSP_SEVERE;
        },
        set: function (susp_severe) {
            this.SUSP_SEVERE = Number(susp_severe);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "susp_crit", {
        get: function () {
            return this.SUSP_CRIT;
        },
        set: function (susp_crit) {
            this.SUSP_CRIT = Number(susp_crit);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "susp_died", {
        get: function () {
            return this.SUSP_DIED;
        },
        set: function (susp_died) {
            this.SUSP_DIED = Number(susp_died);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "prob_asym", {
        get: function () {
            return this.PROB_ASYM;
        },
        set: function (prob_asym) {
            this.PROB_ASYM = Number(prob_asym);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "prob_mild", {
        get: function () {
            return this.PROB_MILD;
        },
        set: function (prob_mild) {
            this.PROB_MILD = Number(prob_mild);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "prob_severe", {
        get: function () {
            return this.PROB_SEVERE;
        },
        set: function (prob_severe) {
            this.PROB_SEVERE = Number(prob_severe);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "prob_crit", {
        get: function () {
            return this.PROB_CRIT;
        },
        set: function (prob_crit) {
            this.PROB_CRIT = Number(prob_crit);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "prob_died", {
        get: function () {
            return this.PROB_DIED;
        },
        set: function (prob_died) {
            this.PROB_DIED = Number(prob_died);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "conf_asym", {
        get: function () {
            return this.CONF_ASYM;
        },
        set: function (conf_asym) {
            this.CONF_ASYM = Number(conf_asym);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "conf_mild", {
        get: function () {
            return this.CONF_MILD;
        },
        set: function (conf_mild) {
            this.CONF_MILD = Number(conf_mild);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "conf_severe", {
        get: function () {
            return this.CONF_SEVERE;
        },
        set: function (conf_severe) {
            this.CONF_SEVERE = Number(conf_severe);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "conf_crit", {
        get: function () {
            return this.CONF_CRIT;
        },
        set: function (conf_crit) {
            this.CONF_CRIT = Number(conf_crit);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "conf_died", {
        get: function () {
            return this.CONF_DIED;
        },
        set: function (conf_died) {
            this.CONF_DIED = Number(conf_died);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "tpatient_adm", {
        get: function () {
            return this.TPATIENT_ADM;
        },
        set: function (tpatient_adm) {
            this.TPATIENT_ADM = Number(tpatient_adm);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "tpatient_er", {
        get: function () {
            return this.TPATIENT_ER;
        },
        set: function (tpatient_er) {
            this.TPATIENT_ER = Number(tpatient_er);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "tpatient_icu", {
        get: function () {
            return this.TPATIENT_ICU;
        },
        set: function (tpatient_icu) {
            this.TPATIENT_ICU = Number(tpatient_icu);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "trans_ttmf", {
        get: function () {
            return this.TRANS_TTMF;
        },
        set: function (trans_ttmf) {
            this.TRANS_TTMF = Number(trans_ttmf);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "discharged", {
        get: function () {
            return this.DISCHARGED;
        },
        set: function (discharged) {
            this.DISCHARGED = Number(discharged);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "region", {
        get: function () {
            return this.REGION;
        },
        set: function (region) {
            this.REGION = region.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "region_psgc", {
        get: function () {
            return this.REGION_PSGC;
        },
        set: function (region_psgc) {
            this.REGION_PSGC = region_psgc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "province", {
        get: function () {
            return this.PROVINCE;
        },
        set: function (province) {
            this.PROVINCE = province.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "province_psgc", {
        get: function () {
            return this.PROVINCE_PSGC;
        },
        set: function (province_psgc) {
            this.PROVINCE_PSGC = province_psgc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "city_mun", {
        get: function () {
            return this.CITY_MUN;
        },
        set: function (city_mun) {
            this.CITY_MUN = city_mun.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "city_mun_psgc", {
        get: function () {
            return this.CITY_MUN_PSGC;
        },
        set: function (city_mun_psgc) {
            this.CITY_MUN_PSGC = city_mun_psgc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "north_coord", {
        get: function () {
            return this.NORTH_COORD;
        },
        set: function (north_coord) {
            this.NORTH_COORD = north_coord;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FacilityInformation.prototype, "east_coord", {
        get: function () {
            return this.EAST_COORD;
        },
        set: function (east_coord) {
            this.EAST_COORD = east_coord;
        },
        enumerable: false,
        configurable: true
    });
    FacilityInformation.getFilename = function () {
        return enums_1.DOWNLOADED_FILE_ALIASES.DAILY_REPORT;
    };
    return FacilityInformation;
}());
exports.default = FacilityInformation;
//# sourceMappingURL=FacilityInformation.js.map