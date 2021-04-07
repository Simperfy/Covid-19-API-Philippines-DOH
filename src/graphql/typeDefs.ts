import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Query {
  hello: String
  caseInformation(limit: Int!, offset: Int!): [CaseInformation!]!
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
`;

export default typeDefs;
