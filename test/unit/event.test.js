import eventService from "../../src/services/eventService.js";
import { ConflictError } from "../../src/utils/appError.js";
import Event from "../../src/models/event.js";

jest.mock("../../src/models/event.js");

describe("Event Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new event if no event with the same name exists", async () => {
    const payload = { name: "Test Concert A", totalTickets: 5 };
    Event.findOne.mockResolvedValue(null);
    Event.create.mockResolvedValue(payload);

    const result = await eventService.createEvent(payload);

    expect(result).toEqual(payload);
    expect(Event.findOne).toHaveBeenCalledWith({
      where: { name: payload.name },
    });
    expect(Event.create).toHaveBeenCalledWith(payload);
  });

  it("should throw a ConflictError if an event with the same name already exists", async () => {
    const payload = {
      name: "Concert",
      date: "2023-12-31T23:59:59.000Z",
      totalTickets: 100,
    };
    Event.findOne.mockResolvedValue(payload);

    await expect(eventService.createEvent(payload)).rejects.toThrow(
      ConflictError
    );
    await expect(eventService.createEvent(payload)).rejects.toThrow(
      "Event with the same name already exists"
    );
  });
});
