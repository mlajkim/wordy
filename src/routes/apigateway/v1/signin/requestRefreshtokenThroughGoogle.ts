import express, { Request, Response, NextFunction } from 'express';
import { connectToMongoDB } from '../../../../internal/mongo';
// Mongo Schema
import encryptedIdentifierSchema from '../../../../models/encryptedIdentifier';
// Shared
import { generateWrn } from '../../../../type/sharedWambda';
import { RequestRefreshtokenThroughGooglePayload } from '../../../../type/payloadType';
import { validateGoogleSigninToken } from '../../../../internal/backendWambda';
import { RequestRefreshtokenThroughGoogleResponse_V1 } from '../../../../type/eventResponseType';
import { Resource } from 'src/type/resourceType';

const generateRefreshToken = express.Router();
const RESOURCE_GROUP = "identifier";
const RESOURCE_TYPE = "google";
const DATABASE_CODE = "mdb";

// Checks if federalProvider is correct
generateRefreshToken.use(async (req: Request, res: Response, next: NextFunction) => {
  const payload: RequestRefreshtokenThroughGooglePayload = req.body.payload;

  if (payload.federalProvider !== 'google') {
    const response: RequestRefreshtokenThroughGoogleResponse_V1 = {
      responseType: "deny",
      message: "This API url only supports 'google' for federalProvider value",
      refreshtoken: "not_given",
      accesstoken: "not_given"
    }
    return res.status(403).send(response);
  }

  next();
});


// Validates given Google token through Formal Google signin API token validator
generateRefreshToken.use(async (req: Request, res: Response, next: NextFunction) => {
  const payload: RequestRefreshtokenThroughGooglePayload = req.body.payload;

  if (!validateGoogleSigninToken(payload.federalAuthorizationToken)) {
    const response: RequestRefreshtokenThroughGoogleResponse_V1 = {
      responseType: "deny",
      message: "Given federalAuthorizationToken value is invalid",
      refreshtoken: "not_given",
      accesstoken: "not_given"
    }
    return res.status(403).send(response);
  };

  next();
});

// Connects to MDB for checking
generateRefreshToken.use(connectToMongoDB);

// Returns refresh token and access token 
generateRefreshToken.use(async (req: Request, res: Response, next: NextFunction) => {
  const payload: RequestRefreshtokenThroughGooglePayload = req.body.payload;

  const wrn = generateWrn("", RESOURCE_GROUP, RESOURCE_TYPE, DATABASE_CODE, payload.federalId, "");
  const record: Resource = await encryptedIdentifierSchema.findOne({ wrn });
  if (!record) return next();

  console.log(req.headers);

  // Sends back the refershtoken and accesstoken
  const response: RequestRefreshtokenThroughGoogleResponse_V1 = {
    responseType: "OK",
    message: "OK",
    refreshtoken: "RANDOM_VALUE_NOT DEVELOPED_YET",
    accesstoken: "RANDOM_VALUE_NOT DEVELOPED_YET"
  };
  return res.status(200).send(response);
});

// Request is here when the identifier did not exist.
generateRefreshToken.post("", async (req: Request, res: Response, _next: NextFunction) => {
  const payload: RequestRefreshtokenThroughGooglePayload = req.body.payload;
  // const newIndentifier: IdentifierResource = createNewIdentifier();
  // const appropriateRefreshtoken = payload.macAddress;
  const newResource: Resource = {
    wrn: generateWrn("", RESOURCE_GROUP, RESOURCE_TYPE, DATABASE_CODE, payload.federalId, ""),
    ownerWrn: "", // none by default
    keyWrn: "",
    encryptedDek: "",
    ciphertextBlob: ""
  };

  await new encryptedIdentifierSchema(newResource).save();

  // Sends back the refershtoken and accesstoken
  const response: RequestRefreshtokenThroughGoogleResponse_V1 = {
    responseType: "new",
    message: "Created a new user",
    refreshtoken: "RANDOM_VALUE_NOT DEVELOPED_YET",
    accesstoken: "RANDOM_VALUE_NOT DEVELOPED_YET"
  };
  return res.status(200).send(response);
});

export default generateRefreshToken;