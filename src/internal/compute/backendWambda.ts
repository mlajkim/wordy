import { Request } from 'express'
// type
import { WordyEvent } from '../../type/wordyEventType'
import { Resource, PureResource } from '../../type/resourceType'
import { AvailableWpWrn } from '../../type/availableType'
import Wrn, { DataType } from '../../type/wrn'
import { GeneralDeletionPayload } from '../../type/payloadType'
import { validateWrn } from '../../type/sharedWambda'
// Model
import { WordModel } from '../../models/EncryptedResource'
// Library
import geoip from 'geoip-lite'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import Cryptr from 'cryptr'
import cryptoRandomString from 'crypto-random-string'
import moment from 'moment'
import dotenv from "dotenv"
// internal
import { kmsService } from '../security/kms'
import { wpService } from '../security/wp'
// Declaare
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 5;


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
  const ip = req.socket.remoteAddress;
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
 `${input}${cryptoRandomString({length: 32, type: 'hex'})}`; // change this


// ! Octoboer, 2021
// removeResource는 어떠한 wrn도 삭제해주는 종합 툴입니다
// Requester의 WRN도 확인하여, 이 사람이 이 resource에대한 권한이 있는지 확인합니다.
// 무엇인가를 지운다는 것은 매우 민감한 작업이므로, 다양한 보안을 종합적으로 제어합니다
// removeResource는 반드시 데이터타입이 일치해야 합니다
// GeneralDeletionPayload

export const wordyDelete = (RE: WordyEvent, deletingWrns: Wrn[], dataType: DataType): GeneralDeletionPayload => {
  const RP: GeneralDeletionPayload = {
    totalCnt: deletingWrns.length, deletedCnt: 0, noPermissionCnt: 0, failedCnt:0,
    totalWrns: deletingWrns, deletedWrns: [], noPermissionWrns: [], failedWrns: [],
  }

  // ! 1) Loop through each resource (And check if not allowed datatype exists)
  deletingWrns
  .filter(wrn => {
    const didPass = validateWrn(wrn, dataType)
    if (didPass !== "NotPassed") { RP.noPermissionCnt++; RP.noPermissionWrns.push(wrn) }
    else return wrn
  })
  .map(async (wrn) => {
    // ? Handle when its word data ...
    if (dataType === "word:*") {
      const ER = await WordModel.findOne({ wrn }) as Resource | null
      if (ER !== null) {
        const DR = wordyDecrypt(ER, RE)
      }
    }
  })

  return RP // Returning Payload
}

// ER: Encrypted Resource
// RE: Requested Event
// RP: Returning Payload
export const wordyDecrypt = (ER: Resource, RE: WordyEvent): PureResource => {
  const { plainkey } = kmsService("Decrypt", ER.encryptedDek!);
  const { decrypt } = new Cryptr(plainkey);
  // Get the data from mongo, and see if it is okay to be revealed
  let plainData = JSON.parse(decrypt(ER.ciphertextBlob));
  plainData = wpService(RE, ER, plainData, plainData.wpWrn as AvailableWpWrn); // wp service censors data, if it is not available

  return plainData;
}

// this can be used, only when you change the data of PURE DATA, not the other supproting data such as dek value
export const modifyResource = (howModify: object, unmodifiedResource: Resource, RE: WordyEvent): Resource => {
  let plainData = wordyDecrypt(unmodifiedResource, RE) as PureResource;
  plainData = { ...plainData, ...howModify }; // modify begins here
  return wordyEncrypt(plainData, unmodifiedResource.wrn, RE, plainData.wpWrn);
}

export const wordyEncrypt = (pureResource: any, newWrn: Wrn, RE: WordyEvent, wpWrn?: AvailableWpWrn, customized?: any, modifableDate?: number): Resource => {
  const dateAdded = moment().valueOf();
  // objectOrder: dateAdded
  const kmsResult = kmsService("Encrypt", "");
  const { encrypt } = new Cryptr(kmsResult.plainkey);
  const plaindata: string = JSON.stringify({ 
    ...pureResource, wrn: newWrn, ownerWrn: RE.requesterWrn, 
    wpWrn: wpWrn ? wpWrn : "wrn::wp:pre_defined:backend:only_to_group_members:210811", // default value
    objectOrder: dateAdded,
    dateAdded,
    modifableUntil: modifableDate // if undefined, then it can be modifed (deleted) any time
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
};

export const generateJwt = (data: any) => {
  // Declare using dotenv
  dotenv.config();

  const signedJwt = jwt.sign(
    data, // this data is actually readable without key. 
    process.env.WORDY_ACCESS_TOKEN_JWT!, 
    {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d` 
  }); 

  return signedJwt;
};



