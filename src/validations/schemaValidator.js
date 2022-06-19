const joi = require("joi");

const userSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    name: joi.string(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
    password: joi.string(),
    oldPassword: joi.string(),
    newPassword: joi.string(),
    role: joi.string(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const blogSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    title: joi.string(),
    post: joi.string(),
    userId: joi.number().integer().min(1).max(100)
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

module.exports = {
  userSchemaValidator,
  blogSchemaValidator,
};
