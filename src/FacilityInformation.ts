/* eslint-disable camelcase,require-jsdoc,max-len */
import {DOWNLOADED_FILE_ALIASES} from './utils/enums';

class FacilityInformation {
  [key: string]: any;

  set hfhudcode(hfhudcode) {
    this.HFHUDCODE = hfhudcode;
  }
  get hfhudcode() {
    return this.HFHUDCODE;
  }
  set id(id) {
    this.ID = Number(id);
  }
  get id() {
    return this.ID;
  }
  set cfname(cfname) {
    this.CFNAME = cfname.toLowerCase();
  }
  get cfname() {
    return this.CFNAME;
  }
  set updateddate(updateddate) {
    this.UPDATEDDATE = new Date(updateddate);
  }
  get updateddate() {
    return this.UPDATEDDATE;
  }
  set addeddate(addeddate) {
    this.ADDEDDATE = new Date(addeddate);
  }
  get addeddate() {
    return this.ADDEDDATE;
  }
  set reportdate(reportdate) {
    this.REPORTDATE = new Date(reportdate);
  }
  get reportdate() {
    return this.REPORTDATE;
  }
  set icu_v(icu_v) {
    this.ICU_V = Number(icu_v);
  }
  get icu_v() {
    return this.ICU_V;
  }
  set icu_o(icu_o) {
    this.ICU_O = Number(icu_o);
  }
  get icu_o() {
    return this.ICU_O;
  }
  set isolbed_v(isolbed_v) {
    this.ISOLBED_V = Number(isolbed_v);
  }
  get isolbed_v() {
    return this.ISOLBED_V;
  }
  set isolbed_o(isolbed_o) {
    this.ISOLBED_O = Number(isolbed_o);
  }
  get isolbed_o() {
    return this.ISOLBED_O;
  }
  set beds_ward_v(beds_ward_v) {
    this.BEDS_WARD_V = Number(beds_ward_v);
  }
  get beds_ward_v() {
    return this.BEDS_WARD_V;
  }
  set beds_ward_o(beds_ward_o) {
    this.BEDS_WARD_O = Number(beds_ward_o);
  }
  get beds_ward_o() {
    return this.BEDS_WARD_O;
  }
  set mechvent_v(mechvent_v) {
    this.MECHVENT_V = Number(mechvent_v);
  }
  get mechvent_v() {
    return this.MECHVENT_V;
  }
  set mechvent_o(mechvent_o) {
    this.MECHVENT_O = Number(mechvent_o);
  }
  get mechvent_o() {
    return this.MECHVENT_O;
  }
  set icu_v_nc(icu_v_nc) {
    this.ICU_V_NC = Number(icu_v_nc);
  }
  get icu_v_nc() {
    return this.ICU_V_NC;
  }
  set icu_o_nc(icu_o_nc) {
    this.ICU_O_NC = Number(icu_o_nc);
  }
  get icu_o_nc() {
    return this.ICU_O_NC;
  }
  set nonicu_v_nc(nonicu_v_nc) {
    this.NONICU_V_NC = Number(nonicu_v_nc);
  }
  get nonicu_v_nc() {
    return this.NONICU_V_NC;
  }
  set nonicu_o_nc(nonicu_o_nc) {
    this.NONICU_O_NC = Number(nonicu_o_nc);
  }
  get nonicu_o_nc() {
    return this.NONICU_O_NC;
  }
  set mechvent_v_nc(mechvent_v_nc) {
    this.MECHVENT_V_NC = Number(mechvent_v_nc);
  }
  get mechvent_v_nc() {
    return this.MECHVENT_V_NC;
  }
  set mechvent_o_nc(mechvent_o_nc) {
    this.MECHVENT_O_NC = Number(mechvent_o_nc);
  }
  get mechvent_o_nc() {
    return this.MECHVENT_O_NC;
  }
  set qnurse(qnurse) {
    this.QNURSE = Number(qnurse);
  }
  get qnurse() {
    return this.QNURSE;
  }
  set qdoctor(qdoctor) {
    this.QDOCTOR = Number(qdoctor);
  }
  get qdoctor() {
    return this.QDOCTOR;
  }
  set qother(qother) {
    this.QOTHER = Number(qother);
  }
  get qother() {
    return this.QOTHER;
  }
  set nurse_adm(nurse_adm) {
    this.NURSE_ADM = Number(nurse_adm);
  }
  get nurse_adm() {
    return this.NURSE_ADM;
  }
  set doctor_adm(doctor_adm) {
    this.DOCTOR_ADM = Number(doctor_adm);
  }
  get doctor_adm() {
    return this.DOCTOR_ADM;
  }
  set other_adm(other_adm) {
    this.OTHER_ADM = Number(other_adm);
  }
  get other_adm() {
    return this.OTHER_ADM;
  }
  set susp_asym(susp_asym) {
    this.SUSP_ASYM = Number(susp_asym);
  }
  get susp_asym() {
    return this.SUSP_ASYM;
  }
  set susp_mild(susp_mild) {
    this.SUSP_MILD = Number(susp_mild);
  }
  get susp_mild() {
    return this.SUSP_MILD;
  }
  set susp_severe(susp_severe) {
    this.SUSP_SEVERE = Number(susp_severe);
  }
  get susp_severe() {
    return this.SUSP_SEVERE;
  }
  set susp_crit(susp_crit) {
    this.SUSP_CRIT = Number(susp_crit);
  }
  get susp_crit() {
    return this.SUSP_CRIT;
  }
  set susp_died(susp_died) {
    this.SUSP_DIED = Number(susp_died);
  }
  get susp_died() {
    return this.SUSP_DIED;
  }
  set prob_asym(prob_asym) {
    this.PROB_ASYM = Number(prob_asym);
  }
  get prob_asym() {
    return this.PROB_ASYM;
  }
  set prob_mild(prob_mild) {
    this.PROB_MILD = Number(prob_mild);
  }
  get prob_mild() {
    return this.PROB_MILD;
  }
  set prob_severe(prob_severe) {
    this.PROB_SEVERE = Number(prob_severe);
  }
  get prob_severe() {
    return this.PROB_SEVERE;
  }
  set prob_crit(prob_crit) {
    this.PROB_CRIT = Number(prob_crit);
  }
  get prob_crit() {
    return this.PROB_CRIT;
  }
  set prob_died(prob_died) {
    this.PROB_DIED = Number(prob_died);
  }
  get prob_died() {
    return this.PROB_DIED;
  }
  set conf_asym(conf_asym) {
    this.CONF_ASYM = Number(conf_asym);
  }
  get conf_asym() {
    return this.CONF_ASYM;
  }
  set conf_mild(conf_mild) {
    this.CONF_MILD = Number(conf_mild);
  }
  get conf_mild() {
    return this.CONF_MILD;
  }
  set conf_severe(conf_severe) {
    this.CONF_SEVERE = Number(conf_severe);
  }
  get conf_severe() {
    return this.CONF_SEVERE;
  }
  set conf_crit(conf_crit) {
    this.CONF_CRIT = Number(conf_crit);
  }
  get conf_crit() {
    return this.CONF_CRIT;
  }
  set conf_died(conf_died) {
    this.CONF_DIED = Number(conf_died);
  }
  get conf_died() {
    return this.CONF_DIED;
  }
  set tpatient_adm(tpatient_adm) {
    this.TPATIENT_ADM = Number(tpatient_adm);
  }
  get tpatient_adm() {
    return this.TPATIENT_ADM;
  }
  set tpatient_er(tpatient_er) {
    this.TPATIENT_ER = Number(tpatient_er);
  }
  get tpatient_er() {
    return this.TPATIENT_ER;
  }
  set tpatient_icu(tpatient_icu) {
    this.TPATIENT_ICU = Number(tpatient_icu);
  }
  get tpatient_icu() {
    return this.TPATIENT_ICU;
  }
  set trans_ttmf(trans_ttmf) {
    this.TRANS_TTMF = Number(trans_ttmf);
  }
  get trans_ttmf() {
    return this.TRANS_TTMF;
  }
  set discharged(discharged) {
    this.DISCHARGED = Number(discharged);
  }
  get discharged() {
    return this.DISCHARGED;
  }
  set region(region) {
    this.REGION = region.toLowerCase();
  }
  get region() {
    return this.REGION;
  }
  set region_psgc(region_psgc) {
    this.REGION_PSGC = region_psgc;
  }
  get region_psgc() {
    return this.REGION_PSGC;
  }
  set province(province) {
    this.PROVINCE = province.toLowerCase();
  }
  get province() {
    return this.PROVINCE;
  }
  set province_psgc(province_psgc) {
    this.PROVINCE_PSGC = province_psgc;
  }
  get province_psgc() {
    return this.PROVINCE_PSGC;
  }
  set city_mun(city_mun) {
    this.CITY_MUN = city_mun.toLowerCase();
  }
  get city_mun() {
    return this.CITY_MUN;
  }
  set city_mun_psgc(city_mun_psgc) {
    this.CITY_MUN_PSGC = city_mun_psgc;
  }
  get city_mun_psgc() {
    return this.CITY_MUN_PSGC;
  }
  set north_coord(north_coord) {
    this.NORTH_COORD = north_coord;
  }
  get north_coord() {
    return this.NORTH_COORD;
  }
  set east_coord(east_coord) {
    this.EAST_COORD = east_coord;
  }
  get east_coord() {
    return this.EAST_COORD;
  }

  static getFilename() {
    return DOWNLOADED_FILE_ALIASES.DAILY_REPORT;
  }
}

export default FacilityInformation;
