import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
    jwtExpires: process.env.JWT_EXPIRES || "1d", 
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  },
  test: {
    dialect: process.env.DB_DIALECT_TEST || "sqlite",
    storage: process.env.DB_STORAGE_TEST || "./test-database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
    jwtExpires: process.env.JWT_EXPIRES || "1h",
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  },
  production: {
    dialect: process.env.DB_DIALECT_PROD || "sqlite",
    storage: process.env.DB_STORAGE_PROD || "./prod-database.sqlite",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
    jwtExpires: process.env.JWT_EXPIRES || "1h",
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  },
};

const env = process.env.NODE_ENV || "development";
export default config[env];
