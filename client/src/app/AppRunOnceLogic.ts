import axios from 'axios';
// Types
import { request, readCookie } from '../frontendWambda';

const appRunOnceLogic = () => {
  checkRefreshtoken();
  // checkAccesstoken();
};

const checkRefreshtoken = () => {
  // Check if validate refresh token exists
  const readRefreshToken = readCookie('WordyRefreshtoken');

  // if there is no refersh token
  // if refresh token is not read, it is not considred signed in, and therefore will do nothing else
  if (readRefreshToken !== '') {
    // 뭐가 있다는 것은 RefreshToken의 Validation을 체크할 필요가 있음. 그러기 위해서 먼저 페이지를 돌려버리자 ㅋㅋ
    
    // Validate the found refresh token with the server
    // It will reject the refesh token if is deleted from DB
    // refersh token of DB can be deleted with remote sign out
    validateExistingRefreshToken(readRefreshToken);
  };
};

const validateExistingRefreshToken = async (refreshToken: string) => {
  const response = request("signin:ValidateRefreshtoken", { refreshToken });

  const payload = [{
    refreshToken
  }];

  const eventResponse = await axios.post("/apigateway/v1/signin/validate/refreshtoken/1.0", payload);
  console.log(eventResponse);
  // store.dispatch(throwEvent(newEvent));
};





export default appRunOnceLogic;