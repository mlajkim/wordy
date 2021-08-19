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
const ADMIN_LIST = [
  {
    federalId: "116355363420877047854",
    adminName: "ADMIN_AJ_KIM"
  }
]

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
      if (idx === -1) {
        RE.serverResponse = "Denied";
        RE.serverMessage = `Your requested event ${RE.eventType} was rejected by jwtService due to absense or invalid WordyAccessToken`;
        return res.status(202).send(RE);
      };

      
      const identity: AssignedIdentity = "wrn::backend_assigned_identity:anonymous_public:internal::";
      RE.requesterWrn = identity;
      return next(); // you are free to go, even w/o WAT
    };
    // admin data
    const isAdmin = ADMIN_LIST.find(el => el.federalId === data.federalId) ? true : false;
    
    // validated, no err
    RE.requesterInfo = { ...data, isWordyUser: true, isAdmin };
    RE.requesterWrn = data.wrn;
    next();
  });
};
