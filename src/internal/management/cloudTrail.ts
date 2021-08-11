// The logger for any API calls..:)
// Type
import { WordyEvent, ServerResponse } from "../../type/wordyEventType";
import { Gateway } from '../../type/availableType';
// internal
import { wcsGateway } from '../billing/wcs';
// Mogno DB
// import { LogModel } from '../../models/EncryptedResource';
//Decalre
const SERVICE_NAME: Gateway = "cloudTrailGateway"

// Cloud Trail Response
type CTR = {
  WE: WordyEvent;
  status: 
    200 |
    403 | // access denied (even if you do not find the resource, ) (Denied)
    // status 401 is handled at apigateway. (Denied)
    404 |  // such content does not exist (NotFound)
    500; // internal server error. should never happen. 
  };

export const ctGateway = (WE: WordyEvent, SR: ServerResponse, customMessage?: string): CTR => {
  // apply the SR
  WE.serverResponse = SR;

  let ctr: CTR = { WE, status: 404 };

  // Write default comment
  if (WE.serverResponse === "Denied") {
    if (!customMessage) 
      WE.serverMessage = `The server rejected the following event: ${WE.eventType}`;
    ctr = { WE, status: 403 };
  } else if (WE.serverResponse === "NotFound") {
    if (!customMessage) 
      WE.serverMessage = `The server was not able to find resources for the following event: ${WE.eventType}`;
    ctr = { WE, status: 404 };
  } else if (WE.serverResponse === "Accepted") {
    if (!customMessage)
      WE.serverMessage = `OK`;
      wcsGateway(WE);
    ctr = { WE, status: 200 };
  } else {
    if (!customMessage) 
      WE.serverMessage = `Check cloudTrail Gateway (ctGateway) this should not happen`;
    WE.serverResponse = "Denied";
    ctr = { WE, status: 500 };
  }

  // Apply the status into the event
  WE.status = ctr.status; // this is applied, even without returning

  // log saving with the policy
  // little confusing, but as long as it does not return the response of iamGateway, it is fine.
  // just taking the serverResponse data.
  // iamGateway(WE, SAVE_LOG_POLICY); 
  // this somehow saves WE.. hmmmmmmmm :( id ont know why

  // cloudTrail interestingly apply the service name input at the end
  WE.validatedBy 
    ? WE.validatedBy.push(SERVICE_NAME) 
    : WE.validatedBy = [SERVICE_NAME];

  return ctr;
};