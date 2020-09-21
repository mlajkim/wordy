const paypalRouter = require('express').Router();
const accessTokenRouter = require('./access_token/accessToken');
const pauseSubscriptionRouter = require('./pause_subscription/pauseSubscription');

paypalRouter.use('/access_token', accessTokenRouter);
paypalRouter.use('/sub', pauseSubscriptionRouter);

module.exports = paypalRouter;