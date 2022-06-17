const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const MessageType = new GraphQLObjectType({
  name: "Message",
  description: "Message will shown",
  fields: () => ({
    successful: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  }),
});

module.exports = MessageType