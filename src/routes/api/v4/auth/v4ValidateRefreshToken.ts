import express, { Request, Response, NextFunction } from 'express';
const v4ValidateRefreshToken = express.Router();
import { connectToMongoDB, generateToken, minimizeUserData } from '../../../../utils';
// Types
import { User } from '../../../../typesBackEnd';
// Models
import userSchema from '../../../../models/Users';
// json
import response from '../../../../responseStandard.json';
import business from '../../../../businessStandard.json'

v4ValidateRefreshToken.use(connectToMongoDB); // Connect to DB

v4ValidateRefreshToken.use("", (req: Request, res: Response, next: NextFunction) => {
  // Check if it exists
  const refreshToken = req.headers.refreshtoken;

  // Handle when user does not exist
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    const status = 406;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Refresh token not given or invalid form"
    });
  }; 
  
  next();
});


v4ValidateRefreshToken.post("", async (req: Request, res: Response) => {
  const refreshToken = req.headers.refreshtoken;

  const user: User = (await userSchema.findOne({ validRefreshToken: refreshToken }))?.toObject();

  // if no user found, it represents it is either expired or invalid
  if (!user) {
    const status = 404;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "User not found. Expired or incorrect refresh token, requiring re-sign in."
    });
  }

  // if user exists, it means it is correct. I will send the access token just in case.
  const status = 200;
  res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    payload: {
      accessToken: generateToken(minimizeUserData(user), 'V4_ACCESS_TOKEN_SECRET'),
      expiresIn: business.V4_ACCESS_TOKEN_SECRET.expiresIn
    }
  });
 
});

export default v4ValidateRefreshToken;