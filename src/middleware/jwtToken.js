const jwt = require("jsonwebtoken");

// It will check whether the user is login or not
function authenticateToken(req, res, next) {
  const id = req.params.id;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, user) => {
    if (!err && id){
      req.user = user;
      next();
    }else{ 
      return res.sendStatus(403).json({message: "User not authenticated"});
    };
  });
}

module.exports = { authenticateToken };
