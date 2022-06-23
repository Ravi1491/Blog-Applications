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
    getAllUsers(id: Int!): [UserType!]!
    getAllBlogs(id: Int!): [BlogType!]!
    getAllPost(id: Int!): [GetAllPostType!]!
    getPost(id: Int!, title: String!): GetPostType!
  }
  
  #Mutation
  type Mutation {
    updateUser(adminId: Int!, id: Int!, name: String!, email: String!): MessageType!
    deleteUser(adminId: Int!, id: Int!): MessageType!
    createPost(id: Int!, title: String!, post: String!): MessageType!
    deletePost(id: Int!, title: String!): MessageType!
    updatePost(id: Int!, title: String!, post: String!): MessageType!
    signup(name: String!, email: String!, password: String!, role: String!): MessageType!
    login(email: String!, password: String!): MessageType!
    changePassword(email: String!, oldPassword: String!, newPassword: String!): MessageType!
    refreshToken(id: Int!): MessageType!
    logout(id: Int!): MessageType!
  }
  
`;
module.exports = { typeDefs };
