import express, {NextFunction, Request, Response} from 'express';

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
event.use(async (req: Request, res: Response, next: NextFunction) => {
  const filteredAvailableEvents = availableEvents.filter(availableEvent => availableEvent.eventName === req.body.eventName);

  // If not found, send a response
  if (filteredAvailableEvents.length === 0) 
    return res.send({
      message: "Sorry but has not found your request"
    });
  
  next();
});

event.use(async (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.body);

  next();
});

event.use(async (_req: Request, res: Response) => {
  return res.send('Hello World!');

});

export default event;