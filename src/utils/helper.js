/* eslint-disable max-len */
const CaseInformation = require('../CaseInformation');
const FacilityInformation = require('../FacilityInformation');

/**
 * @param {Object[]} arr
 * @param {String} arr.id
 * @param {String} arr.name
 * @param {String[]} filesToDL
 * @return {Object[]} res
 */
exports.getRequiredFiles = (arr, filesToDL) => arr.filter((file) => {
  let result = false;
  filesToDL.forEach((fl) => {
    if (-1 !== file.name.search(fl)) {
      result = true;
    }
  });
  return result;
});

exports.getCSVInfoObj = (csBatchArr) => {
  const csvOBJ = {
    csvArr: [],
    csvDbName: '',
  };

  if (csBatchArr[0] instanceof CaseInformation) {
    csvOBJ.csvDbName = 'case_informations';
    csBatchArr.forEach((data) => {
      csvOBJ.csvArr.push({
        'case_code': data.CaseCode,
        'age': data.Age,
        'age_group': data.AgeGroup,
        'sex': data.Sex,
        'date_specimen': data.DateSpecimen,
        'date_result_release': data.DateResultRelease,
        'date_rep_conf': data.DateRepConf,
        'date_died': data.DateDied,
        'date_recover': data.DateRecover,
        'removal_type': data.RemovalType,
        'admitted': data.Admitted,
        'region_res': data.RegionRes,
        'prov_res': data.ProvRes,
        'city_mun_res': data.CityMunRes,
        'city_muni_psgc': data.CityMuniPSGC,
        'health_status': data.HealthStatus,
        'quarantined': data.Quarantined,
        'date_onset': data.DateOnset,
        'pregnant_tab': data.Pregnanttab,
        // 'validation_status': data.ValidationStatus,
      });
    });
  } else if (csBatchArr[0] instanceof FacilityInformation) {
    csvOBJ.csvDbName = 'facility_informations';

    csBatchArr.forEach((data) => {
      csvOBJ.csvArr.push({
        'hfhudcode': data.hfhudcode,
        // 'id': data.id,
        'cf_name': data.cfname,
        'updated_date': data.updateddate,
        'added_date': data.addeddate,
        'report_date': data.reportdate,
        'icu_v': data.icu_v,
        'icu_o': data.icu_o,
        'isolbed_v': data.isolbed_v,
        'isolbed_o': data.isolbed_o,
        'beds_ward_v': data.beds_ward_v,
        'beds_ward_o': data.beds_ward_o,
        'mechvent_v': data.mechvent_v,
        'mechvent_o': data.mechvent_o,
        'icu_v_nc': data.icu_v_nc,
        'icu_o_nc': data.icu_o_nc,
        'nonicu_v_nc': data.nonicu_v_nc,
        'nonicu_o_nc': data.nonicu_o_nc,
        'mechvent_v_nc': data.mechvent_v_nc,
        'mechvent_o_nc': data.mechvent_o_nc,
        'q_nurse': data.qnurse,
        'q_doctor': data.qdoctor,
        'q_other': data.qother,
        'nurse_adm': data.nurse_adm,
        'doctor_adm': data.doctor_adm,
        'other_adm': data.other_adm,
        'susp_asym': data.susp_asym,
        'susp_mild': data.susp_mild,
        'susp_severe': data.susp_severe,
        'susp_crit': data.susp_crit,
        'susp_died': data.susp_died,
        'prob_asym': data.prob_asym,
        'prob_mild': data.prob_mild,
        'prob_severe': data.prob_severe,
        'prob_crit': data.prob_crit,
        'prob_died': data.prob_died,
        'conf_asym': data.conf_asym,
        'conf_mild': data.conf_mild,
        'conf_severe': data.conf_severe,
        'conf_crit': data.conf_crit,
        'conf_died': data.conf_died,
        't_patient_adm': data.tpatient_adm,
        't_patient_er': data.tpatient_er,
        't_patient_icu': data.tpatient_icu,
        'trans_ttmf': data.trans_ttmf, // Temporary Treatment and Monitoring Facilities
        'discharged': data.discharged,
        'region': data.region,
        'region_psgc': data.region_psgc,
        'province': data.province,
        'province_psgc': data.province_psgc,
        'city_mun': data.city_mun,
        'city_mun_psgc': data.city_mun_psgc,
        'north_coord': data.north_coord,
        'east_coord': data.east_coord,
      });
    });
  } else {
    throw new Error('Cannot determine CSV Database name');
  }


  return csvOBJ;
};

exports.filterLatestFacilityData = (arr) => {
  // group array by hfhudcode
  const grpObj = arr.reduce(function(rv, x) {
    (rv[x['HFHUDCODE']] = rv[x['HFHUDCODE']] || []).push(x);
    return rv;
  }, {});

  // function to get most recent updateddate
  const mostRecentDate = (arr) => new Date(Math.max.apply(null, arr.map( (el) => {
    return new Date(el.updateddate);
  })));

  // function to get object with most recent updateddate
  const mostRecentObject = (arr) => arr.filter( (el) => {
    const d = new Date( el.updateddate );
    return d.getTime() === mostRecentDate(arr).getTime();
  })[0];

  const newArr = [];

  // get the most updated record in each group objects
  // store the result to the resulting array
  for (const key of Object.keys(grpObj)) {
    const res = mostRecentObject(grpObj[key]);
    newArr.push(res);
  }

  // console.log(newArr.filter((a) => a.hfhudcode === 'DOH000000000005796'));
  return newArr;
};
