/* eslint-disable require-jsdoc,max-len */
import {DOWNLOADED_FILE_ALIASES} from './utils/enums';
class CaseInformation {
  [key: string]: any;

  set CaseCode(caseCode) {
    this.caseCode = caseCode;
  }

  get CaseCode() {
    return this.caseCode;
  }

  set Age(age) {
    this.age = (age === '') ? 0 : parseInt(age);
  }

  get Age() {
    return this.age;
  }

  set AgeGroup(ageGroup) {
    this.ageGroup = ageGroup.replace(' to ', '-');
  }

  get AgeGroup() {
    return this.ageGroup;
  }

  set Sex(sex) {
    this.sex = sex.toLowerCase();
  }

  get Sex() {
    return this.sex;
  }

  set DateSpecimen(dateSpecimen) {
    this.dateSpecimen = dateSpecimen;
  }

  get DateSpecimen() {
    return this.dateSpecimen;
  }

  set DateResultRelease(dateResultRelease) {
    this.dateResultRelease = dateResultRelease;
  }

  get DateResultRelease() {
    return this.dateResultRelease;
  }

  set DateRepConf(dateRepConf) {
    this.dateRepConf = dateRepConf;
  }

  get DateRepConf() {
    return this.dateRepConf;
  }

  set DateDied(dateDied) {
    this.dateDied = dateDied;
  }

  get DateDied() {
    return this.dateDied;
  }

  set DateRecover(dateRecover) {
    this.dateRecover = dateRecover;
  }

  get DateRecover() {
    return this.dateRecover;
  }

  set RemovalType(removalType) {
    this.removalType = removalType.toLowerCase();
  }

  get RemovalType() {
    return this.removalType;
  }

  set Admitted(admitted) {
    this.admitted = admitted.toLowerCase();
  }

  get Admitted() {
    return this.admitted;
  }

  set RegionRes(regionRes) {
    this.regionRes = regionRes.toLowerCase();
  }

  get RegionRes() {
    return this.regionRes;
  }

  set ProvRes(provRes) {
    this.provRes = provRes.toLowerCase();
  }

  get ProvRes() {
    return this.provRes;
  }

  set CityMunRes(cityMunRes) {
    this.cityMunRes = cityMunRes.toLowerCase();
  }

  get CityMunRes() {
    return this.cityMunRes;
  }

  set CityMuniPSGC(cityMuniPSGC) {
    this.cityMuniPSGC = cityMuniPSGC;
  }

  get CityMuniPSGC() {
    return this.cityMuniPSGC;
  }

  set HealthStatus(healthStatus) {
    this.healthStatus = healthStatus.toLowerCase();
  }

  get HealthStatus() {
    return this.healthStatus;
  }

  set Quarantined(quarantined) {
    this.quarantined = quarantined.toLowerCase();
  }

  get Quarantined() {
    return this.quarantined;
  }

  set DateOnset(dateOnset) {
    this.dateOnset = dateOnset;
  }

  get DateOnset() {
    return this.dateOnset;
  }

  set Pregnanttab(pregnanttab) {
    this.pregnanttab = pregnanttab.toLowerCase();
  }

  get Pregnanttab() {
    return this.pregnanttab;
  }

  set ValidationStatus(validationStatus) {
    this.validationStatus = validationStatus;
  }

  get ValidationStatus() {
    return this.validationStatus;
  }

  static getFilename() {
    return DOWNLOADED_FILE_ALIASES.CASE_INFORMATION;
  }
}

export default CaseInformation;
