// CREDENTIAL

export const fetchPaypalPauseResumeSubscription = async (
  subscriptionID: String, //I-12312482489
  accessToken: String,
  type: String, // pause or resume
) => {
  const endpoint = `https://api.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}/suspend`;
  const newUserRes = await (await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    body: JSON.stringify({
      reason: "Customer-requested pause"
    })
  })).json();

  console.log(newUserRes);
    
};