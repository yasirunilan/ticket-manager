import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/user.js";
import Event from "../../src/models/event.js";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";
import sequelize from "../../src/db/database.js";

describe("Event API Integration Tests", () => {
  let token;
  let userPayload = {
    id: 2,
    email: "testevent@example.com",
    password: "password",
  };
  beforeAll(async () => {
    // Generate a token for the test user
    token = jwt.sign(
      { id: userPayload.id, email: userPayload.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpires,
      }
    );

    await User.create(userPayload);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: userPayload.email } });
    await Event.destroy({ where: { name: "Concert" } });
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

  it("should return 409 for POST /events/add with event containing same name", async () => {
    const payload = { name: "Concert", totalTickets: 100 };
    const res = await request(app)
      .post("/api/v1/event/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual("Event with the same name already exists");

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

  it("should return 404 for GET /event/:eventId with non existing event id", async () => {
    const eventId = 6;
    const res = await request(app).get(`/api/v1/event/${eventId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Event not found");
  });

  it("should return 200 for GET /events/:eventId when event exists", async () => {
    const payload = { name: "Concert", totalTickets: 100 };

    const res = await request(app).get("/api/v1/event/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("event");
    expect(res.body.event.name).toEqual(payload.name);
    expect(res.body.event.totalTickets).toEqual(payload.totalTickets);
    expect(res.body.event.availableTickets).toEqual(payload.totalTickets);
    expect(res.body.event).toHaveProperty("waitingList");
  });
});
