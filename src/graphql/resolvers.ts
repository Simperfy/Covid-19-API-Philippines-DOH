// Provide resolver functions for your schema fields
import { IResolvers } from 'apollo-server-express';
import { CaseInformationModel, FacilityInformationModel } from '../Database/Models';
import createResolvers from '../utils/createResolvers';

const resolvers: IResolvers = {
  Query: {
    caseInformation: createResolvers(CaseInformationModel),
    facilityInformation: createResolvers(FacilityInformationModel),
  },
};

export default resolvers;
