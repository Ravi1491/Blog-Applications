const joi = require("joi");
const {skip} = require('graphql-resolvers')

// Schema Validator for User Table
const userSchemaValidator = (parent,args) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    adminId: joi.number().integer().min(1).max(100),
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

  const { error } = schema.validate(args, { aboutEarly: false });
  if (error) {
    throw new Error(error)
  } else {
    skip;
  }
};

// Schema Validator for Blog Table
const blogSchemaValidator = (parent,args) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    title: joi.string(),
    post: joi.string(),
    userId: joi.number().integer().min(1).max(100)
  }).unknown(false);

  const { error } = schema.validate(args, { aboutEarly: false });
  if (error) {
    throw new Error(error)
  } else {
    skip;
  }
};

module.exports = {
  userSchemaValidator,
  blogSchemaValidator,
};
