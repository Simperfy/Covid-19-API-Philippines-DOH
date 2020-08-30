/* eslint-disable max-len,require-jsdoc */
import CaseInformation from '../CaseInformation';
import FacilityInformation from '../FacilityInformation';
import path from 'path';
import fs from 'fs';

/**
 * @param {Object[]} arr
 * @param {String} arr.id
 * @param {String} arr.name
 * @param {String[]} filesToDL
 * @return {Object[]} res
 */
export function getRequiredFiles(arr: any[], filesToDL: string[]) : any {
  return arr.filter((file) => {
    let result = false;
    filesToDL.forEach((fl) => {
      if (-1 !== file.name.search(fl)) {
        result = true;
      }
    });
    return result;
  });
}

export function getCSVInfoObj(csBatchArr: any): any {
  const csvOBJ: any = {
    csvArr: [],
    csvDbName: '',
  };

  if (csBatchArr[0] instanceof CaseInformation) {
    csvOBJ.csvDbName = 'case_informations';
    csBatchArr.forEach((data: any) => {
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
        'region_res': exports.getRegionAlias(data.RegionRes),
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

    csBatchArr.forEach((data: any) => {
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
        'region': exports.getRegionAlias(data.region),
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
}

export function filterLatestFacilityData(arr: any[]): any {
  // group array by hfhudcode
  const grpObj = arr.reduce(function(rv, x) {
    (rv[x['HFHUDCODE']] = rv[x['HFHUDCODE']] || []).push(x);
    return rv;
  }, {});

  // function to get most recent updateddate
  const mostRecentDate = (arr: any) => new Date(Math.max.apply(null, arr.map( (el: any) => {
    return new Date(el.updateddate);
  })));

  // function to get object with most recent updateddate
  const mostRecentObject = (arr: any) => arr.filter( (el: any) => {
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
}

export function deleteTmpFolder(): any {
  const filePath = path.join(__dirname, '/../../tmp');
  fs.stat(filePath, (err, stats) => {
    if (err) return console.log(`tmp folder stat: ${err.message}`);
    fs.rmdir(filePath, {recursive: true}, (err) => {
      if (err) return console.log(`Failed to delete files in tmp: ${err.message}`);
      console.log(`${filePath} is deleted!`);
    });
  });
}

export function getRegionAlias(region: string): any {
  // alias : [matchers]
  const aliasArr: any = [
    {'barmm': ['BARMM', 'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)']},
    {'car': ['CAR', 'CORDILLERA ADMINISTRA TIVE REGION (CAR)']},
    {'caraga': ['CARAGA', 'REGION XIII (CARAGA)']},
    {'ncr': ['NCR', 'NATIONAL CAPITAL REGION (NCR)']},
    {'region i: ilocos region': ['Region I: Ilocos Region', 'REGION I (ILOCOS REGION)']},
    {'region ii: cagayan valley': ['Region II: Cagayan Valley', 'REGION II (CAGAYAN VALLEY)']},
    {'region iii: central luzon': ['Region III: Central Luzon', 'REGION III (CENTRAL LUZON)']},
    {'region iv-a: calabarzon': ['Region IV-A: CALABARZON', 'REGION IV-A (CALABAR ZON)']},
    {'region iv-b: mimaropa': ['Region IV-B: MIMAROPA', 'REGION IV-B (MIMAROPA)']},
    {'region ix: zamboanga peninsula': ['Region IX: Zamboanga Peninsula', 'REGION IX (ZAMBOANGA PENINSULA)']},
    {'region v: bicol region': ['Region V: Bicol Region', 'REGION V (BICOL REGION)']},
    {'region vi: western visayas': ['Region VI: Western Visayas', 'REGION VI (WESTERN VISAYAS)']},
    {'region vii: central visayas': ['Region VII: Central Visayas', 'REGION VII (CENTRAL VISAYAS)']},
    {'region viii: eastern visayas': ['Region VIII: Eastern Visayas', 'REGION VIII (EASTERN VISAYAS)']},
    {'region x: northern mindanao': ['Region X: Northern Mindanao', 'REGION X (NORTHERN MINDANAO)']},
    {'region xi: davao region': ['Region XI: Davao Region', 'REGION XI (DAVAO REGION)']},
    {'region xii: soccsksargen': ['Region XII: SOCCSKSARGEN', 'REGION XII (SOCCSKSA RGEN)']},
    {'repatriate': ['REPATRIATE']},
    {'': ['']},
  ];

  for (const objA of (aliasArr)) {
    for (const aliasesKey of Object.keys(objA)) {
      for (const alias of objA[aliasesKey]) {
        if (region.toLowerCase() === alias.toLowerCase()) return aliasesKey;
      }
    }
  }

  throw (Error('ERROR: ALIAS NOT FOUND FOR: ' + region));
}
