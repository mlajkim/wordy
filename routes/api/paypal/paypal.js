const paypalRouter = require('express').Router();
const checkoutRouter = require('./checkout');

paypalRouter.use('/checkout', checkoutRouter);

module.exports = paypalRouter;
