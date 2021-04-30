import { Request } from 'express';
import geoip from 'geoip-lite';

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

  if (!null)
    return {
      partition: groups!.partition, 
      action: groups!.action
    };
}