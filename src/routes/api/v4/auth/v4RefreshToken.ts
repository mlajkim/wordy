import express, { Request, Response } from 'express';
const v4RefreshToken = express.Router();
import { connectToMongoDB } from '../../../../utils';
// utils
import { generateToken, minimizeUserData } from '../../../../utils';
// Models
import userSchema from '../../../../models/Users';
// Type
import { User } from 'src/typesBackEnd';
// json
import response from '../../../../responseStandard.json';
import standard from '../../../../businessStandard.json';

v4RefreshToken.use(connectToMongoDB); // Connect to DB

v4RefreshToken.get("/:federalProvider/:federalID", async (req: Request, res: Response) => {
  const { federalProvider, federalID } = req.params;
  
  // Check if it exists
  const user: User = (await userSchema.findOne({ federalProvider, federalID }))?.toObject();

  // Handle when user does not exist
  if (!user) {
    const status = 404;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "The user does not exist"
    });
  };

  // Generaate new refresh token
  const refreshToken = generateToken(minimizeUserData(user), 'V4_REFRESH_TOKEN_SECRET');

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
      expiresIn: standard.V4_REFRESH_TOKEN_SECRET.expiresIn
    }
  });
});

export default v4RefreshToken;