// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { Resource } from '../../../type/resourceType';
// Middleware
import { onlyToWordyMemberMdl } from '../../middleware/onlyToMdl';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
import { OkrGetOkrObjectPayload } from 'src/type/payloadType';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:getOkrObject";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only available to Wordy Members
router.use(onlyToWordyMemberMdl); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

  // Findt data from database
  const okrObjects = await OkrObjectModel.find({ ownerWrn: RE.requesterWrn }) as Resource[]; // returns null when not found
  
  if (okrObjects) {
    // decrypt the data
    RE.payload = okrObjects.map(el => intoPayload(el, RE)) as OkrGetOkrObjectPayload;
    ctGateway(RE, "Accepted");
    return res.status(RE.status!).send(RE);
  } else {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE);
  };
});

export default router;