import { Request } from 'express';
import geoip from 'geoip-lite';
// Types
import { AddableLanguage } from './generalType';


export const getLocationFromIp = (req: Request) => {
  const ip = req.connection.remoteAddress;
  const area = geoip.lookup(ip as string);

  const result: { countryName: string | null, ip: string } = {
    countryName: area?.country || "Not Available",
    ip: ip || "Not Available"
  };

  return result;
};

export const getEventName = (givenOriginalUrl: string) => {
  console.log(givenOriginalUrl);
  
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
 * 
 * @returns 
 *  Returns an object with 
 */
export const readWrn = (wrn: string) => {  
  const regex = /wrn:(?<reservedForFutureUse>.*):(?<serviceName>.*):(?<resourceType>.*):(?<databaseCode>.*):(?<publicId>.*):(?<privateId>.*)/g;
  const { groups } = regex.exec(wrn)!;

  if (!groups)
    return {
      reservedForFutureUse: "", // by default at this point
      serviceName: groups!.serviceName, 
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