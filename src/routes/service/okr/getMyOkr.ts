// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrGetMyOkrInput, OkrGetMyOkrPayload } from '../../../type/payloadType';
import { Wrn } from '../../../type/availableType';
import { OkrLinkPure } from '../../../type/resourceType';
// Middleware
import { onlyToWordyMemberMdl } from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// Mogno DB
import { MyOkrModel, CustomizedOkrLinkModel } from '../../../models/EncryptedResource';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:getMyOkr";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// comment
router.use(onlyToWordyMemberMdl);

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event
  const { userLink, tempAccessToken } = RE.requesterInputData as OkrGetMyOkrInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];  

  let findOneCondition = {}
    
  // check if such link exsits
  if (typeof userLink === "string" && userLink.length > 0) {
    const customizedOkrLinkWrn: Wrn = `wrn::okr:custom_link:mdb::` 
    const foundRes = await CustomizedOkrLinkModel.findOne({ wrn: customizedOkrLinkWrn });
    if (foundRes) { // if such link exists
      const { targetOwnerWrn } = intoPayload(foundRes, RE) as OkrLinkPure;
      findOneCondition = { ownerWrn: targetOwnerWrn }
    } else {
      findOneCondition = { ownerWrn: `wrn::user:google:mdb:${userLink.slice(2)}:` }
    }
  } else {
    findOneCondition = { ownerWrn: RE.identifiedAsWrn }
  }
  
  // if yes, get that data instead

  // if it is not provided, then just return the one that owner has.

  // if my okr exists, it should reject, as it shouldh ave only one
  const myOkrData = await MyOkrModel.findOne(findOneCondition); // returns null when not found
  
  if (myOkrData) {
    // decrypt the data
    RE.payload = { ...intoPayload(myOkrData, RE), userLink, tempAccessToken } as OkrGetMyOkrPayload
    ctGateway(RE, "Accepted");
    return res.status(RE.status!).send(RE);
  } else {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE);
  };
});

export default router;