const jwt = require("jsonwebtoken");
const users = require("../models").users;
const {skip} = require('graphql-resolvers')

// It will check whether the user is login or not

const authenticateToken = async (parent, args) => {
  const data = await users.findOne({
    where: {id: args.id}
  })

  if(data == null) throw new Error("User Not Found")
  const accessToken = data.accesstoken

  if(accessToken == null) throw new Error("User Need To Login Again")
  
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECERT, (err, user) => {
    if (err){
      throw new Error(err)
    }
    skip;
  });
};

module.exports = { authenticateToken };
