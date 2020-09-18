const getTransactionRouter = require('express').Router();
// Mongoose Schema
const transactionSchema = require('../../../../models/Transaction');
const userSchema = require('../../../../models/User');

getTransactionRouter.get('/withID/:lastTransactionID', async (req, res) => {
  // get the data with the transaction
  const data = await transactionSchema.findById(req.params.lastTransactionID);

  res.send({
    status: data === undefined ? 'fail' : 'success',
    data: data
  });
});

module.exports = getTransactionRouter;