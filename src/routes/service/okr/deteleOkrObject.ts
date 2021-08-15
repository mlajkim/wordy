// Main
import express, { Request, Response } from 'express';
// type
import lec from '../../../type/LogicalErrorCode.json'
import { OkrDeleteOkrObjectInput } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { sln } from '../../../type/sharedWambda';
import { getNow, intoPayload } from '../../../internal/compute/backendWambda';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// Mdl
import * as OTM from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { OkrObjectPure, ResourceId } from '../../../type/resourceType';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:deleteOkrObject";

// Only available to Wordy Members
router.use(OTM.onlyToWordyMemberMdl); 
router.use(OTM.connectToMongoDB);
router.use(OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event & write it down with validation 
  const RE = req.body as WordyEvent; // receives the event
  const { deletingTargetWrn } = RE.requesterInputData as OkrDeleteOkrObjectInput;

  const unrefinedResource = await OkrObjectModel.findOne({ wrn: deletingTargetWrn });
  if (unrefinedResource.ownerWrn !== RE.requesterWrn) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.RESOURCE_NOT_EXIST[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  
  // Decrypt the data and check if this resouce has 'modifableUntil' data and it rejects by default if it does not contain.
  const pureOkrObjectResource = intoPayload(unrefinedResource, RE) as ResourceId & OkrObjectPure; 

  // Check if this resouce has or has not passed modifiable date
// if modifableUntil is undefined. it is considered eternal resoruce
  if (pureOkrObjectResource.modifableUntil && pureOkrObjectResource.modifableUntil <= getNow()) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.NO_LONGER_MODIFABLE[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  // finally begin happens and return
  await OkrObjectModel.findOneAndRemove({ wrn: unrefinedResource.wrn });
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
});

export default router;