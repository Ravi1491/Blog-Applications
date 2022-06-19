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
     return await queryInterface.removeConstraint('blogs','userId',{
      fields: ['userId'],
      type: 'foreign key',
      name: 'blog_user_association',
      references: {
        table: 'users',
        field: 'id'
      }
    }).then(()=>{
      return queryInterface.bulkInsert('blogs', [{
        title: "user 1 title 1",
        post: "user 1 post 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        // userId: {
        //   table: 'users',
        //   field: 'id'
        // }
      }], {}).then(()=>{
        return queryInterface.addConstraint('blogs',{
          fields: ['userId'],
          type: 'FOREIGN KEY',
          name: 'blog_user_association',
          references: {
            table: 'users',
            field: 'id'
          }
        });
      });
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return await queryInterface.bulkDelete('blogs', null, {});
  }
};
