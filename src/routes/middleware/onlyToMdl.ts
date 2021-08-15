import {  NextFunction, Request, Response } from 'express';
// Type
import { WordyEvent, EventType } from '../../type/wordyEventType';
// Internal
import { iamGateway } from '../../internal/security/iam';
import { ctGateway } from '../../internal/management/cloudTrail';

export const onlyToWordyMemberMdl = (async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = req.body as WordyEvent;
  iamGateway(RE, "wrn::wp:pre_defined:backend:only_to_wordy_member:210811"); // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied");
    return res.status(sending.status!).send(sending);
  };

  // Validation complete
  req.body = RE;
  next();
}); 

export const onlyToAdminMdl = (async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = req.body as WordyEvent;
  iamGateway(RE, "wrn::wp:pre_defined:backend:only_to_admin:210811"); // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied");
    return res.status(sending.status!).send(sending);
  };

  // Validation complete
  req.body = RE;
  next();
}); 

export const openToPublic = (async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = req.body as WordyEvent;
  iamGateway(RE, "wrn::wp:pre_defined:backend:dangerously_public:210811"); // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied");
    return res.status(sending.status!).send(sending);
  };

  // Validation complete
  req.body = RE;
  next();
}); 


// This should be called only when it is not denied by permission
export const addValidatedByThisService = (async (req: Request, _res: Response, next: NextFunction) => {
  const wordyEvent = req.body.eventType as EventType;
  req.body.validatedBy 
    ? req.body.validatedBy.push(wordyEvent) 
    : req.body.validatedBy = [wordyEvent]; 

  next();
}); 