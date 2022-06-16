const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const GraphQLDate = require("graphql-date");

const UserType = new GraphQLObjectType({
  name: "user",
  description: "This represent users",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
    refreshtoken: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: GraphQLNonNull(GraphQLDate) },
  }),
});

const BlogType = new GraphQLObjectType({
  name: "blogs",
  description: "This represent all blogs",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    blog_post: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = { UserType, BlogType };
