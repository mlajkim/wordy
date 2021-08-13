// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { Resource, OkrObjectPure } from '../../../type/resourceType';
import { WpChangeWpInput, WpChangeWpPayload } from '../../../type/payloadType';
import lec from '../../../type/LogicalErrorCode.json'
// Middleware
import { onlyToOwnerMdl } from '../../middleware/onlyToMdl';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload, intoResource } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "wp:changeWp";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only modifable to owner the resource
router.use(onlyToOwnerMdl); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { modifyingTarget, modifyingWpWrn } = RE.requesterInputData as WpChangeWpInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

  // Findt data from database
  const foundResource = 
    await OkrObjectModel.findOne({ wrn: modifyingTarget, ownerWrn: RE.requesterWrn }) as Resource | null; // returns null when not found

  // Return response if foundResource does not exist
  if (foundResource === null) {
    ctGateway(RE, "LogicallyDenied", lec.RESOURCE_NOT_EXIST);
    return res.status(RE.status!).send(RE);
  };

  const plainData = intoPayload(foundResource, RE) as OkrObjectPure;
  const encryptedResource = intoResource(plainData, foundResource.wrn, RE, modifyingWpWrn);

  // finally modify
  await OkrObjectModel.findOneAndUpdate({ wrn:modifyingTarget, ownerWrn: RE.requesterWrn }, encryptedResource, { useFindAndModify: false });
      
  
  // return data
  RE.payload = undefined as WpChangeWpPayload;
  ctGateway(RE, "Accepted");
  return res.status(RE.status!).send(RE);
});

export default router;