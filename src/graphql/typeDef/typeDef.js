const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const GraphQLDate = require("graphql-date");

// It describe the user table in the database
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

// It describe the blog table in the database
const BlogType = new GraphQLObjectType({
  name: "blogs",
  description: "This represent all blogs",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: GraphQLNonNull(GraphQLDate) },
    userId: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

// This represent a particular blogs
const GetPostType = new GraphQLObjectType({
  name: "GetPost",
  description: "This represent a particular blogs",
  fields: () => ({
    post: { type: GraphQLNonNull(GraphQLString) },
  }),
});

// This will shohw all blogs of a user
const GetAllPostType = new GraphQLObjectType({
  name: "GetAllPost",
  description: "This will shohw all blogs of a user",
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = { UserType, BlogType, GetPostType, GetAllPostType };
