"use strict";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  const password = await bcrypt.hash("Test@123", 10);

  await queryInterface.bulkInsert(
    "users",
    [
      {
        email: "user1@test.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "user2@test.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete("users", null, {});
}
