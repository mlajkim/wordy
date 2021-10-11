// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { Resource, OkrObjectPure } from '../../../type/resourceType';
import { WpChangeWpInput, WpChangeWpPayload } from '../../../type/payloadType';
import lec from '../../../type/LogicalErrorCode.json'
// Middleware
import * as OTM from '../../middleware/onlyToMdl';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { wordyDecrypt, wordyEncrypt } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { sln } from '../../../type/sharedWambda';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "wp:changeWp";
dotenv.config();

// Only modifable to owner the resource
router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { modifyingTarget, modifyingWpWrn } = RE.requesterInputData as WpChangeWpInput;

  console.log(RE.requesterWrn); 
  // Findt data from database
  const foundResource = 
    await OkrObjectModel.findOne({ wrn: modifyingTarget }) as Resource | null; // returns null when not found

  // Return response if foundResource does not exist
  if (foundResource === null) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.RESOURCE_NOT_EXIST[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  if (foundResource.ownerWrn !== RE.requesterWrn) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.NO_PERMISSION_TO_PERFORM_SUCH_ACTION[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  const plainData = wordyDecrypt(foundResource, RE) as OkrObjectPure;
  const encryptedResource = wordyEncrypt(plainData, foundResource.wrn, RE, modifyingWpWrn);

  // finally modify
  await OkrObjectModel.findOneAndUpdate({ wrn:modifyingTarget, ownerWrn: RE.requesterWrn }, encryptedResource, { useFindAndModify: false });
      
  
  // return data
  RE.payload = undefined as WpChangeWpPayload;
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
});

export default router;