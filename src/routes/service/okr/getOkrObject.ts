// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
// Middleware
import { onlyToWordyMemberMdl } from '../../middleware/onlyToMdl';
// Mogno DB
import { MyOkrModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:getMyOkr";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only available to Wordy Members
router.use(onlyToWordyMemberMdl); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event
  // const userInput = RE.requesterInputData as OkrGetMyOkrInput;

  // Record
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

  // if my okr exists, it should reject, as it shouldh ave only one
  const myOkrData = await MyOkrModel.findOne({ ownerWrn: RE.requesterWrn }); // returns null when not found
  
  if (myOkrData) {
    // decrypt the data
    RE.payload = intoPayload(myOkrData, RE)
    ctGateway(RE, "Accepted");
    return res.status(RE.status!).send(RE);
  } else {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE);
  };
});

export default router;