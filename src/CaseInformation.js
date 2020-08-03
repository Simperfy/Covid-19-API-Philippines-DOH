/* eslint-disable require-jsdoc */
class CaseInformation {
  set CaseCode(caseCode) {
    this.caseCode = caseCode;
  }

  get CaseCode() {
    return this.caseCode;
  }

  set Age(age) {
    this.age = age;
  }

  get Age() {
    return this.age === '' ? 0 : parseInt(this.age);
  }

  set AgeGroup(ageGroup) {
    this.ageGroup = ageGroup;
  }

  get AgeGroup() {
    return this.ageGroup.replace(' to ', '-');
  }

  set Sex(sex) {
    this.sex = sex;
  }

  get Sex() {
    return this.sex.toLowerCase();
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
    this.removalType = removalType;
  }

  get RemovalType() {
    return this.removalType.toLowerCase();
  }

  set Admitted(admitted) {
    this.admitted = admitted;
  }

  get Admitted() {
    return this.admitted.toLowerCase();
  }

  set RegionRes(regionRes) {
    this.regionRes = regionRes;
  }

  get RegionRes() {
    return this.regionRes;
  }

  set ProvRes(provRes) {
    this.provRes = provRes;
  }

  get ProvRes() {
    return this.provRes.toLowerCase();
  }

  set CityMunRes(cityMunRes) {
    this.cityMunRes = cityMunRes;
  }

  get CityMunRes() {
    return this.cityMunRes.toLowerCase();
  }

  set CityMuniPSGC(cityMuniPSGC) {
    this.cityMuniPSGC = cityMuniPSGC;
  }

  get CityMuniPSGC() {
    return this.cityMuniPSGC;
  }

  set HealthStatus(healthStatus) {
    this.healthStatus = healthStatus;
  }

  get HealthStatus() {
    return this.healthStatus.toLowerCase();
  }

  set Quarantined(quarantined) {
    this.quarantined = quarantined;
  }

  get Quarantined() {
    return this.quarantined.toLowerCase();
  }

  set DateOnset(dateOnset) {
    this.dateOnset = dateOnset;
  }

  get DateOnset() {
    return this.dateOnset;
  }

  set Pregnanttab(pregnanttab) {
    this.pregnanttab = pregnanttab;
  }

  get Pregnanttab() {
    return this.pregnanttab.toLowerCase();
  }

  set ValidationStatus(validationStatus) {
    this.validationStatus = validationStatus;
  }

  get ValidationStatus() {
    return this.validationStatus;
  }

  constructor() {}
}

exports.CaseInformation = CaseInformation;
