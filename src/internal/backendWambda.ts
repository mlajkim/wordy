import { Request } from 'express';
import geoip from 'geoip-lite';
import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";

export const validateGoogleSigninToken = (token: string): boolean => {
  const verify = async () => {
    const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
    console.log(GOOGLE_CLIENT_ID); // testing
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    console.log("Below is the ticket data"); // Testing
    console.log(ticket); // Testing

    const payload = ticket.getPayload();
    console.log("Below is the payload data"); // Testing
    console.log(payload);
    
    if (typeof payload !== 'undefined') { // Testing
      console.log("Below is the payload['sub'] data"); // Testing
      console.log(payload['sub']); // Testing
    };
  }; // End of verify

  dotenv.config();
  verify().catch(err => console.log(err));

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