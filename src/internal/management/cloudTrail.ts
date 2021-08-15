// The logger for any API calls..:)
// Type
import { WordyEvent, ServerResponse } from "../../type/wordyEventType";
import { Gateway } from '../../type/availableType';
import { IS_DEV_MODE } from '../../server';
// internal
import { wcsGateway } from '../billing/wcs';
// Mogno DB
// import { LogModel } from '../../models/EncryptedResource';
//Decalre
const SERVICE_NAME: Gateway = "cloudTrailGateway";

export const ctGateway = (RE: WordyEvent, setServerResponse?: ServerResponse, customMessage?: any): WordyEvent => {
  // apply the SR
  // if, setServerResponse is not given, then it sets denied, unless specified
  RE.serverResponse = setServerResponse ? setServerResponse : "Denied";

  // Write default comment
  if (RE.serverResponse === "Denied") {
    RE.serverMessage = customMessage ? customMessage :`The server rejected the following event: ${RE.eventType}`;
    RE = { status: IS_DEV_MODE ? 203: 403, ...RE } // this is to make sure developer can read printed event. main server wont reply anything
  } else if (RE.serverResponse === "LogicallyDenied") {
    RE.serverMessage = customMessage ? customMessage : `The server was not able to find resources for the following event: ${RE.eventType}`;
    RE = { status: 201, ...RE }
  } else if (RE.serverResponse === "Accepted") {
    RE.serverMessage = "OK"; // accepted data cannot have customer message.
    RE = { status: 200, ...RE }
    // console.log(WE);
    wcsGateway(RE);
  } else {
    RE.serverMessage = customMessage ? customMessage : `Check cloudTrail Gateway (ctGateway) this should not happen`;
    RE.serverResponse = "Denied"
    RE = { status: 500, ...RE }
  }

  // console.log(WE);

  // log saving with the policy
  // little confusing, but as long as it does not return the response of iamGateway, it is fine.
  // just taking the serverResponse data.
  // iamGateway(WE, SAVE_LOG_POLICY); 
  // this somehow saves WE.. hmmmmmmmm :( id ont know why

  // cloudTrail interestingly apply the service name input at the end
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  return RE;
};