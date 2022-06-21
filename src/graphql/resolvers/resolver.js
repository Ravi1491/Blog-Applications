const { QueryResolvers } = require("./query");
const { MutationResolvers } = require("./mutation");

const resolvers = [QueryResolvers, MutationResolvers];

module.exports = { resolvers };