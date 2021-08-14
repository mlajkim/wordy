import { Request } from 'express';
import geoip from 'geoip-lite';
import { OAuth2Client } from 'google-auth-library';
import Cryptr from 'cryptr';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
// type
import { WordyEvent } from '../../type/wordyEventType';
import { Resource, PureResource } from '../../type/resourceType';
import { AvailableWpWrn, Wrn } from '../../type/availableType';
// For signing token
import dotenv from "dotenv";
// internal
import { kmsService } from '../security/kms';
import { wpService } from '../security/wp';


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

export const generatedWrn = (input: Wrn): Wrn => 
 `${input}${cryptoRandomString({length: 32, type: 'base64'})}`; // change this

export const intoPayload = (unrefinedResource: Resource, RE: WordyEvent): PureResource => {
  const { plainkey } = kmsService("Decrypt", unrefinedResource.encryptedDek!);
  const { decrypt } = new Cryptr(plainkey);
  // Get the data from mongo, and see if it is okay to be revealed
  let plainData = JSON.parse(decrypt(unrefinedResource.ciphertextBlob));
  plainData = wpService(RE, unrefinedResource, plainData, plainData.wpWrn as AvailableWpWrn); // wp service censors data, if it is not available

  return plainData;
}

export const modifyResource = (howModify: object, unmodifiedResource: Resource, RE: WordyEvent): Resource => {
  let plainData = intoPayload(unmodifiedResource, RE) as PureResource;
  plainData = { ...plainData, ...howModify}; // modify begins here
  return intoResource(plainData, unmodifiedResource.wrn, RE, plainData.wpWrn);
}

export const intoResource = (pureResource: any, newWrn: Wrn, RE: WordyEvent, wpWrn?: AvailableWpWrn, customized?: any): Resource => {
  const dateAdded = moment().valueOf();

  const kmsResult = kmsService("Encrypt", "");
  const { encrypt } = new Cryptr(kmsResult.plainkey);
  const plaindata: string = JSON.stringify({ 
    ...pureResource, wrn: newWrn, ownerWrn: RE.requesterWrn, 
    wpWrn: wpWrn ? wpWrn : "wrn::wp:pre_defined:backend:only_to_group_members:210811", // default value
    dateAdded
  });
  const ciphertextBlob = encrypt(plaindata);

  // new resource
  const newResource: Resource = {
    // data basic
    resourceVersion: "1.0.210804",
    dateAdded,
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

export const getNow = () => moment().valueOf();

export const getToday = (beginningDate?: number) => {
  // now must be defined first, as the moment that year changes may cause bug (barely hpapen tho) 
  const now = beginningDate ? moment(beginningDate) : moment();
  const year = parseInt(now.format('YYYY'));
  const month = parseInt(now.format('MM'));
  
  return { year, month, quarterly: (year % 100) * 10 + Math.ceil(month / 3) }
}

export const convertQuarterlyIntoMoment = (quarterlyInput: number) => {
  const WHICH_LAST_DAY = 6; // if 6, Saturday
  const AFTER_WHICH_HOURS = 12; // if 12, then 12pm of saturady;

  const year = Math.ceil((quarterlyInput / 10) + 2000)
  const month = quarterlyInput % 10 * 3 - 1; // 0 is actually jaunuary. 

  const potentialLastSaturdayAt12pm = moment({ year, month }).endOf('month').startOf('day').weekday(WHICH_LAST_DAY).add(AFTER_WHICH_HOURS, "hours");
  if (potentialLastSaturdayAt12pm.month() % 3 !== 2) return potentialLastSaturdayAt12pm.add(12, "hours").valueOf();
  else return potentialLastSaturdayAt12pm.valueOf();
} 