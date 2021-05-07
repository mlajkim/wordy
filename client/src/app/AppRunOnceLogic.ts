import axios from 'axios';
// Types
import { readCookie } from '../frontendWambda';

const appRunOnceLogic = () => {
  checkRefreshToken();
  
};

const checkRefreshToken = () => {
  // Check if validate refresh token exists
  const readRefreshToken = readCookie('WordyRefreshToken');
  console.log(readRefreshToken); // testing

  // if there is no refersh token
  // if refresh token is not read, it is not considred signed in, and therefore will do nothing else
  if (readRefreshToken !== '') {
    // Validate the found refresh token with the server
    // It will reject the refesh token if is deleted from DB
    // refersh token of DB can be deleted with remote sign out
    validateExistingRefreshToken(readRefreshToken);
  };
};

const validateExistingRefreshToken = async (refreshToken: string) => {
  const payload = [{
    refreshToken
  }];

  const eventResponse = await axios.post("/apigateway/v1/signin/refreshtoken/validate/1.0", payload);
  console.log(eventResponse);
  // store.dispatch(throwEvent(newEvent));
};





export default appRunOnceLogic;