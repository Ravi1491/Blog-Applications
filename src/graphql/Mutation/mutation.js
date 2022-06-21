const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");
const MessageType = require("../typeDef/message");
const users = require("../../models").users;
const blogs = require("../../models").blog;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// updating basic user data
const UPDATE_USER = {
  type: MessageType,
  description: "updating basic user data",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let msg;
    await users.findOne({ where: { id: args.id, role: 'basic' }})
    .then( async (finduser)=>{
      if (!finduser) {
        throw new Error("User Not Found");
      }

      const data = {
        name: args.name,
        email: args.email,  
      };

      await users.update(data, { where: { id: args.id } })
      .then((value) => {
        msg ={ successful: true, message: "User data updated successfully" };
      })
    })
    return msg;
  },
};

// Deleting the basic user data
const DELETE_USER = {
  type: MessageType,
  description: "Deleting the basic user data",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async(parent, args) => {
    let msg;
    await users.findOne({ where: { id: args.id, role: "basic" } })

    .then(async(data)=>{
       console.log(data)
       if(!data)  throw new Error("User not found")  
       
       await blogs.findOne({ where: { userId: args.id} }).then(()=>{
          blogs.destroy({where:{ userId: args.id}})
       })

       users.destroy({ where: { id: args.id } });
       msg={ successful: true, message: "User Deleted" };
    })

    return msg
  },
};

// Creating a new Post
const CREATE_POST = {
  type: MessageType,
  description: "Creating a Blog",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let msg;
    await blogs.create({
      userId: args.id,
      title: args.title,
    })
    .then((data) => {
      msg = { successful: true, message: "Blog Added" };
    })
    .catch(() => {
      throw new Error("Blog not added");
    });

    return msg;
  },
};

// Delete a Blog
const DELTE_POST = {
  type: MessageType,
  description: "Delete a Blog",
  args: {
    userId: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let msg;
    await blogs.findOne({ where: { 
      userId: args.userId, 
      title: args.title 
    }})
    .then(async(user_data)=>{

      if(!user_data){
        throw new Error("post Not Found");
      }

      await blogs.destroy({ where: { 
        userId: args.userId, 
        title: args.title 
      }})
      .then((datas)=>{
        msg = { successful: true, message: "Delete Post Successfully" };
      })      

    })

    return msg
  },
};

const UPDATE_POST = {
  type: MessageType,
  description: "Updateing a Blog",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let msg ;
    await blogs.findOne({ 
      where: { 
        userId: args.id, 
        title: args.title 
      }
    }).then(async (user_data)=>{

      if(!user_data){
        throw new Error("Post Not Found");
      }

      await blogs.update({
        post: args.post
      },{ where: { 
          userId: args.id, 
          title: args.title  
        }
      })
      .then( async () => {
        msg = { successful: true, message: "Blog updated successfully" };
      })
    })

    return msg
  },
};

const SIGNUP = {
  type: MessageType,
  description: "Signup Successfully",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    let msg

    await users.findOne({ where: { email: args.email } })
    .then((ExistUser)=>{

      if (ExistUser) {
        throw new Error("User Already Exist");
      }

      users.create({
        name: args.name,
        email: args.email,
        password: args.password,
        role: args.role,
      });
      msg = { successful: true, message: "Successfully Registered" };

    })

    return msg
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
    let msg;
    
    await users.findOne({ where: { email: args.email } })
    .then(async(userWithEmail)=>{

      if (!userWithEmail) {
        throw new Error("User Not Found");
      }

      if (await bcrypt.compare(args.password, userWithEmail.password)) {
        const user = { email: userWithEmail.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECERT, {expiresIn: "8h",});
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECERT, {expiresIn: "7d",});
        
        users.update({
          refreshtoken: refreshToken,
        },{
          where: { id: userWithEmail.id },
        });
        
        msg = { successful: true, message: "Successfully Login" };
      } else {
        msg = { successful: false, message: "Invalid Email or Password" };
      }
    })  
    return msg;   
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
    await users.findOne({ where: { email: args.email } })
      .then( async (userWithEmail) => {

        if (! await bcrypt.compare(args.oldPassword, userWithEmail.password)) {
          throw new Error("Password does not match");
        }

        const hashedPassword = await bcrypt.hash(args.newPassword, 10);
        await users.update({
            password: hashedPassword,
          },{
            where: { id: userWithEmail.id },
          }
        );
        
        msg = { successful: true, message: "Password successfully Updated" };
      });
      
    return msg;
  },
};

module.exports = {
  UPDATE_USER,
  DELETE_USER,
  CREATE_POST,
  UPDATE_POST,
  DELTE_POST,
  SIGNUP,
  LOGIN_USER,
  CHANGE_PASS,
};
