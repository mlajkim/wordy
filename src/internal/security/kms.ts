// Main
import dotenv from 'dotenv';
// external library
import Cryptr from 'cryptr';
// lambda
import { intoArray } from '../../type/sharedWambda';
// type
import { WordyEvent } from '../../type/wordyEventType';
import { Resource } from '../../type/resourceType';
import { Gateway } from '../../type/availableType';

/**
 * kmsGateway returns key data. 
 * KEY data never leaves kmsGateway. only takes the 
 * Wordy Encrpytion Service
 */


export const wesGateway = (requestedEvent: WordyEvent, type: "Decrypt" | "Encrypt"): WordyEvent => {
  // Validation
	if (requestedEvent.serverResponse === "Denied") return requestedEvent;

  // Record
	const GATEWAY_NAME: Gateway = "wesGateway"
	requestedEvent.validatedBy 
    ? requestedEvent.validatedBy.push(GATEWAY_NAME)  
    : requestedEvent.validatedBy = [GATEWAY_NAME];

  // By default
  requestedEvent.serverResponse = "Denied" // by default
	requestedEvent.serverMessage = `${GATEWAY_NAME} denied the request by default`; // by default

  // resources
  const resources = intoArray(requestedEvent.internalResource) as Resource[];

  if (typeof requestedEvent.internalResource === 'undefined') {
    // resource is empty. nothing to care about.
    requestedEvent.serverResponse = "Accepted" // by default
	  requestedEvent.serverMessage = `OK `; // by default
  };

  // ??
  dotenv.config(); // bring dotenv callable

  // begins 
  requestedEvent.internalResource = resources.map(resource => {
    if (resource.isEncrypted && type === 'Decrypt') {
      return encrpyt(resource, kms(resource));
    } else if (!resource.isEncrypted && type === 'Encrypt') {
      return decrypt(resource, kms(resource));
    } else return resource; // this resource does not require any action, logically.
  });
  
  // Finally
  return requestedEvent;
};

const encrpyt = (resource: Resource, key: string | null) => {
  // validator
  if (key === null) {
    resource.failedEncrpytion = 'failedEncryption';
    return resource;
  }

  // encryption happens
  const cryptr = new Cryptr(key);
  return cryptr.encrypt(JSON.stringify(resource.notEncrpytedData));
};

const decrypt = (resource: Resource, key: string | null) => {
  // validator
  if (key === null) {
    resource.isEncrypted = false;
    return resource;
  }

  // encryption happens
  const cryptr = new Cryptr(key);
  return JSON.parse(cryptr.decrypt(resource.ciphertextBlob));
}

const kms = (resource: Resource, clientCustomerKey?: string): string | null => {
  let { cmkWrn, encryptedDek, isClientEncrpyted} = resource;

  // if client encrypted and clientCustomerKey is given then runs this
  if (isClientEncrpyted === true && typeof clientCustomerKey === 'string') {
    const cryptr = new Cryptr(clientCustomerKey);
    encryptedDek = cryptr.decrypt(encryptedDek!);
  };

  // decrpytion of data encrpytion key happens here..
  if (typeof cmkWrn === 'undefined' || encryptedDek === 'undefined')
    { return null; }
  else if (cmkWrn === 'wrn::kms:master:env:1:210804') {
      const keyData = process.env.WRN__KMS_MASTER_ENV_1_210804!; 
      const cryptr = new Cryptr(keyData);
      return cryptr.decrypt(encryptedDek!);
  } else { 
    return null; 
  };
};

const test: Resource = {
  resourceVersion: "1.0.210804",
  wrn: "wrn::",
  isEncrypted: true
};

console.log(decrypt(test, "12345"));