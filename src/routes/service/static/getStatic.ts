
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
import express, { Request, Response } from 'express'
// import moment from 'moment' // You may enable this to check the time
// type
import Wrn from '../../../type/wrn'
import { IS_DEV_MODE } from '../../../server'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { StaticGetStaticInput, StaticGetStaticPayload } from '../../../type/payloadType'
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
const EVENT_TYPE: EventType = "static:getStatic";
dotenv.config();

router.use(pathFinder(EVENT_TYPE), OTM.onlyToAdminMdl)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const { objectWrn, staticWrns } = RE.requesterInputData as StaticGetStaticInput
  const ownerWrn = RE.requesterWrn as Wrn
  const urls = []

  // AWS
  const credentials = {
    accessKeyId: process.env["AWS_SDK_ID"],
    secretAccessKey: process.env["AWS_SDK_SECRET"],
    region: 'ap-northeast-1'
  }
  const s3 = new AWS.S3(credentials)

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