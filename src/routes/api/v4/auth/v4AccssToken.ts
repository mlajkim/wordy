import express, { NextFunction, Request, Response } from 'express';
const v4AccessToken = express.Router();
// Type
import { User } from 'src/typesBackEnd';
// Utils
import { connectToMongoDB, authenticateUser, generateToken, minimizeUserData } from '../../../../utils';
// JSON
import response from '../../../../responseStandard.json'
import business from '../../../../businessStandard.json'
//
import userSchema from '../../../../models/Users'

v4AccessToken.use(authenticateUser); // Connect to DB
v4AccessToken.use(connectToMongoDB); // Connect to DB

v4AccessToken.get("", async (req: Request, res: Response, next: NextFunction) => {
  const attemptRefreshToken = req.headers.authorization;
  const user = req.body.user;
  const { refreshToken} = (await userSchema.findOne({ _id: user.ID }))?.toObject();

  if (attemptRefreshToken !== refreshToken) {
    const status = 403;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Refresh Token has been destroyed."
    });
  }
  next();
});

v4AccessToken.get("", async (req: Request, res: Response) => {
  const user: User = req.body.user;
  const accessToken = generateToken(minimizeUserData(user), 'V4_ACCESS_TOKEN_SECRET');

  const status = 200;
  return res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    payload: {
      accessToken,
      expiresIn: business.V4_ACCESS_TOKEN_SECRET.expiresIn
    }
  });
});

export default v4AccessToken;