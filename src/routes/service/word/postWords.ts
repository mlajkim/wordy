
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
import Wrn from '../../../type/wrn'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { WordPostWordsInput } from '../../../type/payloadType'
// Lambda
import { generatedWrn, intoResource } from '../../../internal/compute/backendWambda'
// Model
import { WordModel, ResCheck } from '../../../models/EncryptedResource'
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "word:postWords";

router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl)
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)


router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent;
  const pureWordArr = RE.requesterInputData as WordPostWordsInput;

  let errorFound = false

  pureWordArr
    .map(pureWord => {
      // ! 1) Encrypt all given data
      const wordWrn: Wrn = generatedWrn(`wrn::word:${pureWord.sem}:mdb::`)
      return intoResource(pureWord, wordWrn, RE, "wrn::wp:pre_defined:backend:only_owner:210811")
    })
    .forEach(async (encryptedArr) => {
      // ! 2) Save each encrypted data
      await new WordModel(ResCheck(encryptedArr)).save()
        .catch(() => errorFound = true)
    })

  // ! 3) Error handling
  if (errorFound) {
    const sending = ctGateway(RE, "Denied");
  return res.status(sending.status!).send(sending)
  }

  // ! 5) Send back accepted.
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending)


});

export default router;