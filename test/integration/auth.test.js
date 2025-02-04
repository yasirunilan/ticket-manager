import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/user.js";
import sequelize from "../../src/db/database.js";

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    await User.create({
      id: 1,
      email: "testauth@example.com",
      password: "password",
    });
  });

  afterAll(async () => {
    // Clean up the test user after each test
    await User.destroy({ where: { email: "testauth@example.com" } });
    await sequelize.close();
  });

  it("should return 200 for POST /auth/login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "testauth@example.com", password: "password" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for POST /auth/login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "testauth@example.com", password: "test" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Incorrect credentials.");
  });
  it("should return 401 for POST /auth/login when user not exists", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "testauth1@example.com", password: "test" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Incorrect credentials.");
  });

  it("should return 400 for POST /auth/login with incorrect payload ", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "testauth@example.com", password: "test" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        '"email" is required',
        '"username" is not allowed',
      ])
    );
  });
});