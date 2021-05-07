import { GoogleResponse } from '../type/generalType';
import { RequestRefreshtokenResponse } from '../type/eventResponseType';
import axios from 'axios';

const appSigninLogic = async (googleResponse: GoogleResponse) => {
  const payload = [{
    federalProvider: 'google',
    federalId: googleResponse.googleId
  }];

  const eventResponse: RequestRefreshtokenResponse = await axios.post("/apigateway/v1/signin/request/refreshtoken/1.0", { payload });
  console.log(eventResponse);
};

export default appSigninLogic;