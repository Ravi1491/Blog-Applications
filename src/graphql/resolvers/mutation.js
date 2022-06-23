const users = require("../../models").users;
const blogs = require("../../models").blog;
const bcrypt = require("bcrypt");
const { combineResolvers } = require("graphql-resolvers");
const { userSchemaValidator, blogSchemaValidator } = require('../../middleware/schemaValidator');
const { authRoleAdmin, authRole } = require('../../middleware/roleAccess');
const { authenticateToken } = require('../../middleware/jwtToken');
const jwt = require("jsonwebtoken");

const MutationResolvers = {
  Mutation: {
    // Admin update the basic users data
    updateUser: combineResolvers(authenticateToken,userSchemaValidator, authRoleAdmin('admin'), async (parent, args) => {
      let msg;
      await users.findOne({ 
        where: { 
          id: args.id, 
          role: "basic" 
        } 
      })
      .then(async (finduser) => {
        if (!finduser)  throw new Error("User Not Found");
  
        const data = {
          name: args.name,
          email: args.email,
        };
  
        await users.update(data, { where: { id: args.id } }).then((value) => {
          msg = {
            successful: true,
            message: "User data updated successfully",
          };
        });
      })
      .catch((err)=>{
        throw new Error(err)
      })
      return msg;
    }),
  
    // Admin delete the basic users data
    deleteUser: combineResolvers(authenticateToken,userSchemaValidator, authRoleAdmin('admin'), async (parent, args) => {
      let msg;
      await users.findOne({ 
        where: { 
          id: args.id, 
          role: "basic" 
        } 
       })
        .then(async (data) => {
          if (!data) throw new Error("User not found");
  
          await blogs.findOne({ where: { userId: args.id } }).then(() => {
            blogs.destroy({ where: { userId: args.id } });
          });
  
          users.destroy({ where: { id: args.id } });
          msg = { successful: true, message: "User Deleted" };
        })
        .catch((err)=>{
          throw new Error(err)
        })
  
      return msg;
    }),
  
    // basic users create post
    createPost: combineResolvers(authenticateToken, blogSchemaValidator, authRole('basic'), async (parent, args) => {
      let msg;
      await users.findOne({ 
        where: { 
          id: args.id 
        } 
      })
        .then(async (userData) => {
          await blogs.create({
            userId: args.id,
            title: args.title,
            post: args.post,
          })
          .then((data) => {
            msg = { successful: true, message: "Blog Added" };
          });
        })
        .catch((err) => {
          throw new Error("User Not Found");
        });
  
      return msg;
    }),
  
    // basic users delete his post
    deletePost: combineResolvers(authenticateToken, blogSchemaValidator, authRole('basic'),async (parent, args) => {
      let msg;
      await blogs.findOne({
        where: {
          userId: args.id,
          title: args.title,
        },
      })
        .then(async (user_data) => {
          if (!user_data) throw new Error("post Not Found");
  
          await blogs.destroy({
            where: {
              userId: args.id,
              title: args.title,
            },
          })
            .then((datas) => {
              msg = { successful: true, message: "Delete Post Successfully" };
            });
        })
        .catch((err)=>{
          throw new Error(err)
        })
  
      return msg;
    }),
  
    // basic users update his post
    updatePost: combineResolvers(authenticateToken, blogSchemaValidator, authRole('basic'), async (parent, args) => {
      let msg;
      await blogs.findOne({
        where: {
          userId: args.id,
          title: args.title,
        },
      })
        .then(async (user_data) => {
          if (!user_data) throw new Error("Post Not Found");
  
          await blogs.update({ post: args.post },{
            where: {
              userId: args.id,
              title: args.title,
            },
          })
            .then(async () => {
              msg = { successful: true, message: "Blog updated successfully" };
            });
        })
        .catch((err)=>{
          throw new Error(err)
        })
  
      return msg;
    }),
  
    // Signup
    signup: combineResolvers(userSchemaValidator, async (parent, args) => {
      let msg;
  
      await users.findOne({ where: { email: args.email } })
        .then((ExistUser) => {
          if (ExistUser) throw new Error("User Already Exist");
  
          users.create({
            name: args.name,
            email: args.email,
            password: args.password,
            role: args.role,
          });
          msg = { successful: true, message: "Successfully Registered" };
        })
        .catch((err)=>{
          throw new Error(err)
        })
  
      return msg;
    }),
  
    // Login
    login: combineResolvers(userSchemaValidator, async (parent, args) => {
      let msg;
  
      await users.findOne({ where: { email: args.email } })
        .then(async (userWithEmail) => {
          if (!userWithEmail) throw new Error("User Not Found");
  
          if (await bcrypt.compare(args.password, userWithEmail.password)) {
            const user = { email: userWithEmail.email };
  
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECERT,{ expiresIn: "8h" });
            const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECERT,{ expiresIn: "7d" });
  
            users.update({
              accesstoken: accessToken,
              refreshtoken: refreshToken,
              },{
              where: { id: userWithEmail.id },
            });
  
            msg = { successful: true, message: "Successfully Login" };
          } else {
            msg = { successful: false, message: "Invalid Email or Password" };
          }
        })
        .catch((err)=>{
          throw new Error(err)
        })
      return msg;
    }),
  
    // ChangePassword
    changePassword: combineResolvers(userSchemaValidator, async (parent, args) => {
      await users.findOne({ where: { email: args.email } })
        .then(async (userWithEmail) => {
          if (!(await bcrypt.compare(args.oldPassword, userWithEmail.password))) {
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
        })
        .catch((err)=>{
          throw new Error(err)
        })
  
      return msg;
    }),

    // refreshtoken
    refreshToken: async (parent, args) => {
      let msg;
      await users.findOne({ where: { id: args.id } })
        .then(async (user_data)=>{
          
          if (user_data == null) throw new Error("Unauthorized ")
          if (!user_data.refreshtoken) throw new Error("Forbidden ")
  
          jwt.verify(user_data.refreshtoken,process.env.REFRESH_TOKEN_SECERT,(err, user) => {
            if (err) throw new Error("Forbidden ")

            const userEmail = { email: user_data.email };
            const accessToken = jwt.sign(userEmail,process.env.ACCESS_TOKEN_SECERT,{ expiresIn: "8h" });
            
            users.update({ accesstoken: accessToken },{
              where: {
                id: args.id
              },
            })

          })
          msg = { successful: true, message: "AccessToken Updated" };
        })
        .catch((err)=>{
          throw new Error(err)
        })
      return msg 
    },

    // Logout
    logout: combineResolvers(authenticateToken, async (parent,args) => {
      let msg;
      await users.findOne({ where: { id: args.id } })
      .then(async(user_data)=>{
        if (user_data.refreshtoken) {
          users.update({ 
            refreshtoken: null, 
            accesstoken: null 
          }, { 
            where: { id: args.id } 
          });
        }
        msg = { successful: true, message: "Successfully Logout" };
      })
      .catch((err)=>{
        throw new Error(err)
      })
      return msg
    })
  }
}

module.exports = { MutationResolvers }