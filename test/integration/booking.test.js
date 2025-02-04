import request from "supertest";
import app from "../../src/app.js";

import sequelize from "../../src/db/database.js";
import User from "../../src/models/user.js";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";
import Booking from "../../src/models/booking.js";
import Event from "../../src/models/event.js";
import WaitingList from "../../src/models/waitingList.js";
import { NotFoundError } from "../../src/utils/appError.js";
import bookingService from "../../src/services/bookingService.js";

describe("BookingService", () => {
  let token;
  let userPayload = {
    id: 3,
    email: "testebooking@example.com",
    password: "password",
  };
  let eventPayloadOne = {
    id: 3,
    name: "Booking Concert A",
    totalTickets: 1,
  };
  let eventPayloadTwo = {
    id: 4,
    name: "Booking Concert B",
    totalTickets: 0,
  };
  let eventPayloadThree = {
    id: 5,
    name: "Booking Concert C",
    totalTickets: 1,
  };
  let eventPayloadFour = {
    id: 6,
    name: "Booking Concert D",
    totalTickets: 1,
  };
  let bookingPayloadOne = {
    id: 1,
    eventId: 5,
    userId: 3,
  };
  let bookingPayloadTwo = {
    id: 2,
    eventId: 6,
    userId: 3,
  };
  let waitingListPayloadOne = {
    id: 1,
    eventId: 6,
    userId: 3,
  };
  
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Generate a token for the test user
    token = jwt.sign(
      { id: userPayload.id, email: userPayload.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpires,
      }
    );

    await User.create(userPayload);
    await Event.create(eventPayloadOne);
    await Event.create(eventPayloadTwo);
    await Event.create(eventPayloadThree);
    await Event.create(eventPayloadFour);
    await Booking.create(bookingPayloadOne);
    await Booking.create(bookingPayloadTwo);
    await WaitingList.create(waitingListPayloadOne);

  });

  afterAll(async () => {
    // Clean up the test user after each test
    // await User.destroy({ where: { email: userPayload.email } });
    // await Event.destroy({ where: { name: eventPayload.name } });
    await sequelize.close();
  });

  it('should return 404 when event not found', async () => {
    const payload = { eventId: 999 };
    const res = await request(app)
      .post("/api/v1/booking/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(404);
  });
  it('should return 400 when incorrect payload sent', async () => {
    const payload = { testId: 999 };
    const res = await request(app)
      .post("/api/v1/booking/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(400);
  });

    it('should add to waiting list when no tickets available', async () => {
    const payload = { eventId: 4 };
    const res = await request(app)
      .post("/api/v1/booking/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("booking");
    expect(res.body.booking).toHaveProperty("message");
    expect(res.body.booking.message).toBe("No tickets available, added to waiting list");
  });

  it('should create a booking when tickets are available', async () => {
    const payload = { eventId: 3 };
    const res = await request(app)
      .post("/api/v1/booking/add")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("booking");
  });

  it('should return 404 when booking not found for booking cancellation', async () => {
    const payload = { bookingId: 999 };
    const res = await request(app)
      .post("/api/v1/booking/cancel")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(404);
  });

  it('should return 200 when booking cancelled but no waiting list is there for event', async () => {
    const payload = { bookingId: 1 };
    const res = await request(app)
      .post("/api/v1/booking/cancel")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);

  });
  it('should return 200 when booking cancelled and updates the waiting list', async () => {
    const payload = { bookingId: 2 };
    const res = await request(app)
      .post("/api/v1/booking/cancel")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);

  });
});
