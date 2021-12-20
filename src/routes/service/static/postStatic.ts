
// Main
import express, { Request, Response } from 'express'
// import moment from 'moment' // You may enable this to check the time
// type
import Wrn from '../../../type/wrn'
import { IS_DEV_MODE } from '../../../server'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticPostStaticPayload, StaticPostStaticInput } from '../../../type/payloadType'
import { PostStaticErrorCode } from '../../../type/errorCode'
import { StaticAskPermissionForPostStaticInput } from '../../../type/payloadType'
// Lambda
import { buildS3Url, generatedWrn } from '../../../internal/compute/backendWambda'
// MDB
import legacyWordModel from '../../../models/Words'
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

router.use(pathFinder(EVENT_TYPE), OTM.returnOtmWithOtmType(POST_STATIC_OTM_TYPE))
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)
router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const { objectWrn, word, fileData } = RE.requesterInputData as StaticPostStaticInput
  const ownerWrn = RE.requesterWrn as Wrn
  const addedStaticWrns: Wrn[] = []

  // AWS
  const s3 = new AWS.S3({
    accessKeyId: process.env["AWS_SDK_ID"],
    secretAccessKey: process.env["AWS_SDK_SECRET"],
    region: 'ap-northeast-1'
  })

  for (const datum of fileData) {
    const staticDataWrn: Wrn = generatedWrn(`wrn::static:image:tokyo-s3::`);
    const { bucketName, keyName } = buildS3Url(ownerWrn, objectWrn, staticDataWrn, IS_DEV_MODE)

    try {
      const buf = Buffer.from(datum.replace(/^data:image\/\w+;base64,/, ""),'base64')
      await s3.putObject({
        Bucket: bucketName,
        Key: keyName, // File name you want to save as in S3
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      }).promise()
      addedStaticWrns.push(staticDataWrn)
    }
    catch (err) {
      console.log(`Error From AWS:: (Written by AJ Kim) ${err}`)
    }  
  }

  // Edit
  await legacyWordModel.findOneAndUpdate({ _id: word.legacyId  }, {
    imageWrns: [...word.imageWrns, ...addedStaticWrns ]
  }, {useFindAndModify: false})

  RE.payload = { addedStaticWrns } as StaticPostStaticPayload
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)

})

export const uploadedFileValidation = (userInput: StaticAskPermissionForPostStaticInput): {
  unauthorized: boolean, postStaticErrorCode: PostStaticErrorCode
} => {
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

export default router