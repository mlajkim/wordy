// Main
import express, {  Request, Response } from 'express';
import dotenv from 'dotenv';
import DetectLanguage from 'detectlanguage';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { wordDetectLanguagePayload } from '../../../type/payloadType';
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail';
// Router
const word = express.Router();
const EVENT_TYPE: EventType = "word:detectLanguage";
dotenv.config();

word.use(pathFinder(EVENT_TYPE), OTM.onlyToAdminMdl);
word.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

word.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent;

  // Data validation
  if (typeof RE.requesterInputData !== 'string') {
    const sending = ctGateway(RE, "LogicallyDenied", "Type of iamValidatedEvent.requesterData is wrong; requires string");
    return res.status(sending.status!).send(sending);
  };

  // Data validation of env key
  const detectLanguageApiKey = process.env.DETECT_LANGUAGE_API_KEY;
  if (!detectLanguageApiKey) {
    const sending = ctGateway(RE, "LogicallyDenied", "Internal error: Wordy-cloud is missing internal detectLanguageApiKey info");
    return res.status(sending.status!).send(sending);
  };

  // Initialize detecter
  const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_API_KEY!);

  // Detecting begins
  detectlanguage.detect(RE.requesterInputData)
    .then((response: any) => {
      RE.payload = response as wordDetectLanguagePayload;

      const sending = ctGateway(RE, "Accepted");
      return res.status(sending.status!).send(sending);
    })
    .catch(() => {      
      const sending = ctGateway(RE, "Denied");
      return res.status(sending.status!).send(sending);
    })
});

export default word;