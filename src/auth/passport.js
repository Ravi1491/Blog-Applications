const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const users = require("../models").users;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    },
    async (jwtPayload, done) => {
      try {
        const user = await users.findOne({ where: { id: jwtPayload.id } });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
