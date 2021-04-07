import mongoose, { Schema } from 'mongoose';
import IFacilityInformationModel from './Interface/IFacilityInformationModel';
import { DB_NAMES } from '../../utils/enums';

const dateType = {
  type: Date,
  default: null,
};

const numberType = {
  type: Number,
  default: 0,
};

const schema = new Schema({
  hfhudcode: {
    type: String,
    trim: true,
    uppercase: true,
    default: '',
  },
  cf_name: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  updated_date: dateType,
  added_date: dateType,
  report_date: dateType,
  icu_v: numberType,
  icu_o: numberType,
  isolbed_v: numberType,
  isolbed_o: numberType,
  beds_ward_v: numberType,
  beds_ward_o: numberType,
  mechvent_v: numberType,
  mechvent_o: numberType,
  icu_v_nc: numberType,
  icu_o_nc: numberType,
  nonicu_v_nc: numberType,
  nonicu_o_nc: numberType,
  mechvent_v_nc: numberType,
  mechvent_o_nc: numberType,
  q_nurse: numberType,
  q_doctor: numberType,
  q_other: numberType,
  nurse_adm: numberType,
  doctor_adm: numberType,
});

export default mongoose.model<IFacilityInformationModel>('FacilityInformation', schema, DB_NAMES.FACILITY_INFORMATION.toString());
