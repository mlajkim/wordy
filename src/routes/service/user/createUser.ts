// Main
import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
// type
import { UserCreateUserPayload, UserCreateUserInput } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType'
import Wrn from '../../../type/wrn'
import { JwtData } from '../../../type/availableType'
import { Resource, UserPure } from '../../../type/resourceType'
import { convertFederalProvider } from '../../../type/sharedWambda'
import { intoResource, generatedWrn, generateJwt } from '../../../internal/compute/backendWambda'
import { GOOGLE_CLIENT_ID } from '../../../type/predefined'
// Middleware
import * as OTM from '../../middleware/onlyToMdl'
// External Library
import { OAuth2Client } from 'google-auth-library'
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource'
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "user:createUser"
dotenv.config()
const TOKEN_DEFAULT_EXPIRING_IN = 1000 * 60 * 60 * 24 * 7 // 7 days
// DECLARE
const adminList = [
  {
    federalId: "116355363420877047854",
    adminName: "ADMIN_AJ_KIM"
  }
]

// Who can use this router? Connects to MongoDB?
router.use(pathFinder(EVENT_TYPE), OTM.openToPublic)
router.use(pathFinder(EVENT_TYPE), OTM.connectToMongoDB)
router.use(pathFinder(EVENT_TYPE), OTM.addValidatedByThisService)

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare 
  const RE = req.body as WordyEvent; // receives the event

  // Data validation
  const requesterInputData = RE.requesterInputData as UserCreateUserInput;

  // Validate it. since we only take google sign in at this point, I can go straight check
  const kimGoogleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

  // validating the give token
  async function verify() {
    const ticket = await kimGoogleClient.verifyIdToken({
        idToken: requesterInputData.validatingToken,
        audience: GOOGLE_CLIENT_ID,  // Speci
    })
    
    return ticket
  };
  verify()
    .then(async (ticket) => {
      // FYI: Find relating stuff. existing WRN will have hash key that is random.
      // Check if the user already exists (this is encryptedData)
      const wrnWithoutPrivateId: Wrn = `wrn::user:${convertFederalProvider('google')}:mdb:${ticket.getUserId()!}:`;
      const encryptedUserResource = await UserModel.findOne({ wrn: { $regex: `${wrnWithoutPrivateId}.*`} }) as Resource | null;

      // if such user already exists, you cannot do createUser
      // Possible Logical Trap
      if (encryptedUserResource) {
        RE.serverResponse = "LogicallyDenied";
        RE.serverMessage = `user ${encryptedUserResource.wrn} already exists`;

        const alreadyExistingJwt: JwtData = {
          wrn: encryptedUserResource.wrn, federalProvider: 'google', federalId: `${ticket.getUserId()}`,
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
      const wrn: Wrn = generatedWrn(`wrn::user:${convertFederalProvider('google')}:mdb:${ticket.getUserId()}:`);

      // get adminData
      let adminName: undefined | string = undefined;
      const idx = adminList.findIndex(el => el.federalId === ticket.getUserId());
      if (idx !== -1) adminName = adminList[idx].adminName;
      
      // generate jwt & cookie
      const jwtData: JwtData = {
        wrn,
        federalProvider: 'google', // hard codeded google
        federalId: `${ticket.getUserId()}`,
        adminName,
        ln: 'en'
      }
      const jwt = generateJwt(jwtData);

      // confirm new resource
      const newResource: UserPure = {
        federalProvider: 'google',
        federalId: ticket.getUserId() as string,
        lastName: ticket.getPayload()!.family_name as string,
        adminName
      };
      const newUserResource = intoResource(newResource, wrn, RE, "wrn::wp:pre_defined:backend:only_owner:210811", {
        // This must be specified, as new 
        ownerWrn: wrn, createdByWrn: wrn
      });

      // finally create
      await new UserModel(newUserResource).save()
        .then(() => {
          RE.payload = newResource as UserCreateUserPayload;
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
    })
    .catch(() => {
      // means Google has failed to validate your token
      RE.serverResponse = "Denied";
      RE.serverMessage = "Your given token was not validated by your federal provider (Google)"
      return res.send(RE);
    });

    return RE;
});

export default router;