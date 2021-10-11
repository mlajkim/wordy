// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { UserGoogleSignInInput } from '../../../type/payloadType';
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { JwtData } from '../../../type/availableType';
import Wrn from '../../../type/wrn'
import { Resource, UserPure } from '../../../type/resourceType';
import { convertFederalProvider } from '../../../type/sharedWambda';
import { wordyEncrypt, generatedWrn, generateJwt } from '../../../internal/compute/backendWambda'
// Middleware
import * as OTM from '../../middleware/onlyToMdl';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "user:googleSignIn";
dotenv.config();
const TOKEN_DEFAULT_EXPIRING_IN = 1000 * 60 * 60 * 24 * 7; // 7 days
// DECLARE
const adminList = [
  {
    federalId: "116355363420877047854",
    adminName: "ADMIN_AJ_KIM"
  }
]

// Who can use this router? Connects to MongoDB?
router.use(pathFinder(EVENT_TYPE), OTM.openToPublic);
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB);
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare 
  const RE = req.body as WordyEvent; // receives the event

  // Data validation
  const { googleUniqueId, familyName } = RE.requesterInputData as UserGoogleSignInInput;

  // FYI: Find relating stuff. existing WRN will have hash key that is random.
  // Check if the user already exists (this is encryptedData)
  const wrnWithoutPrivateId: Wrn = `wrn::user:${convertFederalProvider('google')}:mdb:${googleUniqueId}:`;
  const encryptedUserResource = await UserModel.findOne({ wrn: { $regex: `${wrnWithoutPrivateId}.*`} }) as Resource | null;

  // if such user already exists, you cannot do createUser
  // Possible Logical Trap
  if (encryptedUserResource) {
    RE.serverResponse = "LogicallyDenied";
    RE.serverMessage = `user ${encryptedUserResource.wrn} already exists`;

    const alreadyExistingJwt: JwtData = {
      wrn: encryptedUserResource.wrn, federalProvider: 'google', federalId: `${googleUniqueId}`,
      ln: 'en'
    }
    const signedWat = generateJwt(alreadyExistingJwt);

    // I need to assign token
    res.cookie("WordyAccessToken", signedWat, {
      sameSite: 'strict', 
      path: '/', 
      expires: new Date(new Date().getTime() + TOKEN_DEFAULT_EXPIRING_IN), // 1 year
      httpOnly: true,
      secure: true
    });
    return res.send(RE);
  };

  // user resouce does not have private id as, it is hard to find
  const wrn: Wrn = generatedWrn(`wrn::user:${convertFederalProvider('google')}:mdb:${googleUniqueId}:`);

  // get adminData
  let adminName: undefined | string = undefined;
  const idx = adminList.findIndex(el => el.federalId === googleUniqueId);
  if (idx !== -1) adminName = adminList[idx].adminName;
  
  // generate jwt & cookie
  const jwtData: JwtData = {
    wrn,
    federalProvider: 'google', // hard codeded google
    federalId: `${googleUniqueId}`,
    adminName,
    ln: 'en'
  }
  const jwt = generateJwt(jwtData);

  // confirm new resource
  const newResource: UserPure = {
    federalProvider: 'google',
    federalId: googleUniqueId,
    lastName: familyName,
    adminName
  };
  const newUserResource = wordyEncrypt(newResource, wrn, RE, "wrn::wp:pre_defined:backend:only_owner:210811", {
    // This must be specified, as new 
    ownerWrn: wrn, createdByWrn: wrn
  });

  // finally create
  await new UserModel(newUserResource).save()
    .then(() => {
      RE.serverResponse = "Accepted";
      RE.serverMessage = "OK"

      
      // Only when validated, it sends the 
      res.cookie("WordyAccessToken", jwt, {
        sameSite: 'strict', 
        path: '/', 
        expires: new Date(new Date().getTime() + TOKEN_DEFAULT_EXPIRING_IN), // 1 year
        httpOnly: true,
        secure: true
      })

      return res.send(RE);
    })
    .catch(() => {
      RE.serverResponse = "Denied";
      RE.serverMessage = "Somehow has failed to save into mongodb"
      return res.send(RE);
  });


  return RE;
});

export default router;