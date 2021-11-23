
// Main
import express, { Request, Response } from 'express'
// import moment from 'moment' // You may enable this to check the time
// type
import Wrn from '../../../type/wrn'
import { IS_DEV_MODE } from '../../../server'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticGetStaticInput, StaticGetStaticPayload, StaticPostStaticInput } from '../../../type/payloadType'
import { PostStaticErrorCode } from '../../../type/errorCode'
import { StaticAskPermissionForPostStaticInput } from '../../../type/payloadType'
// Lambda
import { buildS3Url } from '../../../internal/compute/backendWambda'
// Library
import AWS from 'aws-sdk'
import dotenv from 'dotenv';
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "static:postStatic";
dotenv.config()
export const POST_STATIC_OTM_TYPE: OTM.OTM_TYPE = "ONLY_TO_ADMIN"

const MAX_FILE_SIZE_MB = 5 * 1024 * 1024
const MAX_FILE_NUMBERS = 1

export const uploadedFileValidation = (userInput: StaticAskPermissionForPostStaticInput): {
  unauthorized: boolean, postStaticErrorCode: PostStaticErrorCode
} => {
  console.log(userInput)
  const { totalFileSize, numberOfFiles } = userInput

  if (numberOfFiles === 0 || totalFileSize === 0) return {
    unauthorized: true, postStaticErrorCode: "data_not_given"
  }
  
  if (totalFileSize > MAX_FILE_SIZE_MB) return {
    unauthorized: true, postStaticErrorCode: "data_too_big"
  }

  if (numberOfFiles > MAX_FILE_NUMBERS) return {
    unauthorized: true, postStaticErrorCode: "exceed_max_number_of_files_uploadable"
  }

  return { unauthorized: false, postStaticErrorCode: "no_error" }
}

router.use(pathFinder(EVENT_TYPE), OTM.returnOtmWithOtmType(POST_STATIC_OTM_TYPE))
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const { fileData } = RE.requesterInputData as StaticPostStaticInput
  const ownerWrn = RE.requesterWrn as Wrn

  //

  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)

})

export default router