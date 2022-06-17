const joi = require("joi");

const signupSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100).required(),
    name: joi.string().required(),
    email: joi.string().required().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
    password: joi.string().required(),
    role: joi.string().required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const loginSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().required().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
    password: joi.string().required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const changePasswordSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().required().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const adminUpdateUserValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100).required(),
    name: joi.string().required(),
    email: joi.string().required().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const admindeleteUserValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100).required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const basicGetBlogValidator = (req, res, next) => {
  const schema = joi.object().keys({
    title: joi.string().required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const basicBlogValidator = (req, res, next) => {
  const schema = joi.object().keys({
    title: joi.string().required(),
    post: joi.string().required(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

const basicDeleteeBlogValidator = (req, res, next) => {
  const schema = joi.object().keys({
    title: joi.string().required(),
  }).unknown(false);
  
  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
};

module.exports = {
  signupSchemaValidator,
  loginSchemaValidator,
  changePasswordSchemaValidator,
  adminUpdateUserValidator,
  admindeleteUserValidator,
  basicGetBlogValidator,
  basicBlogValidator,
  basicDeleteeBlogValidator,
};
