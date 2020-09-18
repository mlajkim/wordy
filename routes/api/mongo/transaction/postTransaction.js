const postTransactionRouter = require('express').Router();
const transactionSchema = require('../../../../models/Transaction');


postTransactionRouter.post('', async (req, res) => {
  const price = req.body.details.billing_info.last_payment.amount;

  // Save into database
  const newTransaction = new transactionSchema({
    userId: req.body.profile.UNIQUE_ID,
    accessToken: req.body.data.facilitatorAccessToken,
    subscriptionID: req.body.data.subscriptionID
  })
  const response = await newTransaction.save();

  // Input in the express server
  console.log(`
  ***NEW TRANSACTION (PURCHASE) ADDED***
  Name: ${req.body.profile.givenName} ${req.body.profile.familyName}
  Email address: ${req.body.profile.email}
  Price: ${price.value} ${price.currency_code}
  Subscription Type: ${req.body.details}
  `)

  res.send({data: response});
  
});

module.exports = postTransactionRouter;