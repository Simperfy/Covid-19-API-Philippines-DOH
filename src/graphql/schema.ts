/* eslint-disable max-len */
import { schemaComposer } from 'graphql-compose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { CaseInformationModel, FacilityInformationModel } from '../Database/Models';

// TODO: Implement a util function to automate "schemaComposer.Query.addFields"

const CaseInformationTC = composeMongoose(CaseInformationModel, {});
const FacilityInformationTC = composeMongoose(FacilityInformationModel, {});

// TODO: Add limit to "limit field"
schemaComposer.Query.addFields({
  CaseInformation: CaseInformationTC.mongooseResolvers.pagination({ findManyOpts: { lean: true } }),
  FacilityInformation: FacilityInformationTC.mongooseResolvers.pagination({ findManyOpts: { lean: true } }),
});

export default schemaComposer.buildSchema();
