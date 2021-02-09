import express, { Request, Response } from 'express';
const v4RefreshToken = express.Router();
import { connectToMongoDB } from '../../../../utils';
// utils
import { generateToken } from '../../../../utils';
// Models
import userSchema from '../../../../models/Users';
// Type
import { User } from 'src/typesBackEnd';
// json
import authResponse from './authResponse.json';
import standards from '../../../../standards.json';

v4RefreshToken.use(connectToMongoDB); // Connect to DB

v4RefreshToken.get("/:federalProvider/:federalID", async (req: Request, res: Response) => {
  const { federalProvider, federalID } = req.params;
  
  // Check if it exists
  const user: User = (await userSchema.findOne({ federalProvider, federalID }))?.toObject();
  
  // Handle when user does not exist
  if (!user) {
    const status = 404;
    res.status(status).send({
      status: authResponse[status].status,
      message: authResponse[status].message
    });
  };

  // Generaate new refresh token
  const refreshToken = generateToken(user, 'V4_REFRESH_TOKEN_SECRET');

  // Replace the old refresh token (if it fials, send a repsonse 500 or something else)

  // When everything is set up reply the refresh token
  const status = 200;
  res.status(status).send({
    status: authResponse[status].status,
    message: authResponse[status].message,
    payload: {
      refreshToken,
      expiresIn: standards.V4_REFRESH_TOKEN_SECRET.expiresIn
    }
  });
});

export default v4RefreshToken;