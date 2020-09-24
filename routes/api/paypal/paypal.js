const paypalRouter = require('express').Router();
const accessTokenRouter = require('./access_token/accessToken');
const subRouter = require('./sub/sub');

paypalRouter.use('/access_token', accessTokenRouter);
paypalRouter.use('/sub', subRouter);

module.exports = paypalRouter;