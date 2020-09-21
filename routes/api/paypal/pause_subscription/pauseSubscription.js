const pauseSubscriptionRouter = require('express').Router();
const request = require('request');
const fetch = require('node-fetch');

pauseSubscriptionRouter.get('/pause/with_subID_and_token/:subscription/:token', async (req, res) => {
    const token = req.params.token;
//     // force
//   var headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//   };    
//   var dataString = JSON.stringify({ "reason": "Item out of stock" });

//   var options = {
//       url: `https://api.sandbox.paypal.com/v1/billing/subscriptions/${req.params.subscription}/suspend`,
//       method: 'POST',
//       headers: headers,
//       body: dataString
//   };

//   function callback(error, response, body) {
//       if (!error && response.statusCode == 200) {
//           res.send({
//             status: 'success',
//             data: JSON.parse(body)
//           });
//       }
//   }
//   console.log(options);
//   request(options, callback);
  const pause_resume_type = {
    'pause': {
      'formal': 'suspend',
      'past': 'paused'
    },
    'resume': {
      'formal': 'activate',
      'past': 'resumed'
    }
  };
  const user_chosen = 'resume';
  const type = pause_resume_type[user_chosen].formal;

  const url = `https://api.sandbox.paypal.com/v1/billing/subscriptions/${req.params.subscription}/${type}`;
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "reason": 'User deactivated the sub.'
    })
  });
  console.log(data.status);
  let message, status = "";
  if(data.status === 204) {
    status = "Success"
    message=`Subscription Successfully ${pause_resume_type[user_chosen].past}`
  } else if (data.status === 422) { 
    status = "Warning"
    message=`It has been already ${pause_resume_type[user_chosen].past}.`
  } else {
    status = "Error",
    message = "Unknown error. Figure it out."
  }
  res.send({
    status,
    message
  });
})

module.exports = pauseSubscriptionRouter;