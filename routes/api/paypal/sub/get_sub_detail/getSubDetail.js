const getSubDetailRouter = require('express').Router();
const fetch = require('node-fetch');

getSubDetailRouter.get('/sub_detail/with_subID_and_token/:subscription/:token', async (req, res) => {
  const subscriptionID = req.params.subscription;
  const token = req.params.token;

  // Get the details from paypal server
  endpoint = `https://api.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`;
  const data = await (await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })).json();

  // finally
  res.send(data);
});

module.exports = getSubDetailRouter;