import eventService from "../../src/services/eventService.js";
import { ConflictError, NotFoundError } from "../../src/utils/appError.js";
import Event from "../../src/models/event.js";
import WaitingList from "../../src/models/waitingList.js";

jest.mock("../../src/models/event.js");
jest.mock("../../src/models/waitingList.js");
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

  it("should return the event with waiting list count", async () => {
    const eventId = 1;
    const mockEvent = {
      id: eventId,
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 100,
      toJSON: jest.fn().mockReturnValue({
        id: eventId,
        name: "Test Event",
        totalTickets: 100,
        availableTickets: 100,
      }),
    };
    const mockWaitingList = [
      { id: 1, eventId: 1, userId: 1 },
      { id: 2, eventId: 1, userId: 2 },
    ];

    Event.findByPk.mockResolvedValue(mockEvent);
    WaitingList.findAll.mockResolvedValue(mockWaitingList);

    const result = await eventService.getEvent(eventId);

    expect(result).toEqual({
      id: eventId,
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 100,
      waitingList: mockWaitingList,
    });
  });

  it('should throw NotFoundError if event does not exist', async () => {
    const eventId = 1;

    Event.findByPk.mockResolvedValue(null);

    await expect(eventService.getEvent(eventId)).rejects.toThrow(
      NotFoundError
    );
    await expect(eventService.getEvent(eventId)).rejects.toThrow(
      "Event not found"
    );
  });
});
