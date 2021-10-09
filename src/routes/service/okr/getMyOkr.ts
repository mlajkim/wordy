// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Type
import { OkrGetMyOkrInput, OkrGetMyOkrPayload } from '../../../type/payloadType';
import Wrn from '../../../type/wrn'
import { Resource, OkrLinkPure } from '../../../type/resourceType';
import { convertFederalProvider } from '../../../type/sharedWambda';
// Middleware
import * as OTM from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { intoPayload } from '../../../internal/compute/backendWambda';
// Mogno DB
import { MyOkrModel, CustomizedOkrLinkModel } from '../../../models/EncryptedResource';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:getMyOkr";
dotenv.config();

// comment
router.use(pathFinder(EVENT_TYPE), OTM.openToPublic);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event
  const { userLink, tempAccessToken } = RE.requesterInputData as OkrGetMyOkrInput;
  
  // Check if this user is not even signed in & trying to access without ink
  if (
    typeof userLink === "string" 
    && userLink.length === 0 
    && RE.requesterWrn === "wrn::backend_assigned_identity:anonymous_public:internal::"
  ) {
    const sending = ctGateway(RE, "LogicallyDenied", "You are not signed in");
    sending.payload = { isSignedInCheckedByBackend: false };
    return res.status(sending.status!).send(sending);
  };

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
  };

  
  

  const myOkrData = await MyOkrModel.findOne({ ownerWrn: { $regex: `${regexCondition}.*`} }) as Resource | null;
  
  if (myOkrData) {
    // decrypt the data
    RE.payload = { ...intoPayload(myOkrData, RE), userLink, tempAccessToken, isSignedInCheckedByBackend: true } as OkrGetMyOkrPayload
    const sending = ctGateway(RE, "Accepted");
    return res.status(sending.status!).send(sending);
  } else {
    const sending = ctGateway(RE, "LogicallyDenied");
    return res.status(sending.status!).send(sending);
  };
});

export default router;