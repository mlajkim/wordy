// Main
import express, {   Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrChangeOrderOfItemInput } from '../../../type/payloadType';
// Middleware
import { onlyToOwnerMdl, addValidatedByThisService } from '../../middleware/onlyToMdl';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
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
  const { newlyOrderedObjects } = RE.requesterInputData as OkrChangeOrderOfItemInput;

  // modify begins here
  newlyOrderedObjects.map(async (object) => {
    const foundResource = await OkrObjectModel.findOne({ wrn: object.wrn });
    if (foundResource) {
      const modifedResource = modifyResource({
        objectOrder: object.objectOrder
      }, foundResource, RE);
      await OkrObjectModel.findOneAndUpdate({ wrn: object.wrn }, modifedResource, { useFindAndModify: false })
    }; // end of if. only happens when such resource exists.
  });

  // Sunccessful call finally
  ctGateway(RE, "Accepted");
  return res.status(RE.status!).send(RE);
});

export default router;