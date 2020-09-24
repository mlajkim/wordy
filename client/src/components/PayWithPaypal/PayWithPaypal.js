import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

// Credential
import {
  REAL_PAYPAL_CLINET_ID,
  SANDBOX_PAYPAL_CLIENT_ID, 
  SANDBOX_PAYPAL_PLAN_ID
} from '../../credential';

export default function PayWithPaypal(props) {
  const option = {
    vault: true,
    clientId: props.isSandbox ? SANDBOX_PAYPAL_CLIENT_ID : REAL_PAYPAL_CLINET_ID
  }

  return (
    <div>
      <PayPalButton
        options={option}
        intent="subscription"
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: SANDBOX_PAYPAL_PLAN_ID
          });
        }}
        onApprove={(data, actions) => {
          // Capture the funds from the transaction
          return actions.subscription.get().then(async function(details) {
            // Loading Screen Begins
            props.setDataLoading(true);

            // Off the Modal
            props.setModal('');

            // Set up the database as well
            await fetch(`/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/subscription`, {
              method: "put",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                value: 'Pro'
              })
            });

            // Save the transaction
            const tranPostRes = await fetch("/api/mongo/transaction/post", {
              method: "post",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                profile: props.profile,
                data: data,
                details: details,
                isSandbox: props.isSandbox
              })
            }).then(res => res.json());

            // Make sure that the user has its own last transaction ID
            const userData = await (await fetch(`/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/lastTransactionID`, {
              method: 'PUT',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                value: tranPostRes.data._id
              })
            })).json();

            // Set up the front end finally
            let lastProfile = props.profile;
            lastProfile.userInfo = userData.data;
            props.setProfile(lastProfile);
            
            // Fetch over | Loading Screen Ends
            props.setDataLoading(false);

          });
        }}
      />
      

    </div>
  );
}
/**
 * 
 * 
 <PayPalButton
        amount={amount}
        currency="USD"
        option={option}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          // OPTIONAL: Call your server to save the transaction
          return fetch("/api/paypal/checkout/save/transaction", {
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              details: details,
              data: data
            })
          });
        }}
      />


 */