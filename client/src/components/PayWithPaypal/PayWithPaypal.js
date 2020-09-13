import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";


export default function PayWithPaypal(props) {
  const amount = props.amount.replace('$', ''); // remove dollar sign

  return (
    <div>
      <PayPalButton
        amount={amount}
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