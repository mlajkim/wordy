// Main
import express, { Request, Response } from 'express'
// Type
import { WordEditWordsInput, WordEditWordsPayload } from '../../../type/payloadType'
// Middleware
import * as OTM from '../../middleware/onlyToMdl'
// Mogno DB
import { WordModel } from '../../../models/EncryptedResource'
import legacyWordModel from '../../../models/Words'
// internalw
import { ctGateway } from '../../../internal/management/cloudTrail'
import { wordyEncrypt } from '../../../internal/compute/backendWambda'
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "word:editWords";

// Only modifable to owner the resource
router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl)
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const editedWords = RE.requesterInputData as WordEditWordsInput;

  for (const pureWordObject of editedWords) {

    // ! if (legacy)
    if (!pureWordObject.isEncrypted) {
      const extractedLegacyId = pureWordObject.legacyId
      await legacyWordModel.findOneAndUpdate({ _id: extractedLegacyId }, pureWordObject, {useFindAndModify: false})
      continue
    }

    // ! 3) Handle latest encrypted data
    const modifedEncryptedRes = wordyEncrypt(pureWordObject, pureWordObject.wrn, RE, pureWordObject.wpWrn)
    await WordModel.findOneAndUpdate({ wrn: pureWordObject.wrn }, modifedEncryptedRes, { useFindAndModify: false })
  }

  RE.payload = editedWords as WordEditWordsPayload
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
})

export default router