// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// External Library
import { OAuth2Client } from 'google-auth-library';
import Cryptr from 'cryptr';
// import cookie from 'cookie';
// Library
import { generateJwt } from '../../../internal/security/wat';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { kmsService } from '../../../internal/security/kms';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { JwtData } from '../../../type/availableType';
import { Resource, UserResource } from '../../../type/resourceType';
import { UserCreateuser } from '../../../type/requesterInputType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "user:createUser";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

router.use(pathFinder(EVENT_TYPE), async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, "wrn::wp:pre_defined:backend:dangerously_public:210811"); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied')
    return res.send(iamValidatedEvent);

  // Validation complete
  req.body = iamValidatedEvent;
  next();
});

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare 
  const iamValidatedEvent = req.body as WordyEvent; // receives the event

  // by default
  iamValidatedEvent.serverResponse = "Denied";
  iamValidatedEvent.serverMessage = `${EVENT_TYPE} has rejected your request by default`;

  // Record
  iamValidatedEvent.validatedBy 
    ? iamValidatedEvent.validatedBy.push(SERVICE_NAME) 
    : iamValidatedEvent.validatedBy = [SERVICE_NAME]; 

  // Data validation
  const requesterInputData = iamValidatedEvent.requesterInputData as UserCreateuser;

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
      const wrn = `wrn::user:google:mdb:${ticket.getUserId()}`;

      // Check if the user already exists (this is encryptedData)
      const encryptedUserResource = await UserModel.findOne({ wrn }) as Resource | null;

      // if such user already exists, you cannot do createUser
      if (encryptedUserResource !== null) {
        iamValidatedEvent.serverResponse = "Denied";
        iamValidatedEvent.serverMessage = `user ${wrn} already exists`
        return res.send(iamValidatedEvent);
      };

      console.log(ticket);

      // create basic userResource based on given data
      const newUser: UserResource = {
        wrn,
        ownerWrn: wrn,
        federalProvider: 'google',
        federalId: ticket.getUserId() as string,
        lastName: ticket.getPayload()!.family_name as string
      };

      // Encrpytion method
      const kmsResult = kmsService("Encrypt", "");
      const { encrypt } = new Cryptr(kmsResult.plainkey);
      const plaindata: string = JSON.stringify(newUser);
      const ciphertextBlob = encrypt(plaindata);
      
      // generate jwt & cookie
      const jwtData: JwtData = {
        wrn,
        federalProvider: 'google', // hard codeded google
        federalId: `${ticket.getUserId()}`
      }
      const jwt = generateJwt(jwtData);

      // confirm new resource
      const newResource: Resource = {
        resourceVersion: "1.0.210804",
        wrn,
        ownerWrn: wrn,
        wpWrn: "wrn::wp:pre_defined:backend:only_owner:210811",
        encryptionMethod: kmsResult.encryptionMethod,
        cmkWrn: kmsResult.cmkWrn,
        encryptedDek: kmsResult.encryptedDek,
        ciphertextBlob
      };

      // finally create
      await new UserModel(newResource).save()
        .then(() => {
          iamValidatedEvent.payload = newResource;
          iamValidatedEvent.serverResponse = "Accepted";
          iamValidatedEvent.serverMessage = "OK"

          const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days
          // Only when validated, it sends the 
          res.cookie("WordyAccessToken", jwt, {
            sameSite: 'strict', 
            path: '/', 
            expires: new Date(new Date().getTime() + expiresIn), // 1 year
            httpOnly: true,
            secure: true
          })

          return res.send(iamValidatedEvent);
        })
        .catch(() => {
          iamValidatedEvent.serverResponse = "Denied";
          iamValidatedEvent.serverMessage = "Somehow has failed to save into mongodb"
          return res.send(iamValidatedEvent);
        });
    })
    .catch(() => {
      // means Google has failed to validate your token
      iamValidatedEvent.serverResponse = "Denied";
      iamValidatedEvent.serverMessage = "Your given token was not validated by your federal provider (Google)"
      return res.send(iamValidatedEvent);
    });

    return iamValidatedEvent;
});

export default router;