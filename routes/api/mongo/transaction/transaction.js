const transactionRouter = require('express').Router();

const postTransactionRouter = require('./postTransaction');

transactionRouter.use('/post', postTransactionRouter)

module.exports = transactionRouter;