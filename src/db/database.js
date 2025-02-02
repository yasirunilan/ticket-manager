import { Sequelize } from "sequelize";
import config from "../config/config.js";

// Create a new Sequelize instance
const sequelize = new Sequelize("", "", "", {
  dialect: config.dialect,
  storage: config.storage,
  logging: false,
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
export default sequelize;
