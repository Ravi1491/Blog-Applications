const users = require("../../models").users;
const blogs = require("../../models").blog;

const QueryResolvers = {
  Query: {
    async getAllUsers() {
      let userData;

      await users.findAll({ where: { role: "basic" } }).then((data) => {
        if (data.length === 0) throw new Error("Users data not found");
        userData = data;
      });

      return userData;
    },

    async getAllBlogs() {
      let userData;

      await blogs.findAll().then((data) => {
        if (data.length === 0) throw new Error("Users blogs data not found");
        userData = data;
      });

      return userData;
    },

    getAllPost: async (parent, args) => {
      let allPostData = [];

      await blogs
        .findAll({
          where: {
            userId: args.userId,
          },
        })
        .then((data) => {
          if (data.length === 0) throw new Error("No User Found");

          data.map((item) => {
            let postData = {
              title: item.title,
              post: item.post,
            };
            allPostData.push(postData);
          });
        });

      return allPostData;
    },

    getPost: async (parent, args) => {
      let post;
      await blogs
        .findOne({
          where: {
            userId: args.userId,
            title: args.title,
          },
        })
        .then((data) => {
          post = data.post;
        })
        .catch(() => {
          throw new Error("Post not found");
        });
      return { post: post };
    },
  },
};

module.exports = { QueryResolvers }