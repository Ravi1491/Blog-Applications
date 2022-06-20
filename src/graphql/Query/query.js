const {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { UserType, BlogType, GetPostType, GetAllPostType } = require("../typeDef/typeDef");
const users  = require("../../models").users;
const blogs = require("../../models").blog;

//Admin Get list of All basic Users
const GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  description: "List of All basic Users",
  resolve: async() => {
    let userData;

    await users.findAll({ where: { role: "basic" } })
    .then((data)=>{
      if(data.length === 0)  throw new Error("Users data not found")
      userData = data;
    })

    return userData
  },
};

//Admin Get List of all blogs
const GET_ALL_BLOGS = {
  type: new GraphQLList(BlogType),
  description: "List of all blogs",
  resolve: async() => {
    let userData;

    await blogs.findAll()
    .then((data)=>{
      if(data.length === 0)  throw new Error("Users blogs data not found")
      userData = data;
    })

    return userData
  },
};

// List of all post of a basic user
const GET_ALL_POST = {
  type: new GraphQLList(GetAllPostType),
  description: "List of all post of a basic user",
  args: {
    userId: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args) => {
    let allPostData = []

    await blogs.findAll({ where: { 
      userId: args.userId,
    }})
    .then((data)=>{
      if(data.length === 0) throw new Error("No User Found")
      
      data.map((item)=>{
        let postData = {
          title: item.title,
          post: item.post
        }
        allPostData.push(postData);
      })

    })
    return allPostData  
  },
};

// Get a particular post of a user
const GET_POST = {
  type: GetPostType,
  description: "Get a particular post",
  args: {
    userId: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let post;
    await blogs.findOne({ where: { 
      userId: args.userId, 
      title: args.title 
    }})
    .then((data)=>{
      post = data.post
    })
    .catch(()=>{
      throw new Error("Post not found")
    })
    return { post: post }
  },
};

module.exports = { GET_ALL_USERS, GET_ALL_BLOGS, GET_ALL_POST, GET_POST };
