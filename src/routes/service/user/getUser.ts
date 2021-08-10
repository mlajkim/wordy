// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// Library
import { OAuth2Client } from 'google-auth-library';
import Cryptr from 'cryptr';
// Mogno DB
import { UserModel } from '../../../models/EncryptedResource';
// internal
import { kmsService } from '../../../internal/security/kms';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Resource, UserResource } from '../../../type/resourceType';
import { Policy } from '../../../typesBackEnd';
import { UserCreateuser } from '../../../type/requesterInputType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "user:getUser";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

const POLICY: Policy = {
  version: "1.0.210729",
  comment: "Allow any user, enven without principal",
  statement: [
    {
      effect: "Allow",
      principal: "*",
      action: "*", 
    }
  ]
};

router.use(pathFinder(EVENT_TYPE), async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, POLICY); // validate with iamGateway
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

      // create basic userResource based on given data
      const newUser: UserResource = {
        wrn,
        ownerWrn: wrn,
        federalProvider: 'google',
        federalId: "google",
        lastName: "lastname"
      };

      // Get unecrypted object user from encrypted data
      const kmsResult = kmsService("Encrypt", "");

      // Decrpyt data
      const { encrypt } = new Cryptr(kmsResult.plainkey);
      const plaindata: string = JSON.stringify(newUser);
      const ciphertextBlob = encrypt(plaindata);

      // confirm new resource
      const newResource: Resource = {
        resourceVersion: "1.0.210804",
        wrn,
        ownerWrn: wrn,
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