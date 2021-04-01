import express, { NextFunction, Request, Response } from 'express';
const v4SignIn = express.Router();
import { connectToMongoDB } from '../../../../utils';
// utils
import { generateAccessToken, generateRefreshToken } from '../../../../utils';
// Models
import userSchema from '../../../../models/Users';
// Type
import { User } from 'src/typesBackEnd';
// json
import response from '../../../../responseStandard.json';

v4SignIn.use(connectToMongoDB); // Connect to DB

// Chcek if the user himself or herself exsits in our cloud
v4SignIn.use("", async (req: Request, res: Response, next: NextFunction) => {
  // Check if it exists
  const { federalprovider, federalid } = req.headers;
  const user: User = req.body.extractedUser = (await userSchema.findOne({ 
    federalProvider: federalprovider, 
    federalID: federalid 
  }))?.toObject();

  // Handle when user does not exist
  if (!user) {
    const status = 404;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "The user does not exist",
      payload: {
        isSignInSuccessful: false
      }
    });
  }

  next();  
});

// With the above checkers, it assumes the user has been identified and therefore can 
// securely return refresh and accessToken
v4SignIn.post("", async (req: Request, res: Response) => {
  const user: User = req.body.extractedUser;

  //Generate refresh token, only when user has no refresh token saved.
  if (typeof user.validRefreshToken === 'undefined') {
    user.validRefreshToken = generateRefreshToken(user);
  }

  // Generaate accesstoken based on the user
  const accessToken = generateAccessToken(user);

  // Replace the old refresh token (if it fials, send a repsonse 500 or something else)
  await userSchema.findOneAndUpdate({
    federalProvider: user.federalProvider,
    federalID: user.federalID
  }, {
    validRefreshToken: user.validRefreshToken
  }, {useFindAndModify: false});

  // When everything is set up reply the refresh token
  const status = 200;
  res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    payload: {
      isSignInSuccessful: true,
      refreshToken: user.validRefreshToken,
      accessToken
    }
  });
});

export default v4SignIn;