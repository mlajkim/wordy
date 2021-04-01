import express, { NextFunction, Request, Response } from 'express';
const v4AccessToken = express.Router();
// Type
import { User } from 'src/typesBackEnd';
// Utils
import { connectToMongoDB, generateAccessToken } from '../../../../utils';
// JSON
import response from '../../../../responseStandard.json'
import business from '../../../../businessStandard.json'
//
import userSchema from '../../../../models/Users'

// v4AccessToken.use(authenticateUser); // Connect to DB
v4AccessToken.use(connectToMongoDB); // Connect to DB

v4AccessToken.use("", async (req: Request, res: Response, next: NextFunction) => {
  const { refreshtoken } = req.headers;
  const user: User = req.body.extractedUser = (await userSchema.findOne({ validRefreshToken: refreshtoken }))?.toObject();

  // If no such a user exists with the given refresh token, it is either expired, or invalid
  if (!user) {
    const status = 403;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Refresh Token given is either expired, not given, or incorrect."
    });
  }
  next();
});

v4AccessToken.get("", async (req: Request, res: Response) => {
  const user: User = req.body.extractedUser;
  const accessToken = generateAccessToken(user);

  const status = 200;
  return res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    details: "Access token successfully generated",
    payload: {
      accessToken,
      expiresIn: business.V4_ACCESS_TOKEN_SECRET.expiresIn
    }
  });
});

export default v4AccessToken;