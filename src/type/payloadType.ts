import { AvailableFederalProvider } from './availableType';

export type SharedPayload = {
  macAddress: string;
}

export type RequestRefreshtokenThroughGooglePayload = SharedPayload & {
  federalProvider: AvailableFederalProvider;
  federalId: string;
  federalAuthorizationToken: string;
}