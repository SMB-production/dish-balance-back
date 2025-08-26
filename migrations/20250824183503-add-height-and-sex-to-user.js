'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'sex', {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'height');
    await queryInterface.removeColumn('users', 'sex');
  },
};
