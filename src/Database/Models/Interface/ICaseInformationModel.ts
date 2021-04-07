/* eslint-disable semi */
/* eslint-disable no-extra-semi */
/* eslint-disable camelcase */
import { Document } from 'mongoose';

export default interface ICaseInformationModel extends Document {
  case_code: string
  age: number
  age_group: string,
  sex: string,
  date_specimen: Date,
  date_result_release: Date,
  date_rep_conf: Date,
  date_died: Date,
  date_recover: Date,
  removal_type: string,
  admitted: string,
  region_res: string,
  prov_res: string,
  city_mun_res: string,
  city_muni_psgc: string,
  health_status: string,
  quarantined: string,
  date_onset: string,
  pregnant_tab: string,
}
