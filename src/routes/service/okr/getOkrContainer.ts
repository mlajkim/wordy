// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { Resource } from '../../../type/resourceType';
import { OkrGetOkrContainerInput, OkrGetOkrContainerPayload } from 'src/type/payloadType';
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Middleware
import { openToPublic } from '../../middleware/onlyToMdl';
// Mogno DB
import { ContainerModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:getOkrContainer";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only available to Wordy Members
router.use(openToPublic); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { containerWrn } = RE.requesterInputData as OkrGetOkrContainerInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  // Findt data from database
  // const unrefinedResource = await ContainerModel.find().where('wrn').in(gettingTarget) as (Resource & OkrContainerPure)[] | undefined; // returns null when not found
  const unrefinedResource = await ContainerModel.findOne({ wrn: containerWrn }) as Resource;
  if (!unrefinedResource) {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE); };
  
  console.log(unrefinedResource); //test
  
  RE.payload = intoPayload(unrefinedResource, RE) as OkrGetOkrContainerPayload;
  ctGateway(RE, "Accepted");
  return res.status(RE.status!).send(RE);
});

export default router;