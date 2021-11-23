
// Main
import express, { Request, Response } from 'express'
// import moment from 'moment' // You may enable this to check the time
// type
import Wrn from '../../../type/wrn'
import { IS_DEV_MODE } from '../../../server'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticGetStaticInput, StaticGetStaticPayload } from '../../../type/payloadType'
import { PostStaticErrorCode } from '../../../type/errorCode'
import { StaticAskPermissionForPostStaticInput } from '../../../type/payloadType'
// Lambda
import { buildS3Url } from '../../../internal/compute/backendWambda'
// Library
const AWS = require('aws-sdk')
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
  const { totalFileSize, numberOfFiles } = userInput
  
  if (totalFileSize > MAX_FILE_SIZE_MB) return {
    unauthorized: true, postStaticErrorCode: "data_too_big"
  }

  if (numberOfFiles > MAX_FILE_NUMBERS) return {
    unauthorized: true, postStaticErrorCode: "exceed_max_number_of_files_uploadable"
  }

  return { unauthorized: true, postStaticErrorCode: "no_error" }
}

router.use(pathFinder(EVENT_TYPE), OTM.returnOtmWithOtmType(POST_STATIC_OTM_TYPE))
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const { objectWrn, staticWrns } = RE.requesterInputData as StaticGetStaticInput
  const ownerWrn = RE.requesterWrn as Wrn
  const urls = []

  // AWS
  
  const accessKeyId = process.env["AWS_SDK_ID"];
  const accessKeySecret= process.env["AWS_SDK_SECRET"];

  const credentials = {
    accessKeyId: accessKeyId,
    secretAccessKey: accessKeySecret,
    region: 'ap-northeast-1'
  }

  const s3 = new AWS.S3(credentials)

  AWS.config.update({ accessKeyId, secretAccessKey: accessKeySecret })
  const signedUrlExpireSeconds = 60

  for (const staticWrn of staticWrns) {
    const { bucketName, keyName } = buildS3Url(ownerWrn, objectWrn, staticWrn, IS_DEV_MODE)
    const params = { Bucket: bucketName, Key: keyName , Expires: signedUrlExpireSeconds }
    const url = await s3.getSignedUrl('getObject', params)
    urls.push(url)
  }

  const payload: StaticGetStaticPayload = { urls }
  RE.payload = payload
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)

})

export default router