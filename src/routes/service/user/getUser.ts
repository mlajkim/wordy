// Main
import express, { Request, Response } from 'express';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { intoPayload } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Resource, UserPure } from '../../../type/resourceType';
// Mdl
import * as OTM from '../../middleware/onlyToMdl';
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "user:getUser";

router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare & record
  const RE = req.body as WordyEvent; // receives the event

  // Returning data
  await UserModel.findOne({ wrn: RE.requesterWrn })
    .then((foundResource: Resource) => {
      // upload the payload
      RE.payload = intoPayload(foundResource, RE) as UserPure; // apply the payload

      const sending = ctGateway(RE, "Accepted");
      return res.status(sending.status!).send(sending);
    })
    .catch(() => {
      const sending = ctGateway(RE, "LogicallyDenied");
      return res.status(sending.status!).send(sending);
    })
});

export default router;