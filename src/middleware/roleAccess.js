const logger = require("../../utils/logger");
const users = require("../models").users;

// for role check 
function authRole(user_role) {
  return async (req, res, next) => {
    const user = await users.findOne({ where: { id: req.params.id, role: user_role } });
    if(user){
      next();
    }else{
      res.status(404).send('Users does not Found')
    }
  };
}

module.exports = { authRole };
