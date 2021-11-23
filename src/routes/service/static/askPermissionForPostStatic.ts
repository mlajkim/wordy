
// Main
import express, { Request, Response } from 'express'
// type
import * as postStatic from './postStatic'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticAskPermissionForPostStaticInput, StaticAskPermissionForPostStaticPayload } from '../../../type/payloadType'
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "static:askPermissionForPostStatic";
// SETTING

router.use(pathFinder(EVENT_TYPE), OTM.returnOtmWithOtmType(postStatic.POST_STATIC_OTM_TYPE))
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent

  const { unauthorized, postStaticErrorCode } = postStatic.uploadedFileValidation(RE.requesterInputData as StaticAskPermissionForPostStaticInput)
  RE.payload = { unauthorized, error_code: postStaticErrorCode } as StaticAskPermissionForPostStaticPayload
  
  if (unauthorized) {
    const sending = ctGateway(RE, "Denied")
    return res.status(sending.status!).send(sending)
  }

  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)
})

export default router