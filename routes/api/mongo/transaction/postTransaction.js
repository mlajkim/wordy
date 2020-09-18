const postTransactionRouter = require('express').Router();
const transactionSchema = require('../../../../models/Transaction');


postTransactionRouter.post('', async (req, res) => {

  const newTransaction = new transactionSchema({
    userId: req.body.profile.UNIQUE_ID,
    data: req.body.data,
    details: req.body.details,
    
  })

  const response = await newTransaction.save();
  console.log(`
  ***NEW TRANSACTION (PURCHASE) ADDED***
  Name: ${req.body.profile.givenName} ${req.body.profile.familyName}
  Email address: ${req.body.profile.email}
  Price: 
  Subscription Type: ${req.body.details}
  `)
  res.send({data: response});
  
  console.log(req.body);

  res.send();
});

module.exports = postTransactionRouter;