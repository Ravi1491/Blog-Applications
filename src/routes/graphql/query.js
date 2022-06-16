const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { UserType, BlogType } = require("./typeDef");
const users = require("../../models").users;
const blogs = require("../../models").blog;

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    getAllUser: {
      type: new GraphQLList(UserType),
      description: "List of All basic Users",
      resolve: () => {
        return users.findAll({ where: { role: "basic" } });
      },
    },
    getAllBlogs: {
      type: new GraphQLList(BlogType),
      description: "List of all blogs",
      resolve: () => {
        return blogs.findAll();
      },
    },
    getAllPost: {
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
    },
    getPost: {
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
    },
  }),
});

module.exports = RootQueryType;
