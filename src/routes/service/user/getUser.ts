// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { intoPayload } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Resource, UserPure } from '../../../type/resourceType';
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "user:getUser";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") {
    ctGateway(requestedEvent, "Denied");
    return res.status(requestedEvent.status!).send(requestedEvent);
  }

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, "wrn::wp:pre_defined:backend:only_to_wordy_member:210811"); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied'){
    ctGateway(iamValidatedEvent, "Denied");
    return res.status(iamValidatedEvent.status!).send(iamValidatedEvent);
  }

  // Validation complete
  req.body = iamValidatedEvent;
  next();
}); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare & record
  const RE = req.body as WordyEvent; // receives the event
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

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