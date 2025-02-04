import { ConflictError, NotFoundError } from "../utils/appError.js";
import Event from "../models/event.js";

import WaitingList from "../models/waitingList.js";
export class EventService {
  async createEvent(payload) {
    const existingEvent = await Event.findOne({
      where: { name: payload.name },
    });
    if (existingEvent) {
      throw new ConflictError("Event with the same name already exists");
    }
    const event = Event.create(payload);
    return event;
  }
  async getEvent(eventId) {
    const existingEvent = await Event.findByPk(eventId);
    if (!existingEvent) {
      throw new NotFoundError("Event not found");
    }
    const waitingListForEvent = await WaitingList.findAll({
      where: { eventId: eventId },
    });
    const eventWithWaitingListCount = {
      ...existingEvent.toJSON(),
      waitingList: waitingListForEvent,
    };
    return eventWithWaitingListCount;
  }
}

export default new EventService();
