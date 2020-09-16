import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

// Credential
import {SANDBOX_PAYPAL_CLIENT_ID} from '../../credential';

export default function PayWithPaypal(props) {
  const amount = props.amount.replace('$', ''); // remove dollar sign
  const option = {
    clientId: SANDBOX_PAYPAL_CLIENT_ID
  }
  return (
    <div>
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

    </div>
  );
}