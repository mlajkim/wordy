import express, {NextFunction, Request, Response} from 'express';
import moment from 'moment';
import { EventType } from '../../type/eventType';
import { cloudTrail } from './response';

const event = express.Router();

const availableEvents = [
  {
    eventName: "GetRefreshToken",
    eventCriticality: 'High',
    eventVersion: "2021-04-30",
    eventAvailability: "Available",
    unavailableDate: "" // blank for none, if eventAvailability is available, this is skipped.
  }
];

// Format request
event.use((req: Request, res: Response, next: NextFunction) => {
  const formattedEvent: EventType = {
    eventName: req.body.eventName,
    eventVersion: req.body.eventVersion,
    eventId: "RANDOMHASH",
    eventTime: moment().valueOf(),
    sourceIpAddress: req.connection.remoteAddress as string,
    sourceIpCountry: 'Japan',

    // Tail
    requesterWrn: "wrn::user:mdb:1385623057323_asd8c8a8hdds8ad82esd8adsa9dshdads5",
    eventAccessKey: "asda8dad9ua98824qfas8fs8fuasdfa8dada0ud89adad9asd",
    payload: [
      { "hi ": "bye"}
    ]
  };


  const filteredAvailableEvents = availableEvents
    .filter(availableEvent => availableEvent.eventName === req.body.eventName);

  // If not found, send a response
  if (filteredAvailableEvents.length === 0) {
    cloudTrail( formattedEvent );
    return res.send( formattedEvent );
  }
    
  next();
});

// handles Unavailable Event
event.use((req: Request, res: Response, next: NextFunction) => {
  const filteredAvailableEvents = availableEvents
    .filter(availableEvent => availableEvent.eventName === req.body.eventName);

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