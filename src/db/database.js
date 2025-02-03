import { Sequelize } from "sequelize";
import config from "../config/config.js";

// Create a new Sequelize instance
const sequelize = new Sequelize("", "", "", {
  dialect: config.dialect,
  storage: config.storage,
  logging: false,
});

export default sequelize;
