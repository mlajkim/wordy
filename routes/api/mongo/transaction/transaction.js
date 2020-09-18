const transactionRouter = require('express').Router();

const postTransactionRouter = require('./postTransaction');
const getTransaction = require('./getTransaction');

transactionRouter.use('/post', postTransactionRouter);
transactionRouter.use('/get', getTransaction);

module.exports = transactionRouter;