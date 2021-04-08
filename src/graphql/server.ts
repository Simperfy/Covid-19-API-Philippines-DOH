import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const server = new ApolloServer({ schema });

export default server;
