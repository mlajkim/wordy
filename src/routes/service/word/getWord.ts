
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
import express, {  Request, Response } from 'express'
import moment from 'moment'
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import { WordGetWordInput, WordGetWordPayload } from '../../../type/payloadType'
import { LegacyPureWord } from '../../../type/legacyType'
import { Resource, ResourceId, WordPure } from '../../../type/resourceType'
// Lambda
import { wordyDecrypt } from '../../../internal/compute/backendWambda'
// Model
import { WordModel } from '../../../models/EncryptedResource'
import LegacyWordModel from '../../../models/Words'
// mdl
import * as OTM from '../../middleware/onlyToMdl'
// Gatewa
import { ctGateway } from '../../../internal/management/cloudTrail'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "word:getWord";

router.use(pathFinder(EVENT_TYPE), OTM.onlyToWordyMemberMdl)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  const RE = req.body as WordyEvent
  const returningDecryptedData: WordGetWordPayload = []

  // Data validation
  const { sem, legacyMongoId } = RE.requesterInputData as WordGetWordInput;

  // ! 1) GET Encrypted Word Data
  // Find the word with the sem data from encrypted daat (TEMP)
  // This is the newest version
  const wrnWithoutPrivateId = `wrn::word:${sem}:mdb:`
  const encryptedWordResource = await WordModel.find({ 
    ownerWrn: RE.requesterWrn, wrn: { $regex: `${wrnWithoutPrivateId}.*`} 
  }) as Resource[] | null

  // handle apigateway data (Decrpyt)
  // My Macbook Pro: took 3.85 seconds for converting 19 encrypted words
  // How about my Mac Mini?: ?.?? seconds for converting 19 encrypted words...
  const before = moment().valueOf()
  if (encryptedWordResource !== null) {
    for (const eachRes of encryptedWordResource) {
      const decryptedRes = wordyDecrypt(eachRes, RE) as ResourceId & WordPure;
      returningDecryptedData.push(decryptedRes);
    }
  }
  console.log(`Took ${(moment().valueOf() - before) / 1000} seconds..`)

  // ! 2) GET Legacy Word & CONVERT INTO NEWLY FORMAT 
  // Get the legacy word data
  const legacyWords = await LegacyWordModel.find({ ownerID: legacyMongoId, sem }) as LegacyPureWord[];
  const converted = legacyWords.map(foundWord => {
    const { dateAdded, order, isFavorite, sem, language, tag, word, pronun, meaning, example, _id, ownerID } = foundWord;

    return {
      imageWrn: [], // legacy word does not have imageWnr
      wrn: `wrn::word:${sem}:mdb:${_id}:`,
      isEncrypted: false,
      ownerWrn: RE.requesterWrn!,
      objectOrder: order,
      // might add dateAdded;
      resoureAvailability: "Visible",
      dateAdded, isFavorite, sem, language, tag, word, pronun, meaning, example,
      // legacy
      legacyOwnerId: ownerID,
      legacyId: _id,
    } as ResourceId & WordPure
  });

  // ! 3) RETURN
  // Successful API call 
  returningDecryptedData.push(...converted); // Push the found legacy data
  RE.payload = returningDecryptedData; // Apply found payload
  const sending = ctGateway(RE, "Accepted")
  return res.status(sending.status!).send(sending)
})

export default router