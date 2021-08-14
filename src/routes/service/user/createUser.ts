// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { UserCreateUserPayload, UserCreateUserInput } from '../../../type/payloadType';
import { pathFinder, WordyEvent } from '../../../type/wordyEventType';
import { JwtData, Wrn } from '../../../type/availableType';
import { Resource, UserPure } from '../../../type/resourceType';
import { convertFederalProvider } from '../../../type/sharedWambda';
// Middleware
import { openToPublic, addValidatedByThisService } from '../../middleware/onlyToMdl';
// External Library
import { OAuth2Client } from 'google-auth-library';
// Library
import { generateJwt } from '../../../internal/security/wat';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { intoResource, generatedWrn } from '../../../internal/compute/backendWambda';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "user:createUser";
dotenv.config();

// Who can use this router? Connects to MongoDB?
router.use(openToPublic);
router.use(connectToMongoDB);
router.use(addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare 
  const RE = req.body as WordyEvent; // receives the event

  // Data validation
  const requesterInputData = RE.requesterInputData as UserCreateUserInput;

  // Validate it. since we only take google sign in at this point, I can go straight check
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const kimGoogleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

  // validating the give token
  async function verify() {
    const ticket = await kimGoogleClient.verifyIdToken({
        idToken: requesterInputData.validatingToken,
        audience: GOOGLE_CLIENT_ID,  // Speci
    });
    
    return ticket;
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
        RE.serverMessage = `user ${encryptedUserResource.wrn} already exists`
        return res.send(RE);
      };

      // user resouce does not have private id as, it is hard to find
      const wrn: Wrn = generatedWrn(`wrn::user:${convertFederalProvider('google')}:mdb:${ticket.getUserId()}:`);
      
      // generate jwt & cookie
      const jwtData: JwtData = {
        wrn,
        federalProvider: 'google', // hard codeded google
        federalId: `${ticket.getUserId()}`
      }
      const jwt = generateJwt(jwtData);

      // confirm new resource
      const newResource: UserPure = {
        federalProvider: 'google',
        federalId: ticket.getUserId() as string,
        lastName: ticket.getPayload()!.family_name as string
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

          const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days
          // Only when validated, it sends the 
          res.cookie("WordyAccessToken", jwt, {
            sameSite: 'strict', 
            path: '/', 
            expires: new Date(new Date().getTime() + expiresIn), // 1 year
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