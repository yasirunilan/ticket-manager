import { ConflictError } from "../utils/appError.js";
import Event from "../models/event.js";

export class EventService {
  async createEvent(payload) {
    try {
      const existingEvent = await Event.findOne({
        where: { name: payload.name },
      });
      if (existingEvent) {
        throw new ConflictError("Event with the same name already exists");
      }
      const event = Event.create(payload);
      return event;
    } catch (e) {
      throw e;
    }
  }
}

export default new EventService();
