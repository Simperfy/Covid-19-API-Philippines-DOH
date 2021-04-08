import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Query {
  caseInformation(first: Int, offset: Int): [CaseInformation!]!
  facilityInformation(first: Int, offset: Int): [FacilityInformation!]!
}

type CaseInformation {
  case_code: String
  age: Int
  age_group: String
  sex: String
  date_specimen: String
  date_result_release: String
  date_rep_conf: String
  date_died: String
  date_recover: String
  removal_type: String
  admitted: String
  region_res: String
  prov_res: String
  city_mun_res: String
  city_muni_psgc: String
  health_status: String
  quarantined: String
  date_onset: String
  pregnant_tab: String
}

type FacilityInformation {
  hfhudcode: String
  cf_name: String
  updated_date: String
  added_date: String
  report_date: String
  icu_v: Int
  icu_o: Int
  isolbed_v: Int
  isolbed_o: Int
  beds_ward_v: Int
  beds_ward_o: Int
  mechvent_v: Int
  mechvent_o: Int
  icu_v_nc: Int
  icu_o_nc: Int
  nonicu_v_nc: Int
  nonicu_o_nc: Int
  mechvent_v_nc: Int
  mechvent_o_nc: Int
  q_nurse: Int
  q_doctor: Int
  q_other: Int
  nurse_adm: Int
  doctor_adm: Int
}
`;

export default typeDefs;
