import {  NextFunction, Request, Response } from 'express';
// Type
import { WordyEvent } from '../../type/wordyEventType';
// Internal
import { iamGateway } from '../../internal/security/iam';
import { ctGateway } from '../../internal/management/cloudTrail';

export const onlyToWordyMemberMdl = (async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = req.body as WordyEvent;
  iamGateway(RE, "wrn::wp:pre_defined:backend:only_to_wordy_member:210811"); // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    ctGateway(RE, "Denied");
    return res.status(RE.status!).send(RE);
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
    ctGateway(RE, "Denied");
    return res.status(RE.status!).send(RE);
  };

  // Validation complete
  req.body = RE;
  next();
}); 


export const onlyToOwnerMdl = (async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = req.body as WordyEvent;
  iamGateway(RE, "wrn::wp:pre_defined:backend:only_owner:210811"); // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    ctGateway(RE, "Denied");
    return res.status(RE.status!).send(RE);
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
    ctGateway(RE, "Denied");
    return res.status(RE.status!).send(RE);
  };

  // Validation complete
  req.body = RE;
  next();
}); 