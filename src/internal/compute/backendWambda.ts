import { Request } from 'express';
import geoip from 'geoip-lite';
import { OAuth2Client } from 'google-auth-library';
import Cryptr from 'cryptr';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
// For signing token
import dotenv from "dotenv";
// internal
import { kmsService } from '../security/kms';
import { wpService } from '../security/wp';
// type
import { WordyEvent } from '../../type/wordyEventType';
import { Resource } from '../../type/resourceType';
import { AvailableWpWrn, Wrn } from '../../type/availableType';

// This function below is tested and verified on May 8, 2021
// By Jeongwoo Kim
export const validateGoogleSigninToken = (token: string): boolean => {
  const verify = async () => {
    dotenv.config(); // for reading .env file
    const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
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

// Censors wrn 
export const censorUserWrn = (wrn: string | undefined) => {
  if (typeof wrn === 'undefined') return '';
  return wrn.substring(0, wrn.lastIndexOf(":") + 1);
}

export const generatedWrn = 
  (input: `${string}:${string}:${string}:mdb:${string}:`): string => 
  input + cryptoRandomString({length: 32, type: 'base64'}); // change this

export const intoPayload = (resource: Resource, RE: WordyEvent) => {
  const { plainkey } = kmsService("Decrypt", resource.encryptedDek!);
  const { decrypt } = new Cryptr(plainkey);
  // Get the data from mongo, and see if it is okay to be revealed
  let  user = JSON.parse(decrypt(resource.ciphertextBlob));
  user = wpService(RE, resource, user); // wp service censors data, if it is not available

  return user;
}

export const intoResource = (resource: any, newWrn: Wrn, RE: WordyEvent, wpWrn?: AvailableWpWrn, customized?: any): Resource => {
  const kmsResult = kmsService("Encrypt", "");
  const { encrypt } = new Cryptr(kmsResult.plainkey);
  const plaindata: string = JSON.stringify({ 
    ...resource, wrn: newWrn, ownerWrn: RE.requesterWrn, 
    wpWrn: wpWrn ? wpWrn : "wrn::wp:pre_defined:backend:only_to_group_members:210811" // default value
  });
  const ciphertextBlob = encrypt(plaindata);

  // new resource
  const newResource: Resource = {
    // data basic
    resourceVersion: "1.0.210804",
    dateAdded: moment().valueOf(),
    wrn: newWrn,
    ownerWrn: RE.requesterWrn,
    createdByWrn: RE.requesterWrn, // by default, the creater of resource is the initiator of event
    // Encrpytion
    encryptionMethod: kmsResult.encryptionMethod, //if this undefined? not encrpted
    cmkWrn: kmsResult.cmkWrn, // cmk data does not change.
    encryptedDek: kmsResult.encryptedDek,
    // Actual data
    ciphertextBlob,
    ...customized
  };

  // finally return
  return newResource;
};

export const getToday = () => {
  // now must be defined first, as the moment that year changes may cause bug (barely hpapen tho) 
  const now = moment();
  const year = parseInt(now.format('YYYY'));
  const month = parseInt(now.format('MM'));
  
  return { year, sem: (year % 100) * 10 + Math.ceil(month / 3) }
}