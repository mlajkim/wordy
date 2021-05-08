import { GoogleResponse } from '../type/generalType';
import axios from 'axios';
// shared types
import { addOrUpdateCookie } from '../frontendWambda';
import { RequestRefreshTokenPayload_V1 } from '../type/payloadType';
import { RequestRefreshtokenResponse_V1 } from '../type/eventResponseType';

export const googleSigninLogic = async (googleResponse: GoogleResponse) => {
  const payload: RequestRefreshTokenPayload_V1 = {
    federalProvider: 'google',
    federalId: googleResponse.googleId,
    federalAuthorizationToken: googleResponse.tokenObj.access_token
  };

  // Request for refresh token to Backend
  const eventResponse: RequestRefreshtokenResponse_V1 = await axios.post("/apigateway/v1/signin/request/refreshtoken/1.0", { payload });

  // If accepted with OK, it will send the value
  if (eventResponse.responseType === 'OK') {
    addOrUpdateCookie('WordyRefreshtoken', eventResponse.refreshToken);
    addOrUpdateCookie('WordyAccesstoken', eventResponse.accessToken); // WordyAnonymousToken
  };
  console.log(eventResponse);
};

export const anonymousSigninLogic = async () => {
  const payload: RequestRefreshTokenPayload_V1 = {
    federalProvider: 'anonymous',
    federalId: 'not_defined',
    federalAuthorizationToken: 'not_defined'
  };

  const eventResponse: RequestRefreshtokenResponse_V1 = await axios.post("/apigateway/v1/signin/request/refreshtoken/1.0", { payload });

  // If accepted with OK, it will send the value
  if (eventResponse.responseType === 'OK') {
    addOrUpdateCookie('WordyAnonymousAccesstoken', eventResponse.accessToken); // WordyAnonymousToken
  };
  console.log(eventResponse);
};

