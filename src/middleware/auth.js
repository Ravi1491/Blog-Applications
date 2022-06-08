const logger = require("../../utils/logger");
const users = require("../models").users;

// for admin and basic user login check
function authRole(role) {
  return async (req, res, next) => {
    const user_role = await users.findAll({ where: { role: role } });
    let roles = JSON.stringify(user_role);
    roles = JSON.parse(roles);
    if (!roles) {
      res.status(401);
      return res.status(403).send("Not Users Present");
    } else {
      const email = req.body.email;
      const roles2 = roles.filter((user) => {
        if (user.email === email) {
          return 1;
        }
      });
      if (roles2.length !== 0){
        next();
      } else {
        res.send("Invliad Link");
      }
    }
  };
}

function authBasic() {
  return async (req, res, next) => {
    const user_id = await users.findOne({ where: { id: req.params.id } });
    if (user_id === null) {
      return res.send("User does not exist");
    } else {
      const user_data = user_id.toJSON();
      if (user_data.role !== "basic") {
        res.status(401);
        return res.send("Not allowed");
      } else {
        next();
      }
    }
  };
}

function authAdmin() {
  return async (req, res, next) => {
    const user_id = await users.findOne({ where: { id: req.params.id } });
    if (user_id === null) {
      return res.send("User does not exist");
    } else {
      const user_data = user_id.toJSON();
      if (user_data.role !== "basic") {
        next();
      } else {
        res.status(401);
        return res.send("Not allowed");
      }
    }
  };
}

module.exports = { authRole, authBasic, authAdmin };
