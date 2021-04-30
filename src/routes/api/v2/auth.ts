const IS_ACCESS_TOKEN_EXPIRABLE = false;
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 6; 

import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const auth = express.Router();
dotenv.config();


auth.use((req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`[${req.body.lastName} ${req.body.lastName}] `);
  next();
})

// @POST: LOGIN
auth.post("/login", (req: Request, res: Response) => {
  const signInAttemptingUser = {
    federalProvider: req.body.federalProvider,
    federalID: req.body.federalID,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email
  };
  const accessToken = generateUserAccessToken(signInAttemptingUser, IS_ACCESS_TOKEN_EXPIRABLE);

  res.status(200).send({
    status: 200,
    error: false,
    message: 'OK: Successful Login',
    payloadType: 'accessToken and expires',
    payload: {
      accessToken: accessToken,
      expires: LOGIN_TOKEN_EXPIRES_IN_DAYS
    }
  });
});

// @FUNCTION
const generateUserAccessToken = (user: any, isExpriable: boolean) => {
  if (isExpriable) {
    return jwt.sign(
      user, 
      process.env.LOGIN_ACCESS_TOKEN_SECRET!, 
      {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d`
    }); 
  };

  // Create not expirable token
  return jwt.sign(
    user, 
    process.env.LOGIN_ACCESS_TOKEN_SECRET!
  ); 
}


export default auth;