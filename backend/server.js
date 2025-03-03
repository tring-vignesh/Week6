import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {typeDefs} from "./graphql/typeDefs.js";
import {resolvers} from "./graphql/resolvers.js";
import cors from "cors";
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
   
  });
  console.log(`Server ready at: ${url}`);