const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const router = express.Router();
const {
  GET_ALL_USERS,
  GET_ALL_BLOGS,
  GET_ALL_POST,
  GET_POST,
} = require("./Query/query");
const {
  UPDATE_USER,
  DELETE_USER,
  CREATE_POST,
  UPDATE_POST,
  DELTE_POST,
  SIGNUP,
  LOGIN_USER,
  CHANGE_PASS,
} = require("./Mutation/mutation");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUser: GET_ALL_USERS,
    getAllBlogs: GET_ALL_BLOGS,
    getAllPost: GET_ALL_POST,
    getPost: GET_POST,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updateUser: UPDATE_USER,
    deleteUser: DELETE_USER,
    createPost: CREATE_POST,
    updatePost: UPDATE_POST,
    deletePost: DELTE_POST,
    signup: SIGNUP,
    login: LOGIN_USER,
    changePassword: CHANGE_PASS,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

router.use(
  "/",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
