import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:4000/graphql"
  }),
  cache: new InMemoryCache(),
});
  //gugi
export default client;