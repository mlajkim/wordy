import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

// Credential
import {SANDBOX_PAYPAL_CLIENT_ID, SANDBOX_PAYPAL_PLAN_ID} from '../../credential';

export default function PayWithPaypal(props) {
  const option = {
    vault: true,
    clientId: SANDBOX_PAYPAL_CLIENT_ID
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
            
            // Set up the front end
            let lastProfile = props.profile;
            lastProfile.userInfo.subscription = 'Pro'
            console.log(lastProfile);
            props.setProfile(lastProfile);

            // Set up the database as well
            // putUserRouter.put('/:uniqueId/one/:type', async (req, res) => {
            await fetch(`/api/mongo/user/${props.profile.UNIQUE_ID}/one/subscription`, {
              method: "put",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                value: 'Pro'
              })
            });

            // Fetch over | Loading Screen Ends
            props.setDataLoading(false);

            // OPTIONAL: Call your server to save the subscription
            return fetch("/api/paypal/checkout/save/transaction", {
              method: "post",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                details: details,
                data: data
              })
            });
            
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