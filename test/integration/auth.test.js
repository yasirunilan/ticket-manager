import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/user.js";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";
import sequelize from "../../src/db/database.js";

describe("Auth API Integration Tests", () => {
  let token;

  beforeAll(async () => {
    // Synchronize the models with the database
    await sequelize.sync({ force: true });
    // Create a test user
    await User.create({
      id: 1,
      email: "test@example.com",
      password: "password",
    });

    // Generate a token for the test user
    token = jwt.sign({ id: 1, email: "test@example.com" }, config.jwtSecret, {
      expiresIn: config.jwtExpires,
    });
  });

  afterAll(async () => {
    // Clean up the test user
    await User.destroy({ where: { email: "test@example.com" } });
    await sequelize.close();
  });

  it("should return 200 for POST /auth/login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for POST /auth/login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "test" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Incorrect credentials.");
  });

  it("should return 400 for POST /auth/login with incorrect payload ", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "test@example.com", password: "test" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(expect.arrayContaining(["\"email\" is required", "\"username\" is not allowed"]));
  });
});
