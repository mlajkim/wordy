// Main
import express, { Request, Response } from 'express'
// Type
import Wrn, { DataType } from '../../../type/wrn'
import { WordDeleteWordsInput, WordDeleteWordsPayload, GeneralDeletionPayload } from '../../../type/payloadType'
// Lambda
import { validateWrn } from '../../../type/sharedWambda'
import { removeResources } from '../../../internal/compute/backendWambda'
// Middleware
import * as OTM from '../../middleware/onlyToMdl'
// Mogno DB
import { WordModel } from '../../../models/EncryptedResource'
import legacyWordModel from '../../../models/Words'
// internal
import { ctGateway } from '../../../internal/management/cloudTrail'
import { wordyEncrypt } from '../../../internal/compute/backendWambda'
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
// Router
const router = express.Router()
const EVENT_TYPE: EventType = "word:deleteWords"

// Only modifable to owner the resource
router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl)
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Declare + Save Record
  const RE = req.body as WordyEvent;
  const { deletingWrns } = RE.requesterInputData as WordDeleteWordsInput;

  RE.payload = removeResources(RE, deletingWrns, `word:*`) as WordDeleteWordsPayload
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)
})

export default router