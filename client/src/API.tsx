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

export const validate_and_return_paypaltoken_get_if_expired = async (props: Props) => {
  const profile: Profile = props.profile;
  const subInfo: SubInfo = props.profile.subInfo;

  // if user has never purchased (has no lastTransaction, return no token)
  if (!profile.userInfo.lastTransactionID) return null;

  // if the state has the sub data, and it has not expired yet. So end this function.
  if (profile.subInfo.hasData && has_token_expired(subInfo.accessToken)) return profile.subInfo.accessToken;

  // if not, get a new token from backend
  const sandbox = props.isSandbox ? 'sandbox' : null;
  let url = `/api/paypal/access_token/get${sandbox}`
  const newTokenResponse = await (await fetch(url)).json();
  const token = newTokenResponse.data;
  const tokenExpireAt: number = newTokenResponse.tokenExpireAt;

  // save into states too. (Still, use the returned token, since its async)
  // This is convinent feature, but do not rely on it.
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

export const get_fresh_subInfo_intostate = async (props: Props) => {
  // begin
  const sandbox = props.isSandbox ? 'sandbox' : null;
  const subscriptionID = props.profile.subInfo.subscriptionID;

  // get the token
  const token = validate_and_return_paypaltoken_get_if_expired(props)

  // Access to paypal with backend
  let url = `/api/paypal/sub/get/sub_detail/with_subID_and_token/${subscriptionID}/${token}/${sandbox}`;
  const subDetailResponse = await (await fetch(url)).json();
  
  // finally, set into it
  props.setProfile({
    subInfo: {
      isActive: subDetailResponse.status === 'ACTIVE' ? true : false,
      nextBillingDate: subDetailResponse.status === 'ACTIVE' ? subDetailResponse.billing_info.next_billing_time : null
    }
  })
};