import { Request } from 'express';
import geoip from 'geoip-lite';
import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";

// This function below is tested and verified on May 8, 2021
// By Jeongwoo Kim
export const validateGoogleSigninToken = (token: string): boolean => {
  dotenv.config(); // for reading .env file

  const verify = async () => {
    const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
    console.log(GOOGLE_CLIENT_ID); // testing
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    
    // If you want to see the details of response, use it.
    // https://developers.google.com/identity/sign-in/web/backend-auth
    await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
  }; // End of verify

  verify()
    .then(_res => { return true }) // if succeeding in verifiying signin of user through google signin API
    .catch(_err => { return false }); // if it fails

  return true;
};

export const getLocationFromIp = (req: Request) => {
  const ip = req.connection.remoteAddress;
  const area = geoip.lookup(ip as string);

  const result: { countryName: string | null, ip: string } = {
    countryName: area?.country || "Not Available",
    ip: ip || "Not Available"
  };

  return result;
};