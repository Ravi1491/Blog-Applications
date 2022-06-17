const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");
const { UserType, BlogType } = require("../typeDef/typeDef");
const MessageType = require("../typeDef/message");
const users = require("../../../models").users;
const blogs = require("../../../models").blog;
const logger = require("../../../../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UPDATE_USER = {
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
      users.update(
        {
          name: args.name,
          email: args.email,
        },
        { where: { id: args.id } }
      );
      return args;
    }
  },
};

const DELETE_USER = {
  type: MessageType,
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
    return { successful: true, message: "User Deleted Successfully" };
  },
};

const CREATE_POST = {
  type: MessageType,
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

    return { successful: true, message: "Blog Added" };
  },
};

const DELTE_POST = {
  type: MessageType,
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

    return { successful: true, message: "Delete Post Successfully" };
  },
};

const UPDATE_POST = {
  type: MessageType,
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

    return { successful: true, message: "Post UPDATED" };
  },
};

const SiGNUP = {
  type: MessageType,
  description: "Signup Successfully",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const ExistUser = await users.findOne({ where: { email: args.email } });
    if (ExistUser) {
      return { successful: false, message: "User Already exist" };
    }
    try {
      if (args.role === "basic") {
        blogs.create({
          id: args.id,
          name: args.name,
        });
      }
      users.create({
        id: args.id,
        name: args.name,
        email: args.email,
        password: args.password,
        role: args.role,
      });
      return { successful: true, message: "Successfully Registered" };
    } catch (err) {
      return { successful: false, message: "User Not Added" };
    }
  },
};

const LOGIN_USER = {
  type: MessageType,
  description: "Login User",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const userWithEmail = await users.findOne({ where: { email: args.email } });
    if (!userWithEmail) {
      return { successful: false, message: "User Not Found" };
    }
    try {
      if (await bcrypt.compare(args.password, userWithEmail.password)) {
        const user = { email: userWithEmail.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECERT, {
          expiresIn: "8h",
        });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECERT, {
          expiresIn: "7d",
        });
        await users.update({
            refreshtoken: refreshToken,
          },{
            where: { id: userWithEmail.id },
          }
        );
        return { successful: true, message: "Successfully Login" };
      } else {
        return { successful: false, message: "Invalid Email or Password" };
      }
    } catch {
      return { successful: false, message: "Login Failed" };
    }
  },
};

const CHANGE_PASS = {
  type: MessageType,
  description: "Password change",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    oldPassword: { type: GraphQLNonNull(GraphQLString) },
    newPassword: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const userWithEmail = await users.findOne({ where: { email: args.email } });
    if (!(await bcrypt.compare(args.oldPassword, userWithEmail.password))) {
      return { successful: false, message: "Password does not Match" };
    }
    try {
      const hashedPassword = await bcrypt.hash(args.newPassword, 10);
      await users.update({
          password: hashedPassword,
        },{
          where: { id: userWithEmail.id },
        }
      );
      return { successful: true, message: "Password Change Successfully" };
    } catch {
      logger.blog_logger.log("error", "Error: ", err);
      return { successful: false, message: "Password Not Changed" };
    }
  },
};

module.exports = {
  UPDATE_USER,
  DELETE_USER,
  CREATE_POST,
  UPDATE_POST,
  DELTE_POST,
  SiGNUP,
  LOGIN_USER,
  CHANGE_PASS,
};
