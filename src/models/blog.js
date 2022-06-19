'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blog.belongsTo(models.users);
      models.users.hasMany(blog)
    }
  }
  blog.init({
    title: DataTypes.STRING,
    post: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};