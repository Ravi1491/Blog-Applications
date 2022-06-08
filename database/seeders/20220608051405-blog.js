'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('blogs', [{
    name: "Alex",
    blog_post: `[{"title":"Alex blog 1","content":"Alex post 1"},{"title":"Alex blog 2","content":"Alex post 2"}]`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('blogs', null, {});
  }
};
