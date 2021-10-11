// Types
import { WordyEvent } from './wordyEventType';
import { FederalProvider, DisplayableLn } from './availableType';
import { AddableLanguage } from './generalType';
import Wrn from './wrn'
import { WordPureEditable, ResourceId , WordPure} from './resourceType'
import { LegacyPureWord } from './legacyType'
// External
import moment from 'moment';


// language selector (sln = selcet language)
export const sln = (RE: WordyEvent): DisplayableLn => {
  if (!RE.requesterInfo) return "en";
  return RE.requesterInfo.ln ? RE.requesterInfo.ln : "en";
}

// Aug 14, 2021
export const convertFederalProvider = (federalProvider: FederalProvider) => {
  switch (federalProvider) {
    case "google":
      return "end_user";
    default:
      return "anonymous";
  }
};

export const pushDataEvenUndefined = (pushingData: any, pushingArr: any[] | undefined): any[] => {
  if (typeof pushingArr === "object") pushingArr.push(pushingData) 
  else if (typeof pushingArr === "undefined") pushingArr = [pushingData];

  return pushingArr;
}

export const getEventName = (givenOriginalUrl: string) => {  
  const regex = /\/apigateway\/event\/(?<partition>.*)\/(?<action>.*)/g;
  const { groups } = regex.exec(givenOriginalUrl)!;

  if (!groups)
    return {
      partition: groups!.partition, 
      action: groups!.action
    };
}

/**
 * 
 * @param wrn 
 * Gets the wordy resource name (WRN) and pases into an object. 
 * Has a 'extraForFutureUsage' place for future usage
 * Has 6 semi colons seperate 7 datasets
 * The header 'wrn' is to let developers know that it is wrn type
 * wrn data is not for public usage and should not be sent to clients.Only internal usage
 * 
 * 
 * @SampleWrn
    wrn::user:root:mdb:752172340000:39a5d8034106b19350b5764e4bc4058d
    wrn::kms:cmk:awsddb::7c97d9830cf92a8b70706cb674171f71
    wrn::kms:masterkey:env::9e768a4efeb30ede9d80c7ddec14bda7
    wrn::word::awsddb::7c97d9830cf92a8b70706cb674171fdf
    IDENTIFIER wrn::identifier:google:mdb:7312903141209319023823:

 * 
 * @returns 
 *  Returns an object with 
 */
export const readWrn = (wrn: string) => {  
  const regex = /wrn:(?<reservedForFutureUse>.*):(?<resourceGroup>.*):(?<resourceType>.*):(?<databaseCode>.*):(?<publicId>.*):(?<privateId>.*)/g;
  const { groups } = regex.exec(wrn)!;

  if (!groups)
    return {
      reservedForFutureUse: "", // by default at this point
      resourceGroup: groups!.resourceGroup, 
      resourceType: groups!.resourceType, 
      databaseCode: groups!.databaseCode, 
      publicId: groups!.publicId, 
      privateId: groups!.privateId
    };
}


/**
 * 
 * 
 */

 export const languageCodeIntoUserFriendlyFormat = (languageCode: AddableLanguage) => {
  switch(languageCode) {
    case 'ko':
      return '한국어🇰🇷'
    case 'en':
      return 'English🇺🇸'
    case 'ja':
      return '日本語🇯🇵' // chinese not yet
    case 'zh':
      return '中文 (简体)🇨🇳'
    default:
      return '?'
  }
};


export const intoArray = (inputData: any): any[] => {
  if (typeof inputData === "object") return Array.isArray(inputData) ? inputData : [inputData];
  if (typeof inputData === "undefined") return [];
  
  return [inputData];
};

// moment.now() gets the time in millisecond such as 123452582575
export const runAfter = (second: number) => moment.now() + (second * 1000);

export const now = () => moment.now();

// Commented on Aug 4, 2021
// takes wrn valuesa and compare with it.
// it also can handle following
// word:* // word:postWords (allowed)
export const validateWrn = (target: string, validator: string): "Passed" | "NotPassed" => {
  const targetArr = target.split(":");
  const validatorArr = validator.split(":");

  for (const [idx, validator] of validatorArr.entries()) {
    if (validator === "*") { // allows all before
      return "Passed"; // done.
    } else if (validator !== targetArr[idx]) {
      return "NotPassed"; // done
    } else {
      if (targetArr.length === idx + 1) return "Passed";
    }
  }; // end of for loop;

  return 'NotPassed'; // by default
};


export const CreateMyOkrUserNameRule = (name: string): "Passed" | "NotPassed" => {
  name = name.trim(); // tirm any space
  if (name.length < 3 || name.length > 20) return "NotPassed";

  // by default
  return "Passed";
}

export const extractLegacyId = (type: "user", wrn: Wrn): { isSuccess: boolean, legacyId: string } => {
  if (type === "user") {
    // currently legacyIdWrn is converted in such
    // wrn::user:end_user:mdb:${}
    return { isSuccess: true, legacyId: wrn.split(":")[5] }
  }

  return { isSuccess: false, legacyId: "" }
}

export const removeArrayElementsFromArray = (original: any[], deleting: any[]) => {
  return original.filter(el =>  deleting.findIndex(y => y === el) === -1)
}

// ! October, 2021
export const convertLegacyWordIntoPureWord = (editedData: WordPureEditable, originalData: LegacyPureWord): ResourceId & WordPure => {
  const { wrn, ownerWrn, dateAdded, order, wpWrn, legacyId, isEncrypted } = originalData

  return {
    wrn, ownerWrn, dateAdded,
    objectOrder: order, wpWrn,
    isEncrypted, legacyId: legacyId ? legacyId : "",
    ...editedData
  }
} 