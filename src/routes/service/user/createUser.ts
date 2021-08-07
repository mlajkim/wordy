// Main
import express, {  Request, Response } from 'express';
import dotenv from 'dotenv';
// Library
const { OAuth2Client } = require('google-auth-library');
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { Policy } from '../../../typesBackEnd';
import { UserCreateuser } from '../../../type/requesterInputType';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
// Router
const router = express.Router();
const EVENT_TYPE = "user:createUser";
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

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") return res.send(requestedEvent);
  
  // Record
  requestedEvent.validatedBy 
      ? requestedEvent.validatedBy.push(SERVICE_NAME) 
      : requestedEvent.validatedBy = [SERVICE_NAME]; 

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, POLICY); // validate with iamGateway
  if(iamValidatedEvent.serverResponse === 'Denied')
    return res.send(iamValidatedEvent);

  // Data validation
  const requesterInputData = requestedEvent.requesterInputData as UserCreateuser;

  // Validate it. since we only take google sign in at this point, I can go straight check
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const kimGoogleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

  async function verify() {
    await kimGoogleClient.verifyIdToken({
        idToken: requesterInputData.validatingToken,
        audience: GOOGLE_CLIENT_ID,  // Speci
    });
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify()
    .then(() => {
      // Check if the user already exists
      
      // if yes, then do not create (make sure to reject)

      // if not, create a new one and return wordySigninToken as well!
    })
    .catch(() => {
      // means Google has failed to validate your token
      requestedEvent.serverResponse = "Denied";
      requestedEvent.serverMessage = "Your given token was not validated by your federal provider (Google)"
      return res.send(requestedEvent);
    });
});

export default router;