// Provide resolver functions for your schema fields
import { IResolvers } from 'apollo-server-express';
import { CaseInformationModel } from '../Database/Models';

const resolvers: IResolvers = {
  Query: {
    hello: () => 'Hello world!',
    // eslint-disable-next-line arrow-body-style
    caseInformation: (root, { limit, offset }) => {
      if (offset < 0) throw Error('offset must be greater than or equal to 0');
      if (limit <= 0) throw Error('limit must be greater than 0');
      if (limit > 10000) throw Error('limit must not exceed 10000');

      return CaseInformationModel
        .find({})
        .limit(limit)
        .skip(offset)
        .limit(1000);
    },
  },
};
export default resolvers;
