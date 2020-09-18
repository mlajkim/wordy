const getTransactionRouter = require('express').Router();
const transactionSchema = require('../../../../models/Transaction');

getTransactionRouter.get('', async (req, res) => {
  res.send();
});

module.exports = getTransactionRouter;