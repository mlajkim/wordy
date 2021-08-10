// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Library
import Cryptr from 'cryptr';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { kmsService } from '../../../internal/security/kms';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Resource, UserResource } from '../../../type/resourceType';
import { Policy } from '../../../typesBackEnd';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "user:getUser";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

const POLICY: Policy = {
  version: "1.0.210729",
  comment: "Allow any user, enven without principal",
  statement: [
    {
      effect: "Allow",
      principal: "*",
      action: "*", 
    }
  ]
};

router.use(async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, POLICY); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied')
    return res.send(iamValidatedEvent);

  // Validation complete
  req.body = iamValidatedEvent;
  next();
}); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare 
  const iamValidatedEvent = req.body as WordyEvent; // receives the event

  // by default
  iamValidatedEvent.serverResponse = "Denied";
  iamValidatedEvent.serverMessage = `${EVENT_TYPE} has rejected your request by default`;

  // Record
  iamValidatedEvent.validatedBy 
    ? iamValidatedEvent.validatedBy.push(SERVICE_NAME) 
    : iamValidatedEvent.validatedBy = [SERVICE_NAME]; 

  // Returning data
  await UserModel.findOne({ ownerWrn: iamValidatedEvent.requesterWrn })
    .then((foundResource: Resource) => {
      const { plainkey } = kmsService("Decrypt", foundResource.encryptedDek!);
      const { decrypt } = new Cryptr(plainkey);
      const user = JSON.parse(decrypt(foundResource.ciphertextBlob)) as UserResource;
      iamValidatedEvent.payload = user as UserResource; // apply the payload

      iamValidatedEvent.serverResponse = "Accepted";
      iamValidatedEvent.serverMessage = "OK";
      return res.send(iamValidatedEvent);
    })
    .catch(() => {
      iamValidatedEvent.serverResponse = "NotFound";
      iamValidatedEvent.serverMessage = `${EVENT_TYPE} was not able to find data`;

      return res.send(iamValidatedEvent);
    })
});

export default router;