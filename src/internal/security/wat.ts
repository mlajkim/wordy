// External Library
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { NextFunction, Request, Response } from 'express';
// type
import { WordyEvent, EventType } from '../../type/wordyEventType';
import { Gateway, AssignedIdentity } from '../../type/availableType';
// Declare
dotenv.config();
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 5;
const SERVICE_NAME: Gateway = "watGateway"
const NOT_REQUIRING_WAT_EVENTS: EventType[] = [
  "user:createUser", 
  "okr:getMyOkr",
  "okr:getOkrObject",
  "okr:getOkrContainer",
  "wss:signOut"
];

export const generateJwt = (data: any) => {
  // Declare using dotenv
  dotenv.config();

  const signedJwt = jwt.sign(
    data, // this data is actually readable without key. 
    process.env.WORDY_ACCESS_TOKEN_JWT!, 
    {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d` 
  }); 

  return signedJwt;
};

// okr:getMyOkr is available to anyone, even without token. 

// WordyAccessToken Service
export const watGateway = (req: Request, res: Response, next: NextFunction) => {
  // get httponly token from header
  const httpOnlyToken = req.cookies.WordyAccessToken; // Aug 15, 2021 -> darkLighTmodcookie, loigin WAT G_AUTHUSER_H
  const RE = req.body as WordyEvent;

  // Record
  req.body.validatedBy 
    ? req.body.validatedBy.push(SERVICE_NAME) 
    : req.body.validatedBy = [SERVICE_NAME];
    
  jwt.verify(httpOnlyToken!, process.env.WORDY_ACCESS_TOKEN_JWT!, (err: any, data: any) => {
    if (err) {
      // Validated if action does not require jwt token
      const idx = NOT_REQUIRING_WAT_EVENTS.findIndex(event => event === RE.eventType);
      if (idx !== -1) {
        // FYI
        // if it fails to read the data, the retruning data will be undefined

        const identity: AssignedIdentity = "wrn::backend_assigned_identity:anonymous_public:internal::";
        RE.requesterWrn = identity;
        return next(); // you are free to go, even w/o WAT
      };

      RE.serverResponse = "Denied";
      RE.serverMessage = `Your requested event ${RE.eventType} was rejected by jwtService due to absense or invalid WordyAccessToken`;
      return res.status(202).send(RE);
    } else {
      // validated, no err
      RE.requesterInfo = data;
      RE.requesterWrn = data.wrn;
      next();
    }
  });
};
