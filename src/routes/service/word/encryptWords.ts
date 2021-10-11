// Main
import express, { Request, Response } from 'express'
// Type
import { WordsEncryptWordsInput, WordsEncryptWordsPayload } from '../../../type/payloadType'
// Lambda
import { convertLegacyWordIntoPureWord } from '../../../type/sharedWambda'
// Middleware
import * as OTM from '../../middleware/onlyToMdl'
// Mogno DB
import { WordModel, ResCheck } from '../../../models/EncryptedResource'
import legacyWordModel from '../../../models/Words'
// internalw
import { ctGateway } from '../../../internal/management/cloudTrail'
import { wordyEncrypt, generatedWrn } from '../../../internal/compute/backendWambda'
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "word:encryptWords";

// Only modifable to owner the resource
router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl)
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { words } = RE.requesterInputData as WordsEncryptWordsInput;

  const RP = words
  .map(async(word) => {
    // remove legacy data and everything .. here
    const { legacyId } = word
    word.legacyId = ""
    word.isEncrypted = true
    word.imageWrn = []
    
    const newWrn = generatedWrn(`wrn::word:${word.sem}:mdb::`)
    const encrypted = wordyEncrypt(word,newWrn, RE, "wrn::wp:pre_defined:backend:only_owner:210811")

    const saved = await new WordModel(ResCheck(encrypted)).save()
    if (saved) {
      await legacyWordModel.findOneAndDelete({ _id: legacyId })
      return saved
    }
  })
  
  RE.payload = { encryptedWords: RP } as WordsEncryptWordsPayload
  const sending = ctGateway(RE, "Accepted");
  return res.status(sending.status!).send(sending);
})

export default router