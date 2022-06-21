const { gql } = require("apollo-server");

const typeDefs = gql`
  type UserType {
    id: Int!
    name: String!
    email: String!
    password: String!
    role: String!
    refreshtoken: String!
    createdAt: String!
    updatedAt: String!
  }

  type BlogType {
    id: Int!
    title: String!
    post: String!
    createdAt: String!
    updatedAt: String!
    userId: Int!
  }

  type GetPostType {
    post: String!
  }

  type GetAllPostType {
    title: String!
    post: String!
  }

  type MessageType {
    successful: Boolean!
    message: String!
  }

  #Query
  type Query {
    getAllUsers: [UserType!]!
    getAllBlogs: [BlogType!]!
    getAllPost(userId: Int!): [GetAllPostType!]!
    getPost(userId: Int!, title: String!): GetPostType!
  }

  #Mutation
  type Mutation {
    updateUser(id: Int!, name: String!, email: String!): MessageType!
    deleteUser(id: Int!): MessageType!
    createPost(id: Int!, title: String!, post: String!): MessageType!
    deletePost(userId: Int!, title: String!): MessageType!
    updatePost(userId: Int!, title: String!, post: String!): MessageType!
    signup(name: String!, email: String!, password: String!, role: String!): MessageType!
    login(email: String!, password: String!): MessageType!
    changePassword(email: String!, oldPassword: String!, newPassword: String!): MessageType!
  }
  
`;
module.exports = { typeDefs };
