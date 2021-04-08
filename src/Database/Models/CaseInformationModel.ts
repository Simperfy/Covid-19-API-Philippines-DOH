import mongoose, { Schema } from 'mongoose';
import ICaseInformationModel from './Interface/ICaseInformationModel';
import { DB_NAMES } from '../../utils/enums';

const dateType = {
  type: String,
  default: '',
};

const lowerStringType = {
  type: String,
  trim: true,
  lowercase: true,
  default: '',
};

const schema = new Schema({
  case_code: {
    type: String,
    trim: true,
    uppercase: true,
    default: '',
  },
  age: {
    type: Number,
    default: -1,
  },
  age_group: lowerStringType,
  sex: lowerStringType,
  date_specimen: dateType,
  date_result_release: dateType,
  date_rep_conf: dateType,
  date_died: dateType,
  date_recover: dateType,
  removal_type: lowerStringType,
  admitted: lowerStringType,
  region_res: lowerStringType,
  prov_res: lowerStringType,
  city_mun_res: lowerStringType,
  city_muni_psgc: lowerStringType,
  health_status: lowerStringType,
  quarantined: lowerStringType,
  date_onset: lowerStringType,
  pregnant_tab: lowerStringType,
});

export default mongoose.model<ICaseInformationModel>('CaseInformation', schema, DB_NAMES.CASE_INFORMATION.toString());
