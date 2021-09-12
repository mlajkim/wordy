
/**
 * 
 * This was written on Sep 13, 2021
 * This is very simple router that asks for encrpyted word data only
 * was going to build with the legacy too, but then it takes so much time
 * as I got a new job and wants to focus on that.
 * So all I did was get the searchbar and just work on it.
 * Hopefully I can use it later in the future, probably next year? haha
 */



// Main
import express, {  Request, Response } from 'express';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { WordGetWordInput, WordGetWordPayload } from '../../../type/payloadType';
// import { Wrn } from '../../../type/availableType';
import { Resource, ResourceId, WordPure } from '../../../type/resourceType';
// Lambda
import { intoPayload } from '../../../internal/compute/backendWambda';
// Model
import { WordModel } from '../../../models/EncryptedResource';
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail';
// Router
const word = express.Router();
const EVENT_TYPE: EventType = "word:getWord";

word.use(pathFinder(EVENT_TYPE), OTM.onlyToAdminMdl);
word.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

word.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent;

  // Data validation
  const { sem } = RE.requesterInputData as WordGetWordInput;
  console.log(sem);

  // Find the word with the sem data from encrypted daat (TEMP)
  // This is the newest version
  const wrnWithoutPrivateId = `wrn::word:${sem}:mdb:`
  const encryptedWordResource = await WordModel.find({ 
    ownerWrn: RE.requesterWrn, wrn: { $regex: `${wrnWithoutPrivateId}.*`} 
  }) as Resource[] | null;

  // handle error, empty
  if (!encryptedWordResource) {
    const sending = ctGateway(RE, "LogicallyDenied", "Data not found");
    return res.status(sending.status!).send(sending);
  }

  // handle apigateway data (Decrpyt)
  const decrypted: WordGetWordPayload = [];
  if (encryptedWordResource !== null) {
    for (const eachRes of encryptedWordResource) {
      const decryptedRes = intoPayload(eachRes, RE) as ResourceId & WordPure;
      decrypted.push(decryptedRes);
    };
  };

  // Apply found payload
  RE.payload = decrypted;

  // Successful API call 
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
});

export default word;