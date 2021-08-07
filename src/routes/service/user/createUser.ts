// Main
import express, {  Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Policy } from '../../../typesBackEnd';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
// Router
const router = express.Router();
const EVENT_TYPE = "user:createUser";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

const POLICY: Policy = {
  version: "1.0.210729",
  comment: "Allow any user, enven without principal",
  statement: [
    {
      effect: "Allow",
      principal: "*",
      action: "*", 
    }
  ]
};

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);
  
  // Record
  requestedEvent.validatedBy 
      ? requestedEvent.validatedBy.push(SERVICE_NAME) 
      : requestedEvent.validatedBy = [SERVICE_NAME]; 

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, POLICY); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied')
    return res.send(iamValidatedEvent);

  // Data validation
  const inputData = requestedEvent.requesterInputData


});

export default router;