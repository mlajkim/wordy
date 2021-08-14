// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { Resource } from '../../../type/resourceType';
import { OkrChangeOrderOfItemInput } from '../../../type/payloadType';
import lec from '../../../type/LogicalErrorCode.json';
// Middleware
import { onlyToOwnerMdl, addValidatedByThisService } from '../../middleware/onlyToMdl';
// Mogno DB
import { ContainerModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { modifyResource } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:changeOrderOfItem";
dotenv.config();

// Only modifable to owner the resource
router.use(onlyToOwnerMdl);
router.use(connectToMongoDB);
router.use(addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { containerWrn, orderedWrn } = RE.requesterInputData as OkrChangeOrderOfItemInput;

  // Findt data from database
  const foundResource = 
    await ContainerModel.findOne({ wrn: containerWrn }) as Resource | null; // returns null when not found

  // Return response if foundResource does not exist
  if (foundResource === null) {
    ctGateway(RE, "LogicallyDenied", lec.RESOURCE_NOT_EXIST);
    return res.status(RE.status!).send(RE);
  };

  // Smartly decrpyt, modify, and encrypt
  const modifedResource = modifyResource({
    containingObject: orderedWrn
  }, foundResource, RE);

  // finally modify
  const dbReply = await ContainerModel.findOneAndUpdate({ wrn: containerWrn }, modifedResource, { useFindAndModify: false });
      
  // if it somehow fails to save...
  if (!dbReply) {
    ctGateway(RE, "LogicallyDenied", lec.FAILED_TO_MODIFY_FOLLOWING_MODEL_DUE_TO_DB_FAILURE);
    return res.status(RE.status!).send(RE);
  }

  // Sunccessful call finally
  ctGateway(RE, "Accepted");
  return res.status(RE.status!).send(RE);
});

export default router;