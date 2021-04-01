import express, { NextFunction, Request, Response } from 'express';
const v4RefreshToken = express.Router();
import { connectToMongoDB } from '../../../../utils';
// utils
import { generateRefreshToken, generateAccessToken } from '../../../../utils';
// Models
import userSchema from '../../../../models/Users';
// Type
import { User } from 'src/typesBackEnd';
// json
import response from '../../../../responseStandard.json';

v4RefreshToken.use(connectToMongoDB); // Connect to DB

// Checker if the user exists
v4RefreshToken.use("/:federalProvider/:federalID", async (req: Request, res: Response, next: NextFunction) => {
  // Check if it exists
  const { federalProvider, federalID } = req.params;
  const user: User = req.body.userMongo = (await userSchema.findOne({ federalProvider, federalID }))?.toObject();

  // Handle when user does not exist
  if (!user) {
    const status = 404;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "The user does not exist"
    });
  } else next();
});

v4RefreshToken.get("/:federalProvider/:federalID", async (req: Request, res: Response) => {
  const user: User = req.body.userMongo;

  // Generaate new refresh token
  const refreshToken = generateRefreshToken(user);

  // Replace the old refresh token (if it fials, send a repsonse 500 or something else)
  await userSchema.findOneAndUpdate({
    federalProvider: user.federalProvider,
    federalID: user.federalID
  }, {
    refreshToken
  }, {useFindAndModify: false});

  // When everything is set up reply the refresh token
  const status = 200;
  res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    payload: {
      refreshToken,
      accessToken: generateAccessToken(user)
    }
  });
});

export default v4RefreshToken;