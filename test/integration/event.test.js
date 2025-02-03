import request from "supertest";
import app from "../../src/app.js";
import Event from "../../src/models/event.js";
import User from "../../src/models/user.js";
import sequelize from "../../src/db/database.js";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";

describe("Event API Integration Tests", () => {
  let token;
  let payload = {
    id: 2,
    email: "testevent@example.com",
    password: "password",
  };
  beforeAll(async () => {
    // Synchronize the models with the database
    await sequelize.sync({ force: true });

    // Generate a token for the test user
    token = jwt.sign(
      { id: payload.id, email: payload.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpires,
      }
    );

    await User.create(payload);
  });

  afterAll(async () => {
    // Clean up the test user after each test
    await User.destroy({ where: { email: payload.email } });
    // Close the database connection after all tests
    await sequelize.close();
  });

  it("should return 201 for POST /events/add with correct payload", async () => {
    const payload = { name: "Concert", totalTickets: 100 };
    const res = await request(app)
      .post("/api/v1/event/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("event");
    expect(res.body.event.name).toEqual(payload.name);
    expect(res.body.event.totalTickets).toEqual(payload.totalTickets);
    expect(res.body.event.availableTickets).toEqual(payload.totalTickets);
  });

  it("should return 401 for POST /events/add when access token is not passed", async () => {
    const payload = { name: "Concert", totalTickets: 100 };
    const res = await request(app).post("/api/v1/event/add").send(payload);

    expect(res.statusCode).toEqual(401);
  });

  it("should return 400 for POST /event/add with incorrect payload structure", async () => {
    const res = await request(app)
      .post("/api/v1/event/add")
      .send({ name: "Test Event A", total: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        '"totalTickets" is required',
        '"total" is not allowed',
      ])
    );
  });
});
