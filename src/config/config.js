import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  },
  test: {
    dialect: process.env.DB_DIALECT_TEST || "sqlite",
    storage: process.env.DB_STORAGE_TEST || "./test-database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  },
  production: {
    dialect: process.env.DB_DIALECT_PROD || "sqlite",
    storage: process.env.DB_STORAGE_PROD || "./prod-database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  },
};

const env = process.env.NODE_ENV || "development";
export default config[env];
