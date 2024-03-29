// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrContainerPure, Resource } from '../../../type/resourceType';
import { OkrGetOkrContainerInput, OkrGetOkrContainerPayload } from '../../../type/payloadType';
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Middleware
import * as OTM from '../../middleware/onlyToMdl';
// Mogno DB
import { ContainerModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { wordyDecrypt } from '../../../internal/compute/backendWambda';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:getOkrContainer";
dotenv.config();
// Only available to Wordy Members
router.use(pathFinder(EVENT_TYPE), OTM.openToPublic);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { containerWrn } = RE.requesterInputData as OkrGetOkrContainerInput;

  // Findt data from database
  // const unrefinedResource = await ContainerModel.find().where('wrn').in(gettingTarget) as (Resource & OkrContainerPure)[] | undefined; // returns null when not found
  const unrefinedResource = await ContainerModel.findOne({ wrn: containerWrn }) as Resource & OkrContainerPure;
  if (!unrefinedResource) {
    const sending = ctGateway(RE, "LogicallyDenied");
    return res.status(sending.status!).send(sending); };

  RE.payload = {
    foundContainerData: wordyDecrypt(unrefinedResource, RE), 
    doesBelongToRequester: RE.requesterWrn === unrefinedResource.ownerWrn
  } as OkrGetOkrContainerPayload
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
});

export default router;