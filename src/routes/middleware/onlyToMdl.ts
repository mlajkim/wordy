import {  NextFunction, Request, Response } from 'express';
// Type
import { WordyEvent, EventType } from '../../type/wordyEventType';
// Internal
import { iamGateway } from '../../internal/security/iam';
import { ctGateway } from '../../internal/management/cloudTrail';
// Value
import { IS_DEV_MODE } from '../../server';
// Library
import mongoose from 'mongoose';

export type OTM_TYPE = "ONLY_TO_ADMIN"

export const returnOtmWithOtmType = (type: OTM_TYPE) => {
  if (type === "ONLY_TO_ADMIN") return onlyToAdminMdl
  else return onlyToAdminMdl
}

export const connectToMongoDB = (_req: Request, _res: Response, next: NextFunction) => {
  if (IS_DEV_MODE) {
    const url = process.env.LOCAL_MONGO_SERVER_URL as string
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    
  } 
  
  else {
    const MONGO_OWNER_NAME = process.env.MONGO_OWNER_NAME
    const MONGO_CLUSTER_PASSWORD = process.env.MONGO_CLUSTER_PASSWORD
    const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME
    const url = `mongodb+srv://${MONGO_OWNER_NAME}:${MONGO_CLUSTER_PASSWORD}@${MONGO_DATABASE_NAME}`
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  }

  next()
}

export const DISABLED_EVENT_MDL = (req: Request, res: Response) => {
  const RE = req.body as WordyEvent

  const sending = ctGateway(RE, "Denied", `This event ${RE.eventType} is currently disabled to all (including admins)`)
  return res.status(sending.status!).send(sending)
}

export const onlyToWordyMemberMdl = async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = iamGateway(req.body, "wrn::wp:pre_defined:backend:only_to_wordy_member:210811") as WordyEvent; // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied", "Denied by IAM GATEWAY")
    return res.status(sending.status!).send(sending)
  }

  // Validation complete
  req.body = RE
  next()
}

export const onlyToAdminMdl = async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = iamGateway(req.body, "wrn::wp:pre_defined:backend:only_to_admin:210811") as WordyEvent // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied", "This event is currently open only to admin")
    return res.status(sending.status!).send(sending)
  }

  // Validation complete
  req.body = RE
  next()
}

export const openToPublic = async (req: Request, res: Response, next: NextFunction) => {
  // Validation with IAM
  const RE = iamGateway(req.body, "wrn::wp:pre_defined:backend:dangerously_public:210811") as WordyEvent // validate with iamGateway
  if (RE.serverResponse !== "Accepted") {
    const sending = ctGateway(RE, "Denied", "Denied by IAM GATEWAY")
    return res.status(sending.status!).send(sending)
  }

  // Validation complete
  req.body = RE
  next()
}


// This should be called only when it is not denied by permission
export const addValidatedByThisService = async (req: Request, _res: Response, next: NextFunction) => {
  const wordyEvent = req.body.eventType as EventType
  req.body.validatedBy 
    ? req.body.validatedBy.push(wordyEvent) 
    : req.body.validatedBy = [wordyEvent]

  next()
}