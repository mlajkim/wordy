import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const auth = express.Router();
dotenv.config();
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 6; 

// @POST: LOGIN
auth.post("/login", (req: Request, res: Response) => {
  const signInAttemptingUser = {
    federalProvider: req.body.federalProvider,
    federalID: req.body.federalID,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    imageUrl: req.body.imageUrl
  };
  const accessToken = generateUserAccessToken(signInAttemptingUser);

  res.status(200).send({
    status: 200,
    message: 'OK: Successful Login',
    payloadType: 'accessToken and expires',
    payload: {
      accessToken: accessToken,
      expires: LOGIN_TOKEN_EXPIRES_IN_DAYS
    }
  });
});

// @FUNCTION
const generateUserAccessToken = (user: any) => {
  return jwt.sign(user, process.env.LOGIN_ACCESS_TOKEN_SECRET!, {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d`)
}


export default auth;