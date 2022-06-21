const { ApolloServer }=require("apollo-server")
const { typeDefs }=require('./src/graphql/schema/typeDef')
const { resolvers }=require('./src/graphql/resolvers/resolver')

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});