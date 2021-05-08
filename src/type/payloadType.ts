import { AvailableFederalProvider } from './availableType';

export type RequestRefreshTokenPayload_V1 = {
  federalProvider: AvailableFederalProvider;
  federalId: string;
  federalAuthorizationToken: string;
};