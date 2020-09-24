
type Props = {
  profile: {UNIQUE_ID: String};
  setDataLoading: (arg0: boolean) => void;

}
export const change_user_db = async (props: Props, changingType: string, changingValue: string) => {
  props.setDataLoading(true);

  let endpoint = `/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/${changingType}`;
  await fetch(endpoint, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      value: `${changingValue}`
    })
  })

  endpoint = `/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/lastTransactionID`;
  await fetch(endpoint, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      value: ''
    })
  })

  props.setDataLoading(false);
}

// export const get_paypal_details = async() => {
//   // Get the user data first from database
//   let endpoint = `/api/mongo/user/get/withID/${props.profile.UNIQUE_ID}`;
//   const userRes = await (await fetch(endpoint)).json();

//   // Get the transaction
//   endpoint = `/api/mongo/transaction/get/withID/${userRes.data.lastTransactionID}`;
//   const transactionRes = await (await fetch(endpoint)).json();
//   if (transactionRes.status === 'null') return; // if empty

//   // Get the access token
//   const accessTokenResponse = await (await fetch(`/api/paypal/access_token/get/${sandbox}`)).json()

//   // Get the paypal response from backend
//   endpoint = `/api/paypal/sub/get/sub_detail/with_subID_and_token/${transactionRes.data.subscriptionID}/${accessTokenResponse.data}/${sandbox}`;
//   const paypalSubDetailResponse = await(await fetch(endpoint)).json();

//   // change the front end
//   let newProfile = props.profile;
//   let subInfo = {
//     hasData: true,
//     isActive: paypalSubDetailResponse.status === 'ACTIVE' ? true : false,
//     nextBillingDate: paypalSubDetailResponse.status === 'ACTIVE' ? paypalSubDetailResponse.billing_info.next_billing_time : null
//   };
//   newProfile.subInfo = subInfo;
//   return newProfile;
// }