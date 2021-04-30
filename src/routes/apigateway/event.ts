import express, {NextFunction, Request, Response} from 'express';
import { cloudTrail } from './response';

const event = express.Router();

const availableEvents = [
  {
    eventName: "GetRefreshToken",
    eventVersion: "2021-04-30",
    eventAvailability: "Available",
    unavailableDate: "" // blank for none, if eventAvailability is available, this is skipped.
  }
];

// handles Unavailable Event
event.use((req: Request, res: Response, next: NextFunction) => {
  const filteredAvailableEvents = availableEvents.filter(availableEvent => availableEvent.eventName === req.body.eventName);

  // If not found, send a response
  if (filteredAvailableEvents.length === 0) {
    const eventResponse = {
      message: "Sorry but has not found your request"
    };
    cloudTrail(eventResponse);

    return res.send( eventResponse );
  }
    
  next();
});

event.use(async (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.body);

  next();
});

event.use(async (_req: Request, res: Response) => {
  const eventResponse = {
    message: "Hello World!"
  };

  cloudTrail(eventResponse);

  // Finally
  return res.send(eventResponse);
});

export default event;