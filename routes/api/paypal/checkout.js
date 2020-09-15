const checkoutRouter = require('express').Router();

// paypal
const paypal = require('@paypal/checkout-server-sdk');

// credential
const {SANDBOX_PAYPAL_CLIENT_ID, SANDBOX_PAYPAL_CLIENT_SECRET} = require('../../../credential');
// Creating an environment
let clientId = SANDBOX_PAYPAL_CLIENT_ID;
let clientSecret = SANDBOX_PAYPAL_CLIENT_SECRET;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


checkoutRouter.get('', (req, res) => {
  const currency_code = req.body.currency_code === undefined ? 'USD' : req.body.currency_code;
  const value = "0.99" // req.body.value;

  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody(
    {
      "intent": "CAPTURE",
      "purchase_units": [{
        "amount": {
          "currency_code": {currency_code},
          "value": {value}
        }
    }]
  });

  let createOrder  = async function(){
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from 
    // the result attribute of the response.
    console.log(`Order: ${JSON.stringify(response.result)}`);
  }

  createOrder();
  
})

module.exports = checkoutRouter;