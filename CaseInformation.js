class CaseInformation {
    set CaseCode(CaseCode) {
        this._CaseCode = CaseCode;
    }

    get CaseCode() {
        return this._CaseCode
    }

    set Age(Age) {
        this._Age = Age;
    }

    get Age() {
        return this._Age
    }

    set AgeGroup(AgeGroup) {
        this._AgeGroup = AgeGroup;
    }

    get AgeGroup() {
        return this._AgeGroup
    }

    set Sex(Sex) {
        this._Sex = Sex;
    }

    get Sex() {
        return this._Sex
    }

    set DateSpecimen(DateSpecimen) {
        this._DateSpecimen = DateSpecimen;
    }

    get DateSpecimen() {
        return this._DateSpecimen
    }

    set DateResultRelease(DateResultRelease) {
        this._DateResultRelease = DateResultRelease;
    }

    get DateResultRelease() {
        return this._DateResultRelease
    }

    set DateRepConf(DateRepConf) {
        this._DateRepConf = DateRepConf;
    }

    get DateRepConf() {
        return this._DateRepConf
    }

    set DateDied(DateDied) {
        this._DateDied = DateDied;
    }

    get DateDied() {
        return this._DateDied
    }

    set DateRecover(DateRecover) {
        this._DateRecover = DateRecover;
    }

    get DateRecover() {
        return this._DateRecover
    }

    set RcsovalType(RcsovalType) {
        this._RcsovalType = RcsovalType;
    }

    get RcsovalType() {
        return this._RcsovalType
    }

    set Admitted(Admitted) {
        this._Admitted = Admitted;
    }

    get Admitted() {
        return this._Admitted
    }

    set RegionRes(RegionRes) {
        this._RegionRes = RegionRes;
    }

    get RegionRes() {
        return this._RegionRes
    }

    set ProvRes(ProvRes) {
        this._ProvRes = ProvRes;
    }

    get ProvRes() {
        return this._ProvRes
    }

    set CityMunRes(CityMunRes) {
        this._CityMunRes = CityMunRes;
    }

    get CityMunRes() {
        return this._CityMunRes
    }

    set CityMuniPSGC(CityMuniPSGC) {
        this._CityMuniPSGC = CityMuniPSGC;
    }

    get CityMuniPSGC() {
        return this._CityMuniPSGC
    }

    set HealthStatus(HealthStatus) {
        this._HealthStatus = HealthStatus;
    }

    get HealthStatus() {
        return this._HealthStatus
    }

    set Quarantined(Quarantined) {
        this._Quarantined = Quarantined;
    }

    get Quarantined() {
        return this._Quarantined
    }

    set DateOnset(DateOnset) {
        this._DateOnset = DateOnset;
    }

    get DateOnset() {
        return this._DateOnset
    }

    set Pregnanttab(Pregnanttab) {
        this._Pregnanttab = Pregnanttab;
    }

    get Pregnanttab() {
        return this._Pregnanttab
    }

    set ValidationStatus(ValidationStatus) {
        this._ValidationStatus = ValidationStatus;
    }

    get ValidationStatus() {
        return this._ValidationStatus
    }

    constructor() {}
}

let CaseInformations = [];

const csv = require('csvtojson')
// Invoking csv returns a promise
const converter = csv()
    .fromFile('./tmp/Data.csv')
    .then((json) => {
        let c;
        let i = 0;
        json.forEach((row) => {
            if (i > 100) return;
            console.log(row);
            c = new CaseInformation();
            Object.assign(c, row);
            CaseInformations.push(c);
            i++;
        });
    }).then(() => {
        // Output the names of the CaseInformationss
        CaseInformations.forEach((cs) => {
            console.log(cs.CaseCode);// Invoke the Name getter
        });
    });