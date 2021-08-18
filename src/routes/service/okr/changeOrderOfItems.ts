// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrChangeOrderOfItemInput } from '../../../type/payloadType';
import lec from '../../../type/LogicalErrorCode.json';
// Middleware
import * as OTM from '../../middleware/onlyToMdl';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// internal
import { sln } from '../../../type/sharedWambda';
import { ctGateway } from '../../../internal/management/cloudTrail';
import { modifyResource } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:changeOrderOfItem";
dotenv.config();

// Only modifable to owner the resource
router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { newlyOrderedObjects } = RE.requesterInputData as OkrChangeOrderOfItemInput;

  // modify begins here
  for (const object of newlyOrderedObjects) {
    const foundResource = await OkrObjectModel.findOne({ wrn: object.wrn });
    if (foundResource && foundResource.ownerWrn === RE.requesterWrn) {
      const modifedResource = modifyResource({
        objectOrder: object.objectOrder
      }, foundResource, RE);
      await OkrObjectModel.findOneAndUpdate({ wrn: object.wrn }, modifedResource, { useFindAndModify: false })
    } else { // end of if. only happens when such resource exists.
      // if it is not owner, then it should reject it
      const sending = ctGateway(RE, "LogicallyDenied", lec.NO_PERMISSION_TO_PERFORM_SUCH_ACTION[sln(RE)]);
      return res.status(sending.status!).send(sending);
    }
  };

  // Sunccessful call finally
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
});

export default router;