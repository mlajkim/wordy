// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrGetMyOkrInput, OkrGetMyOkrPayload } from '../../../type/payloadType';
import { Wrn } from '../../../type/availableType';
import { Resource, OkrLinkPure } from '../../../type/resourceType';
import { convertFederalProvider } from '../../../type/sharedWambda';
// Middleware
import { onlyToWordyMemberMdl, addValidatedByThisService } from '../../middleware/onlyToMdl';
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
const EVENT_TYPE: EventType = "okr:getMyOkr";
dotenv.config();

// comment
router.use(onlyToWordyMemberMdl);
router.use(connectToMongoDB);
router.use(addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event
  const { userLink, tempAccessToken } = RE.requesterInputData as OkrGetMyOkrInput;

  let regexCondition: Wrn | undefined = RE.requesterWrn;
    
  // check if such link exsits
  if (typeof userLink === "string" && userLink.length > 0) {
    const customizedOkrLinkWrn: Wrn = `wrn::okr:custom_link:mdb::` 
    const foundRes = await CustomizedOkrLinkModel.findOne({ wrn: customizedOkrLinkWrn });
    if (foundRes) { // if such link exists
      const { targetOwnerWrn } = intoPayload(foundRes, RE) as OkrLinkPure;
      regexCondition = targetOwnerWrn;
    } 
    else regexCondition = `wrn::user:${convertFederalProvider('google')}:mdb:${userLink.slice(2)}:`;
  }
  console.log(regexCondition);

  const myOkrData = await MyOkrModel.findOne({ ownerWrn: { $regex: `${regexCondition}.*`} }) as Resource | null;
  
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