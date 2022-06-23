const users = require("../models").users;
const {skip} = require('graphql-resolvers')

// for role check 
function authRoleAdmin(user_role) {
  return async (parent,args) => {
    console.log(args.adminId)
    const user = await users.findOne({ where: { id: args.adminId, role: user_role } });
    if(user){
      skip
    }else{
      throw new Error("Not Allowed")
    }
  };
}

function authRole(user_role) {
  return async (parent,args) => {
    const user = await users.findOne({ where: { id: args.id, role: user_role } });
    if(user){
      skip
    }else{
      throw new Error("Not Allowed")
    }
  };
}

module.exports = { authRoleAdmin, authRole };
