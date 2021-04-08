/* eslint-disable semi */
/* eslint-disable no-extra-semi */
/* eslint-disable camelcase */
import { Document } from 'mongoose';

export default interface IFacilityInformationModel extends Document {
  hfhudcode: string,
  cf_name: string,
  updated_date: Date,
  added_date: Date,
  report_date: Date,
  icu_v: number,
  icu_o: number,
  isolbed_v: number,
  isolbed_o: number,
  beds_ward_v: number,
  beds_ward_o: number,
  mechvent_v: number,
  mechvent_o: number,
  icu_v_nc: number,
  icu_o_nc: number,
  nonicu_v_nc: number,
  nonicu_o_nc: number,
  mechvent_v_nc: number,
  mechvent_o_nc: number,
  q_nurse: number,
  q_doctor: number,
  q_other: number,
  nurse_adm: number,
  doctor_adm: number,
}
