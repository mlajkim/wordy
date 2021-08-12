// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
// import { OkrGetMyOkrInput } from 'src/type/payloadType';
// Mogno DB
import { MyOkrModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:getMyOkr";
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
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event
  // const userInput = RE.requesterInputData as OkrGetMyOkrInput;

  // Record
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

  // if my okr exists, it should reject, as it shouldh ave only one
  const myOkrData = await MyOkrModel.findOne({ ownerWrn: RE.identifiedAsWrn }); // returns null when not found
  
  if (myOkrData) {
    // decrypt the data
    RE.payload = intoPayload(myOkrData, RE)
    ctGateway(RE, "Accepted");
    return res.status(RE.status!).send(RE);
  } else {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE);
  };
});

export default router;