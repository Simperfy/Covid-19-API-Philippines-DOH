import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';

export default function getGraphQLFields(
  info: GraphQLResolveInfo,
  fieldPath: any = null,
) {
  const selections = graphqlFields(info);

  const mongooseSelection = Object
    .keys(fieldPath ? selections[fieldPath] : selections)
    .reduce((oldKeys, key) => ({ ...oldKeys, [key]: 1 }), {});

  return mongooseSelection;
}
