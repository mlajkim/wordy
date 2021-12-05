
// Main
import express, { Request, Response } from 'express'
// import moment from 'moment' // You may enable this to check the time
// type
import Wrn, { getPublicId } from '../../../type/wrn'
import { IS_DEV_MODE } from '../../../server'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticDeleteStaticInput } from '../../../type/payloadType'
// Lambda
import { buildS3Url } from '../../../internal/compute/backendWambda'
// Library
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gateway
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "static:deleteStatic";
dotenv.config();
import LegacyWordModel from '../../../models/Words'
import { LegacyPureWord } from '../../../type/legacyType'

router.use(pathFinder(EVENT_TYPE), OTM.onlyToAdminMdl)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const { objectWrn, staticWrn } = RE.requesterInputData as StaticDeleteStaticInput
  const ownerWrn = RE.requesterWrn as Wrn

  // ! Find the word first
  const findThis = { _id: getPublicId(objectWrn) }
  const foundWord = await LegacyWordModel.findOne(findThis) as LegacyPureWord | null
  if (!foundWord) {
    const ERROR_MESSAGE = "There is no such word found"
    const sending = ctGateway(RE, "Denied", ERROR_MESSAGE)
    return res.status(sending.status!).send(sending)
  }

  // ! Prepare AWS connection
  const credentials = {
    accessKeyId: process.env["AWS_SDK_ID"],
    secretAccessKey: process.env["AWS_SDK_SECRET"],
    region: 'ap-northeast-1',
  }
  const s3 = new AWS.S3(credentials)

  // ! Try to delete located at S3 of AWS
  const { bucketName, keyName } = buildS3Url(ownerWrn, objectWrn, staticWrn, IS_DEV_MODE)
  const params = { Bucket: bucketName, Key: keyName }
  try {
    await s3.deleteObject(params).promise()
  }
  catch (e) {
    console.log(e)
    const ERROR_MESSAGE = "Failed during deleting file in AWS S3"
    const sending = ctGateway(RE, "Denied", ERROR_MESSAGE)
    return res.status(sending.status!).send(sending)
  }

  // TODO: if S3 fails, return response!


  // ! If success, modify the word too.
  const removedImageWrns = foundWord.imageWrns.filter(wrn => wrn !== staticWrn)
  const modifyThis = { imageWrns: removedImageWrns}
  await LegacyWordModel.findOneAndUpdate(findThis, modifyThis, {useFindAndModify: false})

  // ! Return response of successful deletion
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)
})

export default router