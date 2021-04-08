import { IFieldResolver } from 'apollo-server-express';
import mongoose from 'mongoose';
import getGraphQLFields from './getGraphQLFields';

export default function createResolvers(model: mongoose.Model<any>): IFieldResolver<any, any, any> {
  return (root, { first = 10000, offset = 0 }, context, info) => {
    if (offset < 0) throw Error('offset must be greater than or equal to 0');
    if (first <= 0) throw Error('first must be greater than 0');
    if (first > 10000) throw Error('first must not exceed 10000');
    const selection = getGraphQLFields(info);

    return model
      .find({})
      .select(selection)
      .limit(first)
      .skip(offset)
      .limit(1000)
      .lean();
  };
}
