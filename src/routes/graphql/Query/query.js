const {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { UserType, BlogType } = require("../typeDef/typeDef");
const users = require("../../../models").users;
const blogs = require("../../../models").blog;

const GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  description: "List of All basic Users",
  resolve: () => {
    return users.findAll({ where: { role: "basic" } });
  },
};

const GET_ALL_BLOGS = {
  type: new GraphQLList(BlogType),
  description: "List of all blogs",
  resolve: () => {
    return blogs.findAll();
  },
};

const GET_ALL_POST = {
  type: BlogType,
  description: "List of all post of a basic user",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args) => {
    let data = await blogs.findOne({ where: { id: args.id } });
    let posts = data.toJSON();
    posts = posts.blog_post;
    let allPosts = JSON.parse(posts);

    allPosts = JSON.stringify(allPosts);
    let finalPost = {
      blog_post: allPosts,
    };
    return finalPost;
  },
};

const GET_POST = {
  type: BlogType,
  description: "Get a particular post",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let data = await blogs.findOne({ where: { id: args.id } });
    let posts = data.toJSON();
    posts = posts.blog_post;
    let allPosts = JSON.parse(posts);
    allPosts = allPosts.filter((post) => {
      if (post["title"] === args.title) {
        return 1;
      }
    });
    allPosts = JSON.stringify(allPosts);
    let finalPost = {
      blog_post: allPosts,
    };
    return finalPost;
  },
};

module.exports = { GET_ALL_USERS, GET_ALL_BLOGS, GET_ALL_POST, GET_POST };
