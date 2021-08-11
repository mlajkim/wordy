// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Mogno DB
import { MyOkrModel } from '../../../models/EncryptedResource';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource } from '../../../internal/compute/backendWambda';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { MyOkr } from '../../../type/resourceType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:createMyOkr";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

const getCurrentSems = (): number => {
  // logic for getting sem data

  return 213;
}

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

  // Record
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME]; 

  // if my okr exists, it should reject, as it shouldh ave only one
  const data = await MyOkrModel.findOne({ ownerWrn: RE.requesterWrn }); // returns null when not found
  
  if (data) {
    
    ctGateway(RE, "LogicallyDenied", "Already exists");
    return res.status(RE.status!).send(RE);
  }

  // Data declration with generated Wrn
  const wrn = generatedWrn("wrn::okr:my_okr::");
  const newMyOkr: MyOkr = {
    wrn,
    ownerWrn: RE.requesterWrn!,
    // pure data
    id: `go${RE.requesterInfo!.federalId}`, // for now, no customizing
    name: `go${RE.requesterInfo!.federalId}`, // for now, no customizing
    okrSems: [getCurrentSems()!],
    joinedGroup: []
  };
  const newMyOkrResource = intoResource(newMyOkr, wrn, RE);

  // Returning data
  await new MyOkrModel(newMyOkrResource).save()
    .then(() => {
      RE.payload = newMyOkr;

      ctGateway(RE, "Accepted");
      return res.status(RE.status!).send(RE);
    })
    .catch(() => {
      ctGateway(RE, "LogicallyDenied", "Somehow failed to save DB data");
      return res.status(RE.status!).send(RE)
    });
});

export default router;