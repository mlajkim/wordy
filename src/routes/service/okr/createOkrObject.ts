// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource } from '../../../internal/compute/backendWambda';
// type
import { CreateOkrObjectInput } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { OkrObjectHeader } from '../../../type/resourceType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:createOkrObject";
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
  if (iamValidatedEvent.serverResponse === 'Denied'){
    ctGateway(requestedEvent, "Denied");
    return res.status(requestedEvent.status!).send(requestedEvent);
  }

  // Validation complete
  req.body = iamValidatedEvent;
  next();
}); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event & write it down with validation 
  const RE = req.body as WordyEvent; // receives the event
  const inputData = RE.requesterInputData as CreateOkrObjectInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  // Data declration with generated Wrn
  const wrn = generatedWrn("wrn::okr:okr_object:mdb::");
  const newMyOkr: OkrObjectHeader = inputData;
  const newMyOkrResource = intoResource(newMyOkr, wrn, RE);

  // Returning data
  await new OkrObjectModel(newMyOkrResource).save()
    .then(() => {
      ctGateway(RE, "Accepted");
      return res.status(RE.status!).send(RE);
    })
    .catch(() => {
      ctGateway(RE, "LogicallyDenied", "Somehow failed to save DB data");
      return res.status(RE.status!).send(RE)
    });
});

export default router;