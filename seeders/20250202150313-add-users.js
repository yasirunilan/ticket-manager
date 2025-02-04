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
  // add 10 users to the database
  const users = [];
  const timestamp = new Date();

  for (let i = 1; i <= 10; i++) {
    users.push({
      email: `user${i}@test.com`,
      password,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
  await queryInterface.bulkInsert("users", users, {});
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
