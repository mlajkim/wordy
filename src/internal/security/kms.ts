// Main
import dotenv from 'dotenv';
// type
import { WordyEvent } from '../../type/wordyEventType';
import { Policy, Gateway } from '../../typesBackEnd';

const KEY_POLICY: Policy = {
  version: "1.0.210729",
  comment: "Allow everyone to use the key",
  statement: {
    effect: "Allow",
    principal: "*",
    action: "kms:decryptDek"
  }
};

/**
 * kmsGateway returns key data. 
 * KEY data never leaves kmsGateway. only takes the 
 */


export const kmsGateway = (requestedEvent: WordyEvent): WordyEvent => {
  // Validation
	if (requestedEvent.serverResponse === "Denied") return requestedEvent;

  // Record
	const GATEWAY_NAME: Gateway = "kmsGateway"
	requestedEvent.validatedBy 
    ? requestedEvent.validatedBy.push(GATEWAY_NAME)   
    : requestedEvent.validatedBy = [GATEWAY_NAME]; 

  // By default
  requestedEvent.serverResponse = "Denied" // by default
	requestedEvent.serverMessage = `${GATEWAY_NAME} denied the request by default`; // by default

  dotenv.config(); // bring dotenv callable

  


  return requestedEvent;
};

const hiddenDecrpyt = () => {

};


const encryptedDek = "quwer9hsifusuifnsf";
kmsGateway(encryptedDek, "wrn::kms:master:env:1:210804")

 