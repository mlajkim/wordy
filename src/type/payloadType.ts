import { AvailableFederalProvider } from './availableType';


export type wordDetectLanguagePayload = { language: string, isReliable: boolean, confidence: number }[];

export type SharedPayload = {
  macAddress: string;
}

export type RequestRefreshtokenThroughGooglePayload = SharedPayload & {
  federalProvider: AvailableFederalProvider;
  federalId: string;
  federalAuthorizationToken: string;
  macAddress: string;
}