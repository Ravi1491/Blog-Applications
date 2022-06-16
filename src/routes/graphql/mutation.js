const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { UserType, BlogType } = require("./typeDef");
const users = require("../../models").users;
const blogs = require("../../models").blog;

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    updateUser: {
      type: UserType,
      description: "updating basic user data",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let findUser = await users.findOne({ where: { id: args.id } });
        findUser = findUser.toJSON();
        if (findUser.role !== "admin") {
          users.update({
              name: args.name,
              email: args.email,
            },
            { where: { id: args.id } }
          );
          return findUser;
        }
      },
    },
    deleteUser: {
      type: UserType,
      description: "Deleting the basic user data",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        let findUser = await users.findOne({ where: { id: args.id } });
        findUser = findUser.toJSON();
        if (findUser.role !== "admin") {
          users.destroy({ where: { id: args.id } });
        }
        return findUser;
      },
    },
    createPost: {
      type: BlogType,
      description: "Creating a Blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let user_data = await blogs.findOne({ where: { id: args.id } });
        user_data = user_data.toJSON();
        let setPost;
        let postobj = { title: args.title, content: args.content };
        if (user_data.blog_post !== null) {
          let getPost = user_data.blog_post;
          getPost = JSON.parse(getPost);
          getPost.push(postobj);
          setPost = JSON.stringify(getPost);
        } else {
          let postarray = [];
          postarray.push(postobj);
          setPost = JSON.stringify(postarray);
        }
        blogs.update({
            blog_post: setPost,
          },{
            where: { id: args.id },
          }
        );

        return await blogs.findOne({ where: { id: args.id } });
      },
    },
    updatePost: {
      type: BlogType,
      description: "Updateing a Blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let user_data = await blogs.findOne({ where: { id: args.id } });
        user_data = user_data.toJSON();
        const getPost = user_data.blog_post;
        let updated_post = JSON.parse(getPost);

        updated_post.map((user) => {
          if (user["title"] === args.title) {
            user["content"] = args.content;
          }
        });
        updated_post = JSON.stringify(updated_post);
        await blogs.update({
            blog_post: updated_post,
          },{
            where: { id: args.id },
          }
        );

        return blogs.findOne({ where: { id: args.id } });
      },
    },
    deletePost: {
      type: BlogType,
      description: "Delete a Blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let user_data = await blogs.findOne({ where: { id: args.id } });
        user_data = user_data.toJSON();
        const getPost = user_data.blog_post;

        let post = JSON.parse(getPost);

        let findTitle = post.filter((user) => {
          if (user["title"] !== args.title) {
            return true;
          }
        });
        let updated_post = JSON.stringify(findTitle);

        await blogs.update({
            blog_post: updated_post,
          },{
            where: { id: args.id },
          }
        );
        return blogs.findOne({ where: { id: args.id } });
      },
    },
  }),
});

module.exports = RootMutationType;
