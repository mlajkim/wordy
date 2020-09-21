const paypalRouter = require('express').Router();
const accessTokenRouter = require('./access_token/accessToken');
const pauseResumeSubRouter = require('./pause_resume_sub/pauseResumeSub');

paypalRouter.use('/access_token', accessTokenRouter);
paypalRouter.use('/sub', pauseResumeSubRouter);

module.exports = paypalRouter;