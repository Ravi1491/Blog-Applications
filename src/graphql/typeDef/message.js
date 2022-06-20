const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

// It will return the message whether the query or mutation is properly run or not
const MessageType = new GraphQLObjectType({
  name: "Message",
  description: "Message will shown",
  fields: () => ({
    successful: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  }),
});

module.exports = MessageType