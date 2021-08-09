// External Library
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
// Declare
dotenv.config();
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 5;

type Jwt = string;

export const generateJwt = (data: any): Jwt => {
  // Declare using dotenv
  dotenv.config();

  const signedJwt = jwt.sign(
    data, // this data is actually readable without key. 
    process.env.WORDY_ACCESS_TOKEN_JWT!, 
    {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d`
  }); 

  return signedJwt;
}