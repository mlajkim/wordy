const accessTokenRouter = require('express').Router();
const request = require('request');

// CREDENTIAL
const {SANDBOX_PAYPAL_CLIENT_ID, SANDBOX_PAYPAL_CLIENT_SECRET} = require('../../../../credential');

accessTokenRouter.get('/get', async (req, res) => {
  const isSandbox = req.params.isSandbox === 'sandbox' ? '.sandbox' : '';

  var headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en_US'
  };
  var dataString = 'grant_type=client_credentials';

  var options = {
      url: `https://api/${isSandbox}.paypal.com/v1/oauth2/token`,
      method: 'POST',
      headers: headers,
      body: dataString,
      auth: {
          'user': `${SANDBOX_PAYPAL_CLIENT_ID}`,
          'pass': `${SANDBOX_PAYPAL_CLIENT_SECRET}`
      }
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(JSON.parse(body).access_token);
          res.send({
            status: 'success',
            data: JSON.parse(body).access_token
          });
      }
  }

  request(options, callback);
})

module.exports = accessTokenRouter;