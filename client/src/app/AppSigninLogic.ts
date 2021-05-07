import { GoogleResponse } from '../type/generalType';
import axios from 'axios';

const appSigninLogic = async (googleResponse: GoogleResponse) => {
  const payload = [{
    federalProvider: 'google',
    federalId: googleResponse.googleId
  }];

  const eventResponse = await axios.post("/apigateway/v1/signin/blank/signin/1.0", payload);
  console.log(eventResponse);
};

export default appSigninLogic;