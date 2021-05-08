import { GoogleResponse } from '../type/generalType';
import axios from 'axios';
// shared types
import { addOrUpdateCookie } from '../frontendWambda';
import { RequestRefreshtokenThroughGooglePayload } from '../type/payloadType';
import { RequestRefreshtokenThroughGoogleResponse_V1 } from '../type/eventResponseType';

export const googleSigninLogic = async (googleResponse: GoogleResponse) => {
  const payload: RequestRefreshtokenThroughGooglePayload = {
    federalProvider: 'google',
    federalId: googleResponse.googleId,
    federalAuthorizationToken: googleResponse.tokenObj.id_token,
    macAddress: "mac_address"
  };

  // Request for refresh token to Backend
  const eventResponse: RequestRefreshtokenThroughGoogleResponse_V1 = await axios.post("/apigateway/v1/signin/request_refreshtoken_through_google/1.0", { payload });
  console.log(eventResponse); // test
  // If accepted with OK, it will send the value
  if (eventResponse.responseType === 'OK') {
    addOrUpdateCookie('WordyRefreshtoken', eventResponse.refreshtoken);
    addOrUpdateCookie('WordyAccesstoken', eventResponse.accesstoken); // WordyAnonymousToken
  };
};

