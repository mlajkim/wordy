// Models
import {Props, Profile, UserInfo, SubInfo} from './model';
import {has_token_expired} from './utils';

export const fetchPaypalPauseResumeSubscription = async (subInfo: SubInfo) => {
  const endpoint = `https://api.sandbox.paypal.com/v1/billing/subscriptions/${subInfo.subscriptionID}/suspend`;
  const newUserRes = await (await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + subInfo.accessToken
    },
    body: JSON.stringify({
      reason: "Customer-requested pause"
    })
  })).json();

  console.log(newUserRes);
    
};

export const get_paypal_token_then_refresh_state = async (props: Props) => {
  const profile: Profile = props.profile;
  const subInfo: SubInfo = props.profile.subInfo;

  // if the state has the sub data, and it has not expired yet.
  if (profile.subInfo.hasData && has_token_expired(subInfo.accessToken)) return profile.subInfo.accessToken;

  // get a new token from backend
  const sandbox = props.isSandbox ? 'sandbox' : null;
  let url = `/api/paypal/access_token/get${sandbox}`
  const newTokenResponse = await (await fetch(url)).json();
  const token = newTokenResponse.data;
  const tokenExpireAt: number = newTokenResponse.tokenExpireAt;

  // save into states too.
  props.setProfile({
    subInfo: {
      hasData: true,
      hasToken: true,
      tokenExpireAt: tokenExpireAt,
      accessToken: token
    }
  })
  
  return token;
};

export const get_fresh_subInfo_intostate = async (
  {isSandbox, setProfile, setDataLoading}: Props,
  {lastTransactionID}: UserInfo, 
  {hasData, accessToken}: SubInfo
) => {
  //begin
  setDataLoading(true);

  // get the last transaction data
  let url = `/api/mongo/transaction/get/withID/${lastTransactionID}`;
  const lastTransacitonData = await (await fetch(url)).json();

  // get the token for fetch
  // const token = get_paypal_token_then_refresh_state(isSandbox, setProfile, lastTransactionID, accessToken)
  
  // finally
  setDataLoading(false);
};