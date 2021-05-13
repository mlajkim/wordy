import Cryptr from 'cryptr';
import { AvailableEncryptionAlgorithm } from '../../type/availableType';

export const kmsGateway = () => {

};


/**
 * 
 * This function by default sends back with 
 */
export const encryptData = (encryptingData: any, encrpytionKey: string, encryptionType: AvailableEncryptionAlgorithm) => {
  const encryptAes256Gcm = new Cryptr(encrpytionKey).encrypt;

  switch (encryptionType) {
    case 'AES-256-GCM':
      return encryptAes256Gcm(encryptingData);

    default:
      return encryptAes256Gcm(encryptingData);
  };
};


/**
 * 
 * This function by default sends back with 
 */
 export const decryptData = (decryptingData: any, decrpytionKey: string, decrpytionType: AvailableEncryptionAlgorithm) => {
  const decryptAes256Gcm = new Cryptr(decrpytionKey).decrypt;

  switch (decrpytionType) {
    case 'AES-256-GCM':
      return decryptAes256Gcm(decryptingData);
      
    default:
      return decryptAes256Gcm(decryptingData);
  };
};
