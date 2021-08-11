// The logger for any API calls..:)
// Type
import { WordyEvent, ServerResponse } from "../../type/wordyEventType";
import { Gateway } from '../../type/availableType';
// internal
import { wcsGateway } from '../billing/wcs';
// Mogno DB
// import { LogModel } from '../../models/EncryptedResource';
//Decalre
const SERVICE_NAME: Gateway = "cloudTrailGateway";

export const ctGateway = (WE: WordyEvent, setServerResponse?: ServerResponse, customMessage?: string): WordyEvent => {
  // apply the SR
  // if, setServerResponse is not given, then it sets denied, unless specified
  WE.serverResponse = setServerResponse ? setServerResponse : "Denied";

  // Write default comment
  if (WE.serverResponse === "Denied") {
    WE.serverMessage = customMessage ? customMessage :`The server rejected the following event: ${WE.eventType}`;
    WE.status = 403;
  } else if (WE.serverResponse === "LogicallyDenied") {
    WE.serverMessage = customMessage ? customMessage : `The server was not able to find resources for the following event: ${WE.eventType}`;
    WE.status = 204;
  } else if (WE.serverResponse === "Accepted") {
    WE.serverMessage = customMessage ? customMessage : `OK`;
    WE.status = 200;
    wcsGateway(WE);
  } else {
    WE.serverMessage = customMessage ? customMessage : `Check cloudTrail Gateway (ctGateway) this should not happen`;
    WE.serverResponse = "Denied"
    WE.status = 500;
  }

  // log saving with the policy
  // little confusing, but as long as it does not return the response of iamGateway, it is fine.
  // just taking the serverResponse data.
  // iamGateway(WE, SAVE_LOG_POLICY); 
  // this somehow saves WE.. hmmmmmmmm :( id ont know why

  // cloudTrail interestingly apply the service name input at the end
  WE.validatedBy 
    ? WE.validatedBy.push(SERVICE_NAME) 
    : WE.validatedBy = [SERVICE_NAME];

  return WE;
};