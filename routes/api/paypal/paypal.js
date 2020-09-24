const paypalRouter = require('express').Router();
const accessTokenRouter = require('./access_token/accessToken');
const subRouter = require('./sub/sub');

paypalRouter.use('/:isSanbox/access_token', accessTokenRouter);
paypalRouter.use('/:isSanbox/sub', subRouter);

module.exports = paypalRouter;