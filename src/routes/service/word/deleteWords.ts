// Main
import express, { Request, Response } from 'express'
// Type
import { Resource } from '../../../type/resourceType'
import { WordDeleteWordsInput } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { WordModel } from '../../../models/EncryptedResource'
import LegacyWordModel from '../../../models/Words'
// Lambda
import { wordyDecrypt } from '../../../internal/compute/backendWambda'
import { extractLegacyId } from '../../../type/sharedWambda'
// Middleware
import * as OTM from '../../middleware/onlyToMdl'
// internal
import { ctGateway } from '../../../internal/management/cloudTrail'
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
  const { words } = RE.requesterInputData as WordDeleteWordsInput;
  const wrns = words.map(word => word.wrn)

  for (const word of words) {
    if (typeof word.imageWrns === "object" && word.imageWrns.length > 0) {
      const ERROR_MESSAGE = "One or more received words data contain imageWrns, which should be deleted first."
      const sending = ctGateway(RE, "LogicallyDenied", ERROR_MESSAGE)
      return res.status(sending.status!).send(sending)
    }
  }

  // ! 1) Handle Latest
  const ER = await WordModel.find({ wrn: { $all: wrns }}) as Resource[] | null
  if (ER) {
    const modifableData = ER.map(el => wordyDecrypt(el, RE)).filter(el => el.resoureAvailability === "Visible")
    await WordModel.deleteMany({ wrn: { $all: modifableData.map(el => el.wrn) } })
  }

  // ! 2) Handle Legacy
  const legacyIds = words
  .filter(el => el.legacyId !== "")
  .map(word => extractLegacyId("word", word.wrn))
  .filter(data => data.isSuccess)
  .map(data => data.legacyId)

  await LegacyWordModel.deleteMany({ _id: { $all: legacyIds }})

  // Return
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)
})

export default router