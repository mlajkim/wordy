import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

// Credential
import {PAYPAL_CLIENT_ID} from '../../credential';

export default function PayWithPaypal(props) {
  const amount = props.amount.replace('$', ''); // remove dollar sign
  const option = {
    clientId: PAYPAL_CLIENT_ID
  }
  return (
    <div>
      <PayPalButton
        amount={amount}
        currency="USD"
        option={option}
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          alert("Transaction completed by " + details.payer.name.given_name);
          // OPTIONAL: Call your server to save the transaction
          return fetch("/paypal-transaction-complete", {
            method: "post",
            body: JSON.stringify({
              orderID: data.orderID
            })
          });
        }}
      />

    </div>
  );
}