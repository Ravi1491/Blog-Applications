const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema } = require("graphql");
const router = express.Router();
const RootQueryType = require("./query")
const RootMutationType = require("./mutation")

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

router.use("/", expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
