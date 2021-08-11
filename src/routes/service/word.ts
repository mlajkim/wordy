// Main
import express, {  Request, Response } from 'express';
import dotenv from 'dotenv';
import DetectLanguage from 'detectlanguage';
// type
import { pathFinder } from '../../type/wordyEventType';
import { wordDetectLanguagePayload } from '../../type/payloadType';
// Gateway
import { iamGateway } from '../../internal/security/iam';
import { ctGateway } from '../../internal/management/cloudTrail';
// Router
const word = express.Router();
const EVENT_TYPE = "word:detectLanguage";
const SERVICE_NAME = `${EVENT_TYPE} service`
dotenv.config();

word.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Validation
  const requestedEvent = req.body; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);
  
  // Record
  requestedEvent.validatedBy 
      ? requestedEvent.validatedBy.push(SERVICE_NAME) 
      : requestedEvent.validatedBy = [SERVICE_NAME]; 

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, "wrn::wp:pre_defined:backend:only_to_admin:210811"); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied'){
    const ctResponse = ctGateway(iamValidatedEvent, "Denied");
    return res.status(ctResponse.status).send(ctResponse.WE);
  }

  // Data validation
  if (typeof iamValidatedEvent.requesterInputData !== 'string') {
    const ctResponse = ctGateway(iamValidatedEvent, "Denied", "Type of iamValidatedEvent.requesterData is wrong; requires string");
    return res.status(ctResponse.status).send(ctResponse.WE);
  };

  // Initialize detecter
  const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_API_KEY!);

  // Detecting begins
  detectlanguage.detect(iamValidatedEvent.requesterInputData)
    .then((response: any) => {
      iamValidatedEvent.payload = response as wordDetectLanguagePayload;

      const ctResponse = ctGateway(iamValidatedEvent, "Accepted");
      return res.status(ctResponse.status).send(ctResponse.WE);

    })
    .catch(() => {      
      const ctResponse = ctGateway(iamValidatedEvent, "Denied");
      return res.status(ctResponse.status).send(ctResponse.WE);
    })


});

export default word;