// Main
import express, {  Request, Response } from 'express';
import dotenv from 'dotenv';
import DetectLanguage from 'detectlanguage';
// type
import { pathFinder } from '../../type/wordyEventType';
import { Policy } from '../../typesBackEnd';
// Gateway
import { iamGateway } from '../../internal/security/iam';
// Router
const word = express.Router();
const EVENT_TYPE = "word:detectLanguage";
const SERVICE_NAME = `${EVENT_TYPE} service`
dotenv.config();

const POLICY: Policy = {
  version: "1.0.210729",
  comment: "Allow only kim for any action",
  statement: {
    effect: "Allow",
    principal: "wrn::user:admin:mdb:00001111",
    action: "*", 
  }
};

word.use(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Validation
  const requestedEvent = req.body; // receives the event
  if (requestedEvent.serverResponse === "Denied") res.send(requestedEvent);
  
  // Record
  requestedEvent.validatedBy 
      ? requestedEvent.validatedBy.push(SERVICE_NAME) 
      : requestedEvent.validatedBy = [SERVICE_NAME]; 

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, POLICY); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied')
    return res.send(iamValidatedEvent);

  // Data validation
  if (typeof iamValidatedEvent.requesterInputData !== 'string') {
    iamValidatedEvent.serverResponse = 'Denied';
    iamValidatedEvent.serverMessage = 'Type of iamValidatedEvent.requesterData is wrong; requires string';
    return res.send(iamValidatedEvent);
  };

  const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_API_KEY!);

  detectlanguage.detect(iamValidatedEvent.requesterInputData)
    .then((res: any) => {
      iamValidatedEvent.serverResponse === 'Accepted';
      const payload = JSON.stringify(res);
      console.log(payload);
      iamValidatedEvent.payload = payload;
      return res.send(iamValidatedEvent);
    })
    .catch(() => {
      iamValidatedEvent.serverResponse = 'Denied';
      iamValidatedEvent.serverMessage = 'Detect Language API has denied your request';
      return res.send(iamValidatedEvent);
    })

});

export default word;